import type { ExportData } from '../../hooks/useExportData';
import { leadFields, outreachFields, serviceFields, dealFields, projectFields, formatFieldValue } from './exportSchema';
import { formatTimestamp } from './filename';

// Simple PDF generation using browser's print functionality
// This creates an HTML document that can be printed to PDF
export function generatePDF(data: ExportData): Blob {
  const html = generatePDFHTML(data);
  const blob = new Blob([html], { type: 'text/html' });
  return blob;
}

function generatePDFHTML(data: ExportData): string {
  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Quick Bee Export</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      font-size: 12px;
    }
    h1 {
      color: #14B8A6;
      font-size: 24px;
      margin-bottom: 10px;
    }
    .timestamp {
      color: #666;
      font-size: 10px;
      margin-bottom: 20px;
    }
    h2 {
      color: #14B8A6;
      font-size: 16px;
      margin-top: 30px;
      margin-bottom: 10px;
      border-bottom: 2px solid #14B8A6;
      padding-bottom: 5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
      font-size: 10px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #14B8A6;
      color: white;
      font-weight: bold;
    }
    tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    @media print {
      body { margin: 0; }
      h2 { page-break-before: auto; }
      table { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <h1>Quick Bee Export</h1>
  <div class="timestamp">Generated: ${formatTimestamp()}</div>
`;

  if (data.leads.length > 0) {
    html += generateTableHTML('Leads', data.leads, leadFields);
  }
  
  if (data.outreach.length > 0) {
    html += generateTableHTML('Outreach Activities', data.outreach, outreachFields);
  }
  
  if (data.services.length > 0) {
    html += generateTableHTML('Services', data.services, serviceFields);
  }
  
  if (data.deals.length > 0) {
    html += generateTableHTML('Deals', data.deals, dealFields);
  }
  
  if (data.projects.length > 0) {
    html += generateTableHTML('Projects', data.projects, projectFields);
  }

  html += `
</body>
</html>
`;

  return html;
}

function generateTableHTML<T>(title: string, items: T[], fields: any[]): string {
  let html = `<h2>${title}</h2><table><thead><tr>`;
  
  // Headers
  fields.forEach(field => {
    html += `<th>${escapeHTML(field.label)}</th>`;
  });
  html += `</tr></thead><tbody>`;
  
  // Rows
  items.forEach(item => {
    html += '<tr>';
    fields.forEach(field => {
      html += `<td>${escapeHTML(formatFieldValue(field, item))}</td>`;
    });
    html += '</tr>';
  });
  
  html += '</tbody></table>';
  return html;
}

function escapeHTML(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
