

# Major UI Upgrade for Elite Forums Website

## Overview
Redesign the Elite Forums website inspired by the Dribbble reference (LP Digital Agency). The new design shifts to a **clean, light, modern agency aesthetic** with warmer accent colors (orange as primary accent), larger typography, rounded card elements, and sectioned color blocks. Also **removing the live news/blog preview** from the homepage.

## Design Direction (from Reference)
- **Light, airy backgrounds** with alternating white and soft gray/pastel sections
- **Orange/coral primary accent** replacing the current blue accent
- **Rounded pill buttons** with solid fills and outline variants
- **Large bold headlines** with accent-colored keywords
- **Card-based layouts** with soft shadows and generous padding
- **Client logos strip** with clean presentation (already exists, will refine)
- **Sectioned layout**: Hero → Client Logos → Services → About/Values → Contact → Footer

## Changes by File

### 1. Remove Blog/News from Homepage
- **`src/pages/Index.tsx`**: Remove `<BlogPreview />` import and component
- **`src/components/BlogPreview.tsx`**: Keep file (still used on `/blog` route) but remove from homepage

### 2. Color & Theme Update (`src/index.css`)
- Change `--accent` from blue (`200 95% 45%`) to orange/coral (`24 95% 55%`)
- Update gradient tokens to use warm orange tones
- Adjust shadow tokens to match the new accent
- Keep dark mode functional with updated accent

### 3. Hero Section (`src/components/Hero.tsx`)
- **Left-aligned layout** instead of centered (inspired by reference)
- Two-column: text left, decorative element/illustration right
- Accent-colored keyword in headline (e.g., "Digital Strategy" in orange)
- Pill-shaped CTA buttons: "Get Started" (filled orange) + "Explore Services" (outline)
- Keep stats section but restyle with cleaner cards
- Simplify `ParticleBackground.tsx` to subtle gradient orbs only (remove grid + floating particles for cleaner look)

### 4. Client Logos Section (`src/components/ClientLogos.tsx`)
- Move **above Services** (already in correct position)
- Add a tagline above logos (e.g., "Trusted by Leading Brands")
- Cleaner styling: remove grayscale effect, show logos at full color
- Reduce vertical padding for a tighter "logo strip" feel

### 5. Services Section (`src/components/Services.tsx`)
- Redesign cards with **colorful illustration-style headers** per the reference
- Each card gets a pastel background accent color
- Larger card format, 3-column grid on desktop
- "View Works" style CTA button in section header
- Keep all 8 existing services

### 6. About Section (`src/components/About.tsx`)
- Restyle the "What Our Clients Say" / team quotes into a **testimonial carousel** style
- Values grid: use icon + text with lighter card styling
- Add a "We'll Reply in 24 Hours" style CTA banner between sections

### 7. Contact Section (`src/components/Contact.tsx`)
- Keep existing form and contact info
- Restyle with the warmer color palette
- Update button styles to match new orange accent

### 8. Header (`src/components/Header.tsx`)
- Add pill-shaped nav items styling
- Update "Get Started" CTA to orange accent
- Cleaner, more minimal header design

### 9. Footer (`src/components/Footer.tsx`)
- Update from dark primary background to cleaner dark design
- Match new accent colors

### 10. Products Section (`src/components/Products.tsx`)
- Restyle product cards with new design language
- Warmer gradient overlays

## Files to Modify
1. `src/index.css` — Theme colors and tokens
2. `src/pages/Index.tsx` — Remove BlogPreview
3. `src/components/Hero.tsx` — Complete redesign (left-aligned, two-column)
4. `src/components/ParticleBackground.tsx` — Simplify to subtle gradients
5. `src/components/Services.tsx` — Card redesign with pastel accents
6. `src/components/About.tsx` — Lighter card styling, testimonial restyle
7. `src/components/ClientLogos.tsx` — Tighter logo strip, remove grayscale
8. `src/components/Contact.tsx` — Update accent colors and button styles
9. `src/components/Header.tsx` — Pill nav, orange CTA
10. `src/components/Footer.tsx` — Updated accent colors
11. `src/components/Products.tsx` — Card restyle
12. `src/components/Projects.tsx` — Card restyle to match

## What Stays the Same
- All business content (services, contact info, team data)
- Supabase integrations (products, projects, team fetching)
- Routing structure and all pages
- Framer Motion animations (refined, not removed)
- Lenis smooth scrolling
- `/blog` page remains accessible (just removed from homepage)

