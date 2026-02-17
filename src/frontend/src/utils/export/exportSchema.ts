import type { Lead, Deal, OutreachActivity, Service, Project } from '../../backend';

export type ExportField<T> = {
  key: keyof T | string;
  label: string;
  format?: (value: any) => string;
};

export const leadFields: ExportField<Lead>[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'contact', label: 'Contact' },
  { key: 'city', label: 'City' },
  { key: 'niche', label: 'Niche' },
  { key: 'status', label: 'Status' },
  { key: 'revenuePotential', label: 'Revenue Potential', format: (v) => `$${Number(v).toLocaleString()}` },
  { key: 'owner', label: 'Owner' },
  { key: 'agency', label: 'Agency' },
  { key: 'createdAt', label: 'Created At', format: (v) => new Date(Number(v) / 1000000).toLocaleDateString() },
];

export const outreachFields: ExportField<OutreachActivity>[] = [
  { key: 'leadId', label: 'Lead ID' },
  { key: 'platform', label: 'Platform' },
  { key: 'message', label: 'Message' },
  { key: 'sent', label: 'Sent', format: (v) => v ? 'Yes' : 'No' },
  { key: 'replied', label: 'Replied', format: (v) => v ? 'Yes' : 'No' },
  { key: 'followUpDate', label: 'Follow-up Date', format: (v) => new Date(Number(v) / 1000000).toLocaleDateString() },
  { key: 'createdAt', label: 'Created At', format: (v) => new Date(Number(v) / 1000000).toLocaleDateString() },
];

export const serviceFields: ExportField<Service>[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'price', label: 'Price', format: (v) => `$${Number(v).toLocaleString()}` },
  { key: 'deliveryTime', label: 'Delivery Time' },
  { key: 'active', label: 'Active', format: (v) => v ? 'Yes' : 'No' },
  { key: 'salesCount', label: 'Sales Count', format: (v) => Number(v).toString() },
  { key: 'revenue', label: 'Revenue', format: (v) => `$${Number(v).toLocaleString()}` },
  { key: 'agency', label: 'Agency' },
];

export const dealFields: ExportField<Deal>[] = [
  { key: 'id', label: 'ID' },
  { key: 'leadId', label: 'Lead ID' },
  { key: 'status', label: 'Status' },
  { key: 'value', label: 'Value', format: (v) => `$${Number(v).toLocaleString()}` },
  { key: 'agency', label: 'Agency' },
  { key: 'createdAt', label: 'Created At', format: (v) => new Date(Number(v) / 1000000).toLocaleDateString() },
  { key: 'closeDate', label: 'Close Date', format: (v) => v ? new Date(Number(v) / 1000000).toLocaleDateString() : 'N/A' },
];

export const projectFields: ExportField<Project>[] = [
  { key: 'id', label: 'ID' },
  { key: 'serviceId', label: 'Service ID' },
  { key: 'clientId', label: 'Client ID' },
  { key: 'status', label: 'Status' },
  { key: 'completion', label: 'Completion', format: (v) => `${Number(v)}%` },
  { key: 'agency', label: 'Agency' },
  { key: 'startDate', label: 'Start Date', format: (v) => new Date(Number(v) / 1000000).toLocaleDateString() },
  { key: 'notes', label: 'Notes' },
];

export function getFieldValue<T>(item: T, field: ExportField<T>): string {
  const value = (item as any)[field.key];
  if (field.format) {
    return field.format(value);
  }
  return value?.toString() || '';
}
