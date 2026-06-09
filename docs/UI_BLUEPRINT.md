# UI/UX Blueprint

**Design inspiration:** LinkedIn · Coursera · Notion · Stripe · Resume.io

## Design System

| Token | Light | Dark |
| --- | --- | --- |
| Primary | Indigo `#6366F1` | Indigo `#818CF8` |
| Background | White | Slate `#0F172A` |
| Card | White | Slate `#1E293B` |
| Muted text | Slate 500 | Slate 400 |

- **Font:** Inter (Google Fonts)
- **Radius:** 0.75rem (rounded-xl cards)
- **Motion:** Framer Motion fade-up on scroll, hover lift on feature cards
- **Icons:** Lucide React

## Page Map

```
/                     Landing (marketing)
/login                Sign in
/register             Create account
/dashboard            Overview (readiness ring, breakdown, stats)
/dashboard/resume     Smart Resume Builder
/dashboard/analyzer   AI Resume Analyzer
/dashboard/interview  AI Interview Simulator
/dashboard/skills     Skill Gap Analyzer
/dashboard/roadmap    Career Roadmap Generator
/dashboard/profile    User Profile
```

## Layout Patterns

- **Landing:** Full-width sections, sticky navbar, gradient hero, grid features.
- **Dashboard:** Fixed sidebar (lg+), top bar with user + theme toggle, card-based content.
- **Auth:** Centered card on grid background with brand logo.

## Component Library

Built on Shadcn-style primitives: Button, Card, Input, Label, Badge, Progress, Textarea, Select.

## Responsive Breakpoints

- Mobile-first: single column, hamburger nav on landing.
- `sm` (640px): 2-column grids.
- `lg` (1024px): sidebar dashboard layout.
- `2xl` (1280px): max container width.

## Accessibility

- Semantic HTML headings
- `aria-label` on icon-only buttons
- Focus rings on all interactive elements
- Sufficient color contrast in both themes
