# PostHog dashboard build sheet

This sheet turns the analytics taxonomy into the exact PostHog UI work for
launch. Product owns the dashboards; Engineering owns the event taxonomy and
SDK implementation.

The current launch set is **three dashboards**:

1. Lead funnel
2. AI tool conversion
3. Content performance

A separate Region breakdown dashboard is retired. The region middleware was
removed during the single-website pivot, and `region` is not a registered
PostHog super-property. The contact form still emits a selected `region` value
on `contact_submit`; use it only for contact-form QA, not as a site-wide
segmentation layer.

## Build prerequisites

Before building, confirm:

- `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` are present in the
  production Vercel environment.
- Autocapture is disabled and `$pageview` events are present.
- At least one production or staging visit has fired events for `/`, `/contact`,
  and one `/ai/*` page.
- Super-properties appear on captured events: `referrer_group`, `device_class`,
  and `first_touch_utm`.

## Dashboard 1: Lead funnel

Create a dashboard named `Launch - Lead funnel`.

Add a Funnel insight:

| Step | Event            | Filter                              |
| ---- | ---------------- | ----------------------------------- |
| 1    | `$pageview`      | Any URL                             |
| 2    | `hero_cta_click` | `variant = primary`                 |
| 3    | `form_submit`    | `form` is `contact` or `whitepaper` |
| 4    | `form_submit`    | `queued = true`                     |

Add breakdowns:

- `referrer_group`
- `device_class`
- `first_touch_utm.utm_source`

Validation:

- Click the primary homepage CTA, submit the contact form in staging, and
  confirm the session reaches step 3.
- Step 4 may be empty in preview if Resend is intentionally unconfigured.
  Production should show `queued = true` for successful email delivery.

## Dashboard 2: AI tool conversion

Create a dashboard named `Launch - AI tool conversion`.

Add a Funnel insight:

| Step | Event                           | Filter                                                                                                                                                                                                                                 |
| ---- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | `$pageview`                     | `$current_url` contains `/ai/`                                                                                                                                                                                                         |
| 2    | Tool opened                     | OR across `concierge.opened`, `scoping.opened`, `del_readiness.opened`, `dosage_matcher.opened`                                                                                                                                        |
| 3    | First user input                | OR across `concierge.message_sent`, `scoping.message_sent`, `scoping.submitted`, `del_readiness.question_answered`, `del_readiness.submitted`, `dosage_matcher.submitted`                                                              |
| 4    | Tool completion                 | OR across `concierge.message_received`, `scoping.scope_generated`, `del_readiness.scored`, `dosage_matcher.matched`                                                                                                                    |
| 5    | Business-development conversion | OR across `concierge.escape_clicked`, `scoping.escape_clicked`, `scoping.pdf_downloaded`, `del_readiness.consultation_clicked`, `del_readiness.pdf_downloaded`, `dosage_matcher.consultation_clicked`, `dosage_matcher.pdf_downloaded` |

Add breakdowns:

- Event namespace, using event name grouping or separate side-by-side insights
  if the PostHog UI cannot break down a multi-event step cleanly.
- `device_class`

Validation:

- Complete one round-trip in each AI tool in staging.
- Confirm no raw user prompt, email, name, phone, company name, or message body
  appears in event properties.

## Dashboard 3: Content performance

Create a dashboard named `Launch - Content performance`.

Add these insights:

| Insight            | Event                 | Configuration                            |
| ------------------ | --------------------- | ---------------------------------------- |
| Top routes         | `$pageview`           | Group by `$pathname`; show top 20 routes |
| Service interest   | `service_card_click`  | Break down by `serviceId` and `surface`  |
| Whitepaper demand  | `whitepaper_download` | Break down by `slug`; last 30 days       |
| Returning visitors | `$pageview`           | Weekly retention insight                 |

Validation:

- Confirm `/insights` and at least one live article appear in the top-routes
  table after a staging or production visit.
- `whitepaper_download` is expected to show no live data while
  `INSIGHTS.whitepapers` is empty. Do not add a test slug just to populate this
  chart.

## Launch sign-off evidence

For launch sign-off, paste the three PostHog dashboard URLs into
`docs/launch-checklist.md` section 8 or the launch tracker used by the team.
At T plus 60 minutes, Product should confirm that the Lead funnel dashboard is
receiving live production traffic and that no unexpected PII is present in event
properties.
