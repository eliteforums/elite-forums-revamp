

# Pixel-Perfect Match — LP Digital Agency Reference

## Key Differences Found (Current vs Reference)

### 1. Hero Right Side — WRONG element
**Current**: Phone mockup with cards
**Reference**: 4 tall colored **capsule/pill shapes** arranged at angles, with **rotated vertical text** labels: "Graphic Design", "UI UX Design", "Development", "Digital Marketing" — adapted to Elite Forums services. Colors: purple, coral/pink, coral, yellow.

### 2. Hero Buttons — WRONG style
**Current**: Single dark "Works" pill button
**Reference**: Two buttons — "View pricing" (orange filled, with small globe icon on left) + "Request meeting" (outlined, with small avatar circle on left)

### 3. Section ORDER is wrong
**Reference order** (from full-page screenshot):
1. Hero (capsules)
2. CTA Banner (subscription text + client logos)
3. **Latest Works** (products)
4. **"We'll Reply in 24 Hours"** standalone banner
5. **"Do You Need Help With?"** (services) — services come AFTER works
6. **"What Our Clients Say"** (testimonials)
7. **"Why Elite Forums"** (values with image-topped cards)
8. **"Need Help With Large Platform"** CTA with laptop mockup
9. **"Not Sure About Our Pricing"** section with pricing cards
10. Client logos strip again
11. Footer: "Have 🥳 Great Idea? Tell Us About It."

### 4. Services cards style
**Reference**: Cards have large colorful **illustrated/abstract art headers** (paint splatter, abstract shapes) — not just gradient backgrounds with icon overlays. Cards are wider, 3-column.

### 5. Footer heading
**Current**: "Need Help With Large Platform?"
**Reference**: "Have 🥳 Great Idea? Tell Us About It." with two pill buttons: "Blog" (orange) + "Company Details" (outlined)

### 6. "We'll Reply in 24 Hours" — standalone section
**Current**: Embedded inside About section
**Reference**: Its own centered section with decorative illustrations (pencil, arrows), two buttons: "View pricing" + "Request meeting"

### 7. Values section
**Reference**: "Why Elite Forums" heading with description on right + "Request Meeting 👋" button. Below: 4 horizontal cards each with a large **photo/illustration** on top, title below, description below. Not icon cards.

---

## Implementation Plan

### File: `src/components/Hero.tsx`
- Remove phone mockup entirely
- Replace right side with 4 tall capsule shapes (CSS `rounded-full` divs, ~80px wide, ~280px tall) arranged with slight rotation and overlap
- Each capsule: colored background (purple, coral, coral, yellow), contains **vertically rotated text** (`writing-mode: vertical-rl` or `rotate(-90deg)`) with service names
- Replace "Works" button with two buttons: "View pricing" (orange filled pill) + "Request meeting" (outlined pill with small avatar circle)

### File: `src/pages/Index.tsx`
- Reorder sections to match reference:
  ```
  Hero → CtaBanner → Products → ReplyBanner (NEW) → Services → About (testimonials + values) → Contact → Footer
  ```

### File: `src/components/ReplyBanner.tsx` — **NEW**
- Standalone "We'll Reply in 24 Hours" centered section
- Light bg, centered heading, subtitle text
- Two buttons: "View pricing" (orange) + "Request meeting" (outlined)
- Small decorative elements (CSS shapes) around text

### File: `src/components/About.tsx`
- Split into two visual blocks:
  1. **"What Our Clients Say"** — Left: heading + client logos. Right: large quote card with quotation marks, client name/role, star rating
  2. **"Why Elite Forums"** — Heading + description + "Request Meeting" button on header row. Below: 4 cards with colored gradient top areas (abstract shapes using CSS), title, description

### File: `src/components/Footer.tsx`
- Change heading to: "Have 🥳 Great Idea? Tell Us About It."
- Two buttons: "Blog" (orange pill) + "Company Details" (outlined pill)
- Keep existing link columns (Services, Contact us, Locations) and contact info
- Client logos strip at bottom before copyright

### File: `src/components/Services.tsx`
- Section heading: "Do You Need Help With ?" (left) + description (center-right) + "View Works" orange pill (right)
- Cards keep same content but add more abstract/colorful illustrated headers using CSS gradients and layered shapes

### File: `src/components/Products.tsx`
- Keep current implementation (already close to reference)
- Minor: ensure masonry feel with varied card heights if possible

### File: `src/components/CtaBanner.tsx`
- Already matches well — keep as-is

## Files to Create/Modify
1. `src/components/Hero.tsx` — Capsule shapes right side, two CTA buttons
2. `src/components/ReplyBanner.tsx` — **NEW** standalone 24hr reply section
3. `src/pages/Index.tsx` — Reorder: Hero → CtaBanner → Products → ReplyBanner → Services → About → Contact → Footer
4. `src/components/About.tsx` — Testimonial card layout + "Why Elite Forums" value cards
5. `src/components/Footer.tsx` — New heading, buttons, logo strip
6. `src/components/Services.tsx` — "Do You Need Help With?" heading, richer card illustrations

## What stays the same
- All business content, services list, contact info
- All Supabase integrations
- Routing, sub-pages
- Contact form functionality
- Header (already matches reference well)

