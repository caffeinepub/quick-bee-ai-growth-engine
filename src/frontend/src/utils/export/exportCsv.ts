import type { ExportData } from '../../hooks/useExportData';
import { leadFields, outreachFields, serviceFields, dealFields, projectFields, formatFieldValue } from './exportSchema';

export function generateCSV(data: ExportData): string {
  let csv = '';

  if (data.leads.length > 0) {
    csv += 'LEADS\n';
    csv += generateCSVSection(data.leads, leadFields);
    csv += '\n\n';
  }

  if (data.outreach.length > 0) {
    csv += 'OUTREACH ACTIVITIES\n';
    csv += generateCSVSection(data.outreach, outreachFields);
    csv += '\n\n';
  }

  if (data.services.length > 0) {
    csv += 'SERVICES\n';
    csv += generateCSVSection(data.services, serviceFields);
    csv += '\n\n';
  }

  if (data.deals.length > 0) {
    csv += 'DEALS\n';
    csv += generateCSVSection(data.deals, dealFields);
    csv += '\n\n';
  }

  if (data.projects.length > 0) {
    csv += 'PROJECTS\n';
    csv += generateCSVSection(data.projects, projectFields);
    csv += '\n\n';
  }

  return csv;
}

function generateCSVSection<T>(items: T[], fields: any[]): string {
  let csv = '';

  // Header row
  csv += fields.map(field => escapeCSV(field.label)).join(',') + '\n';

  // Data rows
  items.forEach(item => {
    csv += fields.map(field => escapeCSV(formatFieldValue(field, item))).join(',') + '\n';
  });

  return csv;
}

function escapeCSV(value: string): string {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return '""';
  }

  // Convert to string
  const str = String(value);

  // If contains comma, quote, or newline, wrap in quotes and escape quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}
