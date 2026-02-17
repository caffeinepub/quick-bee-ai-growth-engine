# Specification

## Summary
**Goal:** Let guest (no-sign-in) users edit and persist Settings and manage Services, and seed the Services catalog with the provided expanded offerings (including payment gateway service entries).

**Planned changes:**
- Update Settings flow to allow guest users to view/edit/save profile fields (Name, Email, Mobile Number, Agency, Monthly Goal, Subscription Plan) without authorization errors and persist them for the anonymous principal.
- Remove guest-only frontend restrictions on the Services management page so guests can add/edit services and see updates reflected in the list (English UI text only).
- Relax backend authorization checks for Settings (get/save profile) and Services (addService/updateServiceStatus) so guest calls don’t trap in public/no-sign-in mode.
- Seed the Services catalog with all provided service entries, each as an individual Service record, grouped under the specified English serviceType categories (including the two payment-gateway offerings as catalog entries only).

**User-visible outcome:** Guests can open Settings and save their details, reload and see the saved values, and can add/edit Services; the Services page shows the full seeded catalog including payment gateway setup offerings (as non-processing service listings).
