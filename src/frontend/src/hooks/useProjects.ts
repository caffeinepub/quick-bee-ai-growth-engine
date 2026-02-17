import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useGetCallerUserProfile } from './useCurrentUserProfile';
import type { Project } from '../backend';

export function useGetProjects() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: profile } = useGetCallerUserProfile();

  return useQuery<Project[]>({
    queryKey: ['projects', profile?.agency],
    queryFn: async () => {
      if (!actor || !profile?.agency) return [];
      const allProjects = await actor.getProjects();
      return allProjects.filter(p => p.agency === profile.agency);
    },
    enabled: !!actor && !actorFetching && !!profile?.agency,
  });
}

export function useAddProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (project: Project) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProject(project);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

export function useUpdateProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (project: Project) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProject(project.id, project);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

export function useCompleteProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      if (!actor) throw new Error('Actor not available');
      // Backend doesn't have completeProject, use updateProject with completed status
      const projects = await actor.getProjects();
      const project = projects.find(p => p.id === projectId);
      if (!project) throw new Error('Project not found');
      
      const updatedProject = { ...project, status: 'Completed', completion: BigInt(100) };
      return actor.updateProject(projectId, updatedProject);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}
