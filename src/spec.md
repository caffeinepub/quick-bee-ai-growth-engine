# Specification

## Summary
**Goal:** Integrate the 14 uploaded images as frontend static assets and use them to improve visual cohesion and overall UI elegance across key pages while preserving the existing minimal teal/black/white direction.

**Planned changes:**
- Add the 14 uploaded image files to the frontend static assets directory and ensure they load via static paths in production (no backend/API image serving).
- Standardize image usage through a single shared mapping/constant module so components don’t hardcode asset paths.
- Incorporate uploaded icon-style assets into platform affordances (e.g., Outreach tabs/empty states) and use illustration-style assets as hero/empty-state visuals on at least Dashboard plus at least two secondary pages (e.g., Planner and Outreach), ensuring responsive behavior on mobile.
- Refine UI styling for a more elegant feel by improving typography hierarchy, spacing, card/panel styling, and consistent hover/focus-visible states across AppShell/SidebarNav and key cards (StatsCard, ChartBlock, ExportDataSection), without modifying Shadcn UI component source files.

**User-visible outcome:** The app displays the uploaded visuals across Dashboard/Planner/Outreach with consistent, responsive artwork and icons, and the overall interface feels more polished with improved spacing, typography, and accessible interactive states.
