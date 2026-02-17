# Specification

## Summary
**Goal:** Add an admin-allowlisted signup/profile setup flow and a client service-selection onboarding flow while keeping Internet Identity as the only authentication method (no OTP).

**Planned changes:**
- Update sign-in UX to accept an email/phone identifier for prefill/onboarding context while continuing authentication via Internet Identity (no OTP send/verify anywhere).
- Implement admin-only first-time profile setup gating: if identifier matches the allowlisted admin email/phone, prefill name/email/phone and lock role to Admin; otherwise prevent choosing Admin.
- Enforce the same admin allowlist on the backend so callers cannot register/save an Admin profile unless the provided email or phone matches the allowlist.
- Add a client onboarding flow for non-admin users to browse/select a service, view detailed service info and cost details, and submit a persisted client service request linked to their principal and agency.
- Add an admin-only in-app view to review submitted client service requests, showing client identifier, selected service, captured cost details, and submission time.

**User-visible outcome:** Users sign in via Internet Identity (with clear no-OTP messaging). The allowlisted admin can complete a locked Admin profile setup and access an admin request-review screen. Non-admin users can complete profile setup, select a service with detailed info and cost details, submit a request, and view their submitted requests.
