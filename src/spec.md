# Specification

## Summary
**Goal:** Add payment tracking capabilities to leads with status field, notes field, filtering, and enhanced data exports.

**Planned changes:**
- Add payment status field (Pending/Paid/Failed) to Lead data model
- Add notes field to Lead data model for tracking payment conversations
- Update LeadDetailDialog to display and edit payment status with color-coded dropdown
- Update LeadDetailDialog to display and edit notes with multi-line textarea
- Add payment status badge to LeadCard component with appropriate colors
- Add payment status filter to LeadsPage alongside existing filters
- Include payment status and notes in all export formats (CSV, Excel, PDF, RTF/DOCX)

**User-visible outcome:** Users can track payment status for each lead, add notes for payment conversations, filter leads by payment status, and export comprehensive lead data including payment information.
