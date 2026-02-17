import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Lead, Service, Project } from '../backend';
import type { Deal, OutreachActivity } from '../types/local';

export type AgencyAnalytics = {
  leads: Lead[];
  deals: Deal[];
  outreach: OutreachActivity[];
  services: Service[];
  projects: Project[];
};

export function useGetAgencyAnalytics() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AgencyAnalytics>({
    queryKey: ['analytics'],
    queryFn: async () => {
      if (!actor) {
        return { leads: [], deals: [], outreach: [], services: [], projects: [] };
      }
      try {
        // Fetch available data from backend
        const [leads, services, projects] = await Promise.all([
          actor.getLeadsPaginated(BigInt(0), BigInt(10000)).catch(() => []),
          actor.getServices().catch(() => []),
          actor.getProjects().catch(() => []),
        ]);
        
        return {
          leads,
          deals: [], // Not implemented in backend
          outreach: [], // Not implemented in backend
          services,
          projects,
        };
      } catch (error) {
        console.warn('Analytics query failed:', error);
        return { leads: [], deals: [], outreach: [], services: [], projects: [] };
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}
