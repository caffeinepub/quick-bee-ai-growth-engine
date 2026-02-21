import type { Payment } from '../../backend';

export interface RevenueTrendData {
  date: string;
  revenue: number;
}

/**
 * Compute revenue trends from payment data, grouping by day
 * Returns an array of {date, revenue} objects for the last 30 days
 */
export function computeRevenueTrends(payments: Payment[]): RevenueTrendData[] {
  if (!payments || payments.length === 0) {
    return [];
  }

  // Filter only paid payments
  const paidPayments = payments.filter(p => p.status === 'paid');

  if (paidPayments.length === 0) {
    return [];
  }

  // Group payments by date
  const revenueByDate: Record<string, number> = {};

  paidPayments.forEach(payment => {
    const date = new Date(Number(payment.createdAt) / 1000000); // Convert nanoseconds to milliseconds
    const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    revenueByDate[dateKey] = (revenueByDate[dateKey] || 0) + Number(payment.amount);
  });

  // Convert to array and sort by date
  const trends = Object.entries(revenueByDate)
    .map(([date, revenue]) => ({
      date,
      revenue,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return trends;
}
