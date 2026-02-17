import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Lead, Deal, OutreachActivity, Service, Project } from '../backend';

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
        // Pass empty string as agency parameter - backend returns all data regardless
        const [leads, deals, outreach, services, projects] = await actor.getAgencyAnalytics('');
        return { leads, deals, outreach, services, projects };
      } catch (error) {
        console.warn('Analytics query failed:', error);
        return { leads: [], deals: [], outreach: [], services: [], projects: [] };
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}
