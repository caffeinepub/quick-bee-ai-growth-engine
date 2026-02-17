# Specification

## Summary
**Goal:** Expand the Services & Pricing page to display the full 30-item pricing catalog with grouped English sections, gradient premium styling, and gradient 3D icons, while keeping checkout CTAs working.

**Planned changes:**
- Update the Services & Pricing page to render all 30 offerings with exact names, ₹ INR prices, and the exact bullet features, grouped under clear English section headings.
- Apply a consistent gradient-themed visual style across the page (cards/sections), with responsive layout and clear typography hierarchy.
- Add gradient-styled 3D icons to each pricing section (or offering cards) using the existing `ServiceNiche3dIcon` and mapping, with `SafeImage` fallback when an icon asset is missing.
- Replace the single “Monthly Maintenance” card with a “Monthly Maintenance Plans” section containing exactly three plans (Student ₹499/month, Business ₹999/month, Pro ₹1,999/month) and bullets: Minor updates, Basic support, Monitoring.
- Ensure each offering/plan shows two English CTAs (“Select Plan” and “Get Started”) and that triggering checkout continues to open the existing `CheckoutDialog` with the correct service name and amount.

**User-visible outcome:** Users can browse a complete, sectioned 30-item Services & Pricing catalog with gradient styling and 3D icons, view the new 3-tier Monthly Maintenance Plans, and start checkout from “Select Plan”/“Get Started” for any offering.
