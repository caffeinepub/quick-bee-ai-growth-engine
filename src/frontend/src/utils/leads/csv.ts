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
          errors.push(`Row ${i + 1}: Missing required fields`);
          continue;
        }

        const lead: Lead = {
          id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          agency,
          name: row.name,
          contact: row.contact,
          city: row.city,
          niche: row.niche,
          status: row.status || 'cold',
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
