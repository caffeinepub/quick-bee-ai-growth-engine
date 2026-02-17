# Specification

## Summary
**Goal:** Add a consistent 3D icon system for services/niches across the UI, and improve the checkout dialog flow by automatically guiding users to payment options and payment instructions.

**Planned changes:**
- Add a frontend 3D icon mapping system for service categories/types and niche values, with safe default fallback icons when no mapping exists.
- Render the mapped 3D icons (via the existing SafeImage component or equivalent fallback behavior) in key UI locations: Services page cards, Service Details dialog header, Services & Pricing page category/tier cards (including Monthly Maintenance), and niche labels/filters where present.
- Update CheckoutDialog behavior so opening the dialog automatically scrolls/focuses to the “Select Payment Method” section.
- After “Create Order”, automatically scroll/focus the dialog to the payment instructions section for the currently selected payment method, for checkout entry from both Services page and Services & Pricing page.

**User-visible outcome:** Users see consistent 3D icons for services and niches throughout the app (with a default icon if unavailable), and checkout reliably jumps to payment method selection and then to the relevant payment instructions after creating an order.
