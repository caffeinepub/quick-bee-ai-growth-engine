import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Lead, Deal, OutreachActivity, Service, Project } from '../backend';

export type ExportData = {
  leads: Lead[];
  deals: Deal[];
  outreach: OutreachActivity[];
  services: Service[];
  projects: Project[];
};

export function useExportData() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ExportData>({
    queryKey: ['exportData'],
    queryFn: async () => {
      if (!actor) {
        return { leads: [], deals: [], outreach: [], services: [], projects: [] };
      }
      
      const [leads, outreach, services, deals, projects] = await Promise.all([
        actor.getLeadsForExport(),
        actor.getOutreachActivitiesForExport(),
        actor.getServicesForExport(),
        actor.getDealsForExport(),
        actor.getProjectsForExport(),
      ]);
      
      return { leads, deals, outreach, services, projects };
    },
    enabled: !!actor && !actorFetching,
  });
}
