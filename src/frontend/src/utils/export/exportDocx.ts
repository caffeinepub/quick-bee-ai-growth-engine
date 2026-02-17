import type { ExportData } from '../../hooks/useExportData';
import { leadFields, outreachFields, serviceFields, dealFields, projectFields, getFieldValue } from './exportSchema';
import { formatTimestamp } from './filename';

// Generate a simple RTF document that can be opened in Word
// RTF is a simpler format that doesn't require external libraries
export async function generateDOCX(data: ExportData): Promise<Blob> {
  const rtf = generateRTF(data);
  const blob = new Blob([rtf], { type: 'application/rtf' });
  return blob;
}

function generateRTF(data: ExportData): string {
  let rtf = `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0\\fswiss Arial;}}
{\\colortbl;\\red20\\green184\\blue166;}
\\f0\\fs24
{\\b\\fs32\\cf1 Quick Bee Export}\\par
\\fs20 Generated: ${formatTimestamp()}\\par\\par
`;

  if (data.leads.length > 0) {
    rtf += generateRTFSection('Leads', data.leads, leadFields);
  }
  
  if (data.outreach.length > 0) {
    rtf += generateRTFSection('Outreach Activities', data.outreach, outreachFields);
  }
  
  if (data.services.length > 0) {
    rtf += generateRTFSection('Services', data.services, serviceFields);
  }
  
  if (data.deals.length > 0) {
    rtf += generateRTFSection('Deals', data.deals, dealFields);
  }
  
  if (data.projects.length > 0) {
    rtf += generateRTFSection('Projects', data.projects, projectFields);
  }

  rtf += '}';
  return rtf;
}

function generateRTFSection<T>(title: string, items: T[], fields: any[]): string {
  let rtf = `\\par\\par{\\b\\fs28\\cf1 ${escapeRTF(title)}}\\par\\par`;
  
  // Create a simple table representation
  items.forEach((item, index) => {
    if (index === 0) {
      // Headers
      rtf += '{\\b ';
      fields.forEach((field, i) => {
        rtf += escapeRTF(field.label);
        if (i < fields.length - 1) rtf += ' | ';
      });
      rtf += '}\\par';
    }
    
    // Data row
    fields.forEach((field, i) => {
      rtf += escapeRTF(getFieldValue(item, field));
      if (i < fields.length - 1) rtf += ' | ';
    });
    rtf += '\\par';
  });
  
  return rtf;
}

function escapeRTF(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/{/g, '\\{')
    .replace(/}/g, '\\}')
    .replace(/\n/g, '\\par ');
}
