import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useGetCallerUserProfile } from './useCurrentUserProfile';
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
  const { data: profile } = useGetCallerUserProfile();

  return useQuery<AgencyAnalytics>({
    queryKey: ['analytics', profile?.agency],
    queryFn: async () => {
      if (!actor || !profile?.agency) {
        return { leads: [], deals: [], outreach: [], services: [], projects: [] };
      }
      const [leads, deals, outreach, services, projects] = await actor.getAgencyAnalytics(profile.agency);
      return { leads, deals, outreach, services, projects };
    },
    enabled: !!actor && !actorFetching && !!profile?.agency,
  });
}
