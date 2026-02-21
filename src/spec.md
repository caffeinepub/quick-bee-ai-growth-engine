# Specification

## Summary
**Goal:** Add analytics dashboard with three charts showing revenue trends, service categories distribution, and top performers.

**Planned changes:**
- Integrate React charting library (Recharts) for line charts, pie charts, and bar charts
- Add revenue trends over time line chart showing daily or weekly revenue progression
- Add service categories distribution chart (pie or bar chart) showing breakdown by niche
- Add top performers chart ranking services or leads by revenue/conversion metrics
- Compute revenue trends data from existing useAgencyAnalytics hook
- Update AnalyticsPage layout to display three charts in responsive grid below existing metrics cards
- Apply gradient theme styling (teal green, electric blue) to all charts with animations

**User-visible outcome:** Users can view three interactive, animated charts on the Analytics page showing revenue trends over time, service distribution by category, and top-performing services or leads.
