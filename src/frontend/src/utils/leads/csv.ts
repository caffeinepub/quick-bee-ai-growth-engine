import type { Lead } from '../../backend';

export function parseCsvToLeads(csvText: string, agency: string, defaultOwner: string): { leads: Lead[]; errors: string[] } {
  const leads: Lead[] = [];
  const errors: string[] = [];
  
  try {
    const lines = csvText.trim().split('\n');
    
    if (lines.length < 2) {
      errors.push('CSV file must contain a header row and at least one data row');
      return { leads, errors };
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    // Validate required columns
    const requiredColumns = ['name', 'contact', 'city', 'niche'];
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    
    if (missingColumns.length > 0) {
      errors.push(`Missing required columns: ${missingColumns.join(', ')}`);
      return { leads, errors };
    }

    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      try {
        const values = line.split(',').map(v => v.trim());
        const row: Record<string, string> = {};
        
        headers.forEach((header, idx) => {
          row[header] = values[idx] || '';
        });

        // Validate required fields
        if (!row.name || !row.contact || !row.city || !row.niche) {
          errors.push(`Row ${i + 1}: Missing required fields (name, contact, city, niche)`);
          continue;
        }

        const lead: Lead = {
          id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          agency,
          name: row.name,
          contact: row.contact,
          city: row.city,
          niche: row.niche,
          status: row.status || 'New',
          revenuePotential: BigInt(row.revenuepotential || row.revenue || 0),
          createdAt: BigInt(Date.now() * 1000000),
          owner: row.owner || defaultOwner,
        };

        leads.push(lead);
      } catch (error: any) {
        errors.push(`Row ${i + 1}: ${error.message || 'Parse error'}`);
      }
    }
  } catch (error: any) {
    errors.push(`CSV parsing failed: ${error.message || 'Unknown error'}`);
  }

  return { leads, errors };
}

export async function parseExcelToLeads(arrayBuffer: ArrayBuffer, agency: string, defaultOwner: string): Promise<{ leads: Lead[]; errors: string[] }> {
  const leads: Lead[] = [];
  const errors: string[] = [];

  try {
    // Simple Excel parsing without external libraries
    // Convert ArrayBuffer to text and try to extract data
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // For simplicity, we'll use a basic approach that works with simple Excel files
    // In production, you'd want to use a library like xlsx or read-excel-file
    
    // Try to extract text content from the Excel file
    const decoder = new TextDecoder('utf-8', { fatal: false });
    let text = decoder.decode(uint8Array);
    
    // Excel files contain a lot of binary data, but we can try to extract readable text
    // This is a simplified approach - for production use, consider using the xlsx library
    
    // Extract lines that look like data (contain alphanumeric characters)
    const lines = text.split(/[\r\n]+/).filter(line => {
      // Filter out lines that are mostly binary/control characters
      const printableChars = line.replace(/[^\x20-\x7E]/g, '').trim();
      return printableChars.length > 3;
    });

    if (lines.length < 2) {
      errors.push('Excel file appears to be empty or unreadable. Please ensure it contains a header row and data rows.');
      return { leads, errors };
    }

    // Try to find the header row (should contain our expected columns)
    let headerIndex = -1;
    let headers: string[] = [];
    
    for (let i = 0; i < Math.min(10, lines.length); i++) {
      const potentialHeaders = lines[i].toLowerCase();
      if (potentialHeaders.includes('name') && potentialHeaders.includes('contact')) {
        // Found potential header row
        headers = lines[i].split(/[\t,|]/).map(h => h.trim().toLowerCase().replace(/[^\w]/g, ''));
        headerIndex = i;
        break;
      }
    }

    if (headerIndex === -1) {
      errors.push('Could not find header row with required columns (name, contact, city, niche). Please ensure your Excel file has a proper header row.');
      return { leads, errors };
    }

    // Validate required columns
    const requiredColumns = ['name', 'contact', 'city', 'niche'];
    const missingColumns = requiredColumns.filter(col => !headers.some(h => h.includes(col)));
    
    if (missingColumns.length > 0) {
      errors.push(`Missing required columns: ${missingColumns.join(', ')}`);
      return { leads, errors };
    }

    // Parse data rows
    for (let i = headerIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.length < 5) continue;

      try {
        const values = line.split(/[\t,|]/).map(v => v.trim().replace(/[^\w\s@.+-]/g, ''));
        const row: Record<string, string> = {};
        
        headers.forEach((header, idx) => {
          if (idx < values.length) {
            row[header] = values[idx] || '';
          }
        });

        // Find values for required fields
        const name = row.name || row.leadname || '';
        const contact = row.contact || row.email || row.phone || '';
        const city = row.city || row.location || '';
        const niche = row.niche || row.industry || row.category || '';

        // Validate required fields
        if (!name || !contact || !city || !niche) {
          continue; // Skip rows with missing data
        }

        const lead: Lead = {
          id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          agency,
          name,
          contact,
          city,
          niche,
          status: row.status || 'New',
          revenuePotential: BigInt(parseInt(row.revenuepotential || row.revenue || '0') || 0),
          createdAt: BigInt(Date.now() * 1000000),
          owner: row.owner || defaultOwner,
        };

        leads.push(lead);
      } catch (error: any) {
        // Silently skip problematic rows in Excel parsing
        continue;
      }
    }

    if (leads.length === 0) {
      errors.push('No valid data rows found. Please ensure your Excel file contains data with columns: name, contact, city, niche');
    }

  } catch (error: any) {
    errors.push(`Excel parsing failed: ${error.message || 'Unknown error'}. For best results, save your file as CSV format.`);
  }

  return { leads, errors };
}
