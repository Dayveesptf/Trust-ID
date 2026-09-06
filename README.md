# TrustID

TrustID helps young people build verifiable financial credibility from the financial behaviour they already have, while giving a bank (Ecobank, in this prototype) additional information to support lending decisions.

This repo is the **competition prototype**: a clickable, front-end-only demonstration of the product concept, using simulated data. It is not a production banking system — no real bank API integration, no real financial data, no production credit-scoring model.

> **TrustID does not approve or reject loans. Ecobank retains full responsibility for all final lending decisions.**

## Tech stack

| Layer      | Choice |
|------------|--------|
| Framework  | React 19 + TypeScript |
| Build tool | Vite 8 |
| Styling    | Tailwind CSS v4 |
| Charts     | Recharts |
| Fonts      | DM Sans (body/display), JetBrains Mono (score figures) |

No backend, no database, no auth service — everything is client-side state and mock data (see [`src/data/mockData.ts`](./src/data/mockData.ts)).

## Getting started

```bash
npm install
npm run dev
```

The dev server runs on the default Vite port (`http://localhost:5173`).

Other scripts:

```bash
npm run build     # type-check-free production build to dist/
npm run preview   # serve the production build locally
```

## Project structure

```
├── public/                  Favicon set (16/32/48/180/512px), served as-is
├── src/
│   ├── assets/               Logo art (light/dark nav + hero variants, source SVGs)
│   ├── components/
│   │   ├── Layout.tsx         Customer + Ecobank sidebars, mobile nav, page shells
│   │   └── ui.tsx              Shared primitives: Button, Input, Avatar, Badge, etc.
│   ├── data/
│   │   └── mockData.ts         All simulated data — user, scores, charts, customers
│   ├── pages/                 One file per screen (see Screens below)
│   ├── App.tsx                Screen router (simple useState switch, no URL routing)
│   ├── main.tsx                React entry point
│   └── index.css               Tailwind import + design tokens (CSS variables)
├── index.html                Favicon links, page title, mount point
├── vite.config.ts
└── tsconfig.json
```

### Routing model

There's no `react-router` here — `App.tsx` holds a single `screen` state value and swaps which page component renders. Every page receives a `navigate(screen: string)` prop to move between screens. This keeps the prototype simple to run and demo, but means there's no real URL per screen and no browser back/forward support. Worth swapping for a router (e.g. `react-router`) before this becomes a real product.

## Screens

**Customer journey**
| Screen | File | Purpose |
|---|---|---|
| Landing | `LandingPage.tsx` | Marketing/explainer entry point |
| Sign up | `SignUpPage.tsx` | Account creation |
| Onboarding | `OnboardingPage.tsx` | Income source, frequency, goals |
| Consent | `ConsentPage.tsx` | Explicit permission to analyse financial behaviour |
| Connect | `ConnectPage.tsx` | Simulated data-source connection |
| Analysis | `AnalysisPage.tsx` | Processing/loading state before the profile is ready |
| Dashboard | `DashboardPage.tsx` | Trust score overview |
| Score explanation | `ScoreExplanationPage.tsx` | Why the score looks the way it does |
| Financial growth | `FinancialGrowthPage.tsx` | Suggested actions to improve the profile |
| Score history | `ScoreHistoryPage.tsx` | Score over time |
| Opportunity | `OpportunityPage.tsx` | How the profile supports lending eligibility |

**Ecobank (bank-side) journey**
| Screen | File | Purpose |
|---|---|---|
| Ecobank login | `EcobankLoginPage.tsx` | Separate bank-side entry point |
| Customer overview | `CustomerOverviewPage.tsx` | Portfolio-level view of TrustID customers |
| Customer detail | `CustomerDetailPage.tsx` | Single customer's profile |
| Supporting evidence | `SupportingEvidencePage.tsx` | Behavioural evidence behind the score |
| Recommendation | `RecommendationPage.tsx` | TrustID's assessment summary |
| Decision support | `DecisionSupportPage.tsx` | Consolidated view for the analyst's final decision |

## Design tokens

Defined as CSS variables in `src/index.css`:

| Token | Value | Use |
|---|---|---|
| `--primary` / navy | `#0D2D52` | Headings, primary text, bank-side theme |
| `--accent` / green | `#10B981` | Trust score highlights, positive states, "ID" brandmark |
| `--background` | `#F8FAFB` | App background |
| `--muted-foreground` | `#64748B` | Secondary text |
| `--radius` | `12px` | Default corner radius |

## Branding assets

| File | Use |
|---|---|
| `src/assets/logo-nav-light.png` | Nav/header logo — light backgrounds (most pages) |
| `src/assets/logo-nav-dark.png` | Nav/header logo — navy backgrounds (e.g. `AnalysisPage`) |
| `src/assets/logo-hero-light.png` / `logo-hero-dark.png` | Full lockup with tagline, for large hero placements |
| `public/favicon-16/32/48.png`, `apple-touch-icon-180.png`, `icon-512.png` | Browser tab / home-screen icons |

The Ecobank-side screens (`EcobankLoginPage`, bank sidebar) intentionally use Ecobank's own placeholder mark rather than the TrustID logo, to keep the two brands visually distinct.

## Known limitations (by design, for this prototype)

- All data is simulated (`src/data/mockData.ts`) — nothing here reads real financial data
- No authentication — sign-up/login screens don't persist a session
- No routing library — screen state resets on refresh
- No backend, no scoring engine — the "score" is static mock data, not calculated

## What a production version would add

Real data access and consent flows, open-banking integration, a validated scoring model, security and compliance infrastructure, real bank integration, and a sustainable business model.
