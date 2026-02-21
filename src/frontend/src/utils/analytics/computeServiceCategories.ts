import type { Service } from '../../backend';

export interface ServiceCategoryData {
  category: string;
  count: number;
  revenue: number;
}

/**
 * Compute service distribution by niche/category
 * Returns an array of {category, count, revenue} objects
 */
export function computeServiceCategories(services: Service[]): ServiceCategoryData[] {
  if (!services || services.length === 0) {
    return [];
  }

  // Group services by niche
  const categoryMap: Record<string, { count: number; revenue: number }> = {};

  services.forEach(service => {
    const category = service.niche || 'Uncategorized';
    
    if (!categoryMap[category]) {
      categoryMap[category] = { count: 0, revenue: 0 };
    }
    
    categoryMap[category].count += 1;
    categoryMap[category].revenue += Number(service.revenue);
  });

  // Convert to array and sort by revenue
  const categories = Object.entries(categoryMap)
    .map(([category, data]) => ({
      category,
      count: data.count,
      revenue: data.revenue,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  return categories;
}
