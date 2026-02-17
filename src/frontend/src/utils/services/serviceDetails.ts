/**
 * Utility functions for parsing and formatting service detail fields
 */

/**
 * Converts a newline-separated string to an array of trimmed, non-empty strings
 */
export function parseListField(text: string): string[] {
  if (!text || text.trim() === '') return [];
  
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

/**
 * Converts an array of strings to a newline-separated string
 */
export function joinListField(items: string[]): string {
  if (!items || items.length === 0) return '';
  return items.join('\n');
}

/**
 * Validates that a list field has at least one item
 */
export function hasListItems(items: string[]): boolean {
  return items && items.length > 0;
}
