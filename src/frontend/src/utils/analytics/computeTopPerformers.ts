import type { Service } from '../../backend';

export interface TopPerformerData {
  name: string;
  value: number;
}

/**
 * Compute top performing services by revenue
 * Returns the top 10 services ranked by revenue
 */
export function computeTopPerformers(services: Service[]): TopPerformerData[] {
  if (!services || services.length === 0) {
    return [];
  }

  // Sort services by revenue and take top 10
  const topServices = services
    .map(service => ({
      name: service.name,
      value: Number(service.revenue),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  return topServices;
}
