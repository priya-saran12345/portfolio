# Priya Saran — Portfolio

A single-page portfolio built with **Next.js 14 (App Router)**, **TypeScript**,
**Tailwind CSS**, **React Three Fiber (Three.js)**, and **Framer Motion**.

The hero section features an interactive 3D visualization of the MERN stack —
nodes for React, Next.js, Node.js, Express, and MongoDB connected by animated
"data flow" particles. Drag to rotate, move your cursor for parallax.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  layout.tsx          Root layout, fonts, metadata
  page.tsx             Assembles all sections
  globals.css          Global styles + design tokens
  api/contact/route.ts Contact form API route
components/
  Navbar.tsx
  sections/
    Hero.tsx           Banner + 3D animation
    Skills.tsx
    Services.tsx
    Experience.tsx     Includes education + certifications
    Projects.tsx
    Contact.tsx        Form with validation + status states
  three/
    StackNetwork.tsx    The interactive Three.js scene
lib/
  data.ts               All resume content in one place — edit here
```

## Editing content

Everything text-based (name, skills, experience, projects, etc.) lives in
`lib/data.ts`. Change it there and it updates across every section.

## Wiring up the contact form

By default, submissions are just logged on the server (visible in your
terminal / hosting provider's function logs) — good enough to demo locally.
To actually receive emails, open `app/api/contact/route.ts` and either:

1. **Formspree** (easiest, no backend code) — create a form at
   [formspree.io](https://formspree.io), copy the form ID into
   `.env.local` as `FORMSPREE_ID`, and uncomment the forwarding block in
   the route file.
2. **Resend / Nodemailer** — send email directly from the route using an
   API key stored in `.env.local`.

Copy `.env.example` to `.env.local` and fill in whichever key you use.
`.env.local` is already gitignored.

## Design tokens

Color palette, fonts, and animation timing are centralized in
`tailwind.config.ts`:

- `base` / `surface` / `surface2` — background layers
- `ink` / `muted` — text colors
- `teal` / `indigo` — accent colors (used for the 3D scene, links, and highlights)
- `font-display` (Space Grotesk), `font-body` (Inter), `font-mono` (JetBrains Mono)

## Deployment

This is a standard Next.js app — deploy directly to
[Vercel](https://vercel.com/new) (recommended), or to Render/Hostinger per
your existing workflow. No special config needed beyond setting any env
vars for the contact form.

## Notes

- The 3D scene is loaded client-side only (`dynamic(..., { ssr: false })`)
  since Three.js needs the browser's WebGL context.
- Reduced-motion preferences are respected globally (see `globals.css`).
- Replace the placeholder social links / resume download if you'd like a
  "Download résumé" button — drop a PDF in `/public` and link to it.
