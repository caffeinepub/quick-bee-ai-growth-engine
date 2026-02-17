import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useDemoSession } from './useDemoSession';
import { useGetUserRole } from './useQueries';
import { useGetCallerUserProfile } from './useCurrentUserProfile';
import { isClientOrHigher, isManagerOrAdmin } from '../utils/rbac';
import type { Project } from '../backend';
import { toast } from 'sonner';

export function useGetProjects() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: profile } = useGetCallerUserProfile();
  const { data: role } = useGetUserRole();

  return useQuery<Project[]>({
    queryKey: ['projects', profile?.agency],
    queryFn: async () => {
      if (!actor || !profile?.agency) return [];
      if (!isClientOrHigher(role)) {
        return [];
      }
      const allProjects = await actor.getProjects();
      return allProjects.filter((p) => p.agency === profile.agency);
    },
    enabled: !!actor && !actorFetching && !!profile?.agency && isClientOrHigher(role),
  });
}

export function useAddProject() {
  const { actor } = useActor();
  const { isDemoActive } = useDemoSession();
  const { data: role } = useGetUserRole();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (project: Project) => {
      if (isDemoActive) {
        throw new Error('Cannot create projects in demo mode');
      }
      if (!isManagerOrAdmin(role)) {
        throw new Error('Unauthorized: Manager or Admin access required');
      }
      if (!actor) throw new Error('Actor not available');
      return actor.createProject(project);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create project');
    },
  });
}

export function useUpdateProject() {
  const { actor } = useActor();
  const { isDemoActive } = useDemoSession();
  const { data: role } = useGetUserRole();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (project: Project) => {
      if (isDemoActive) {
        throw new Error('Cannot update projects in demo mode');
      }
      if (!isManagerOrAdmin(role)) {
        throw new Error('Unauthorized: Manager or Admin access required');
      }
      if (!actor) throw new Error('Actor not available');
      return actor.updateProject(project.id, project);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update project');
    },
  });
}

export function useCompleteProject() {
  const { actor } = useActor();
  const { isDemoActive } = useDemoSession();
  const { data: role } = useGetUserRole();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      if (isDemoActive) {
        throw new Error('Cannot complete projects in demo mode');
      }
      if (!isManagerOrAdmin(role)) {
        throw new Error('Unauthorized: Manager or Admin access required');
      }
      if (!actor) throw new Error('Actor not available');
      const projects = await actor.getProjects();
      const project = projects.find((p) => p.id === projectId);
      if (!project) throw new Error('Project not found');

      const updatedProject = { ...project, status: 'Completed', completion: BigInt(100) };
      return actor.updateProject(projectId, updatedProject);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to complete project');
    },
  });
}
