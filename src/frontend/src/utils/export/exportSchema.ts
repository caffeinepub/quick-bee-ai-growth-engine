import type { Lead, Service, Project } from '../../backend';
import type { Deal, OutreachActivity } from '../../types/local';

export type ExportField<T> = {
  key: keyof T | string;
  label: string;
  format?: (value: any, item: T) => string;
};

export const leadFields: ExportField<Lead>[] = [
  { key: 'name', label: 'Name' },
  { key: 'contact', label: 'Contact' },
  { key: 'city', label: 'City' },
  { key: 'niche', label: 'Niche' },
  { key: 'status', label: 'Status' },
  {
    key: 'revenuePotential',
    label: 'Revenue Potential',
    format: (val) => `₹${Number(val).toLocaleString('en-IN')}`,
  },
  { key: 'owner', label: 'Owner' },
  { key: 'agency', label: 'Agency' },
  {
    key: 'createdAt',
    label: 'Created At',
    format: (val) => new Date(Number(val) / 1000000).toLocaleDateString(),
  },
];

export const outreachFields: ExportField<OutreachActivity>[] = [
  { key: 'leadId', label: 'Lead ID' },
  { key: 'platform', label: 'Platform' },
  { key: 'message', label: 'Message' },
  { key: 'sent', label: 'Sent', format: (val) => (val ? 'Yes' : 'No') },
  { key: 'replied', label: 'Replied', format: (val) => (val ? 'Yes' : 'No') },
  {
    key: 'followUpDate',
    label: 'Follow-up Date',
    format: (val) => new Date(val).toLocaleDateString(),
  },
  {
    key: 'createdAt',
    label: 'Created At',
    format: (val) => new Date(val).toLocaleDateString(),
  },
];

export const serviceFields: ExportField<Service>[] = [
  { key: 'name', label: 'Name' },
  { key: 'serviceType', label: 'Type' },
  { key: 'price', label: 'Price', format: (val) => `₹${Number(val).toLocaleString('en-IN')}` },
  { key: 'deliveryTime', label: 'Delivery Time' },
  { key: 'active', label: 'Active', format: (val) => (val ? 'Yes' : 'No') },
  { key: 'salesCount', label: 'Sales Count', format: (val) => Number(val).toString() },
  { key: 'revenue', label: 'Revenue', format: (val) => `₹${Number(val).toLocaleString('en-IN')}` },
  { key: 'niche', label: 'Niche' },
  { key: 'agency', label: 'Agency' },
];

export const dealFields: ExportField<Deal>[] = [
  { key: 'id', label: 'ID' },
  { key: 'leadId', label: 'Lead ID' },
  { key: 'status', label: 'Status' },
  { key: 'value', label: 'Value', format: (val) => `₹${val.toLocaleString('en-IN')}` },
  { key: 'agency', label: 'Agency' },
  {
    key: 'createdAt',
    label: 'Created At',
    format: (val) => new Date(val).toLocaleDateString(),
  },
  {
    key: 'closeDate',
    label: 'Close Date',
    format: (val) => (val ? new Date(val).toLocaleDateString() : 'N/A'),
  },
];

export const projectFields: ExportField<Project>[] = [
  { key: 'id', label: 'ID' },
  { key: 'serviceId', label: 'Service ID' },
  { key: 'clientId', label: 'Client ID' },
  { key: 'status', label: 'Status' },
  { key: 'completion', label: 'Completion %', format: (val) => `${Number(val)}%` },
  { key: 'notes', label: 'Notes' },
  { key: 'agency', label: 'Agency' },
  {
    key: 'startDate',
    label: 'Start Date',
    format: (val) => new Date(Number(val) / 1000000).toLocaleDateString(),
  },
];

export function formatFieldValue<T>(field: ExportField<T>, item: T): string {
  const value = (item as any)[field.key];
  if (field.format) {
    return field.format(value, item);
  }
  return value?.toString() || '';
}

// Alias for backward compatibility
export const getFieldValue = formatFieldValue;
