import type { ExportData } from '../../hooks/useExportData';
import { leadFields, outreachFields, serviceFields, dealFields, projectFields, getFieldValue } from './exportSchema';

// Simple XLSX generation without external dependencies
// Creates a minimal valid XLSX file structure
export function generateXLSX(data: ExportData): ArrayBuffer {
  // For simplicity, we'll generate an XML-based spreadsheet (SpreadsheetML)
  // which Excel can open. This is a simpler format than full XLSX.
  const xml = generateSpreadsheetXML(data);
  
  // Convert to ArrayBuffer
  const encoder = new TextEncoder();
  return encoder.encode(xml).buffer;
}

function generateSpreadsheetXML(data: ExportData): string {
  let xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Header">
   <Font ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#14B8A6" ss:Pattern="Solid"/>
  </Style>
 </Styles>
`;

  if (data.leads.length > 0) {
    xml += generateWorksheet('Leads', data.leads, leadFields);
  }
  
  if (data.outreach.length > 0) {
    xml += generateWorksheet('Outreach', data.outreach, outreachFields);
  }
  
  if (data.services.length > 0) {
    xml += generateWorksheet('Services', data.services, serviceFields);
  }
  
  if (data.deals.length > 0) {
    xml += generateWorksheet('Deals', data.deals, dealFields);
  }
  
  if (data.projects.length > 0) {
    xml += generateWorksheet('Projects', data.projects, projectFields);
  }

  xml += '</Workbook>';
  return xml;
}

function generateWorksheet<T>(name: string, items: T[], fields: any[]): string {
  let xml = `<Worksheet ss:Name="${escapeXML(name)}">
  <Table>
   <Row>`;
  
  // Header row
  fields.forEach(field => {
    xml += `<Cell ss:StyleID="Header"><Data ss:Type="String">${escapeXML(field.label)}</Data></Cell>`;
  });
  xml += '</Row>';
  
  // Data rows
  items.forEach(item => {
    xml += '<Row>';
    fields.forEach(field => {
      const value = getFieldValue(item, field);
      const type = isNumeric(value) ? 'Number' : 'String';
      xml += `<Cell><Data ss:Type="${type}">${escapeXML(value)}</Data></Cell>`;
    });
    xml += '</Row>';
  });
  
  xml += '</Table></Worksheet>';
  return xml;
}

function escapeXML(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function isNumeric(value: string): boolean {
  // Check if value is a pure number (not currency or percentage)
  return /^-?\d+(\.\d+)?$/.test(value);
}
