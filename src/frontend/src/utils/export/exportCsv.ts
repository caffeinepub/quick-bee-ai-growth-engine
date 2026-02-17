import type { ExportData } from '../../hooks/useExportData';
import { leadFields, outreachFields, serviceFields, dealFields, projectFields, formatFieldValue } from './exportSchema';

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function generateCSVSection<T>(title: string, items: T[], fields: any[]): string {
  let csv = `${title}\n`;
  
  // Header row
  csv += fields.map(f => escapeCSV(f.label)).join(',') + '\n';
  
  // Data rows
  items.forEach(item => {
    const row = fields.map(field => escapeCSV(formatFieldValue(field, item)));
    csv += row.join(',') + '\n';
  });
  
  csv += '\n';
  return csv;
}

export function generateCSV(data: ExportData): string {
  let csv = '';
  
  csv += generateCSVSection('Leads', data.leads, leadFields);
  csv += generateCSVSection('Outreach Activities', data.outreach, outreachFields);
  csv += generateCSVSection('Services', data.services, serviceFields);
  csv += generateCSVSection('Deals', data.deals, dealFields);
  csv += generateCSVSection('Projects', data.projects, projectFields);
  
  return csv;
}
