
# Precise UI Match Plan — Homepage + Better Trainings Page

## Goal
Make the site visually much closer to the Dribbble reference while preserving all existing Elite Forums content, links, data, and functionality. This is a UI-only refinement pass focused on spacing, composition, proportions, surfaces, and visual hierarchy.

## What is still off vs the reference
- The homepage sections exist, but the **layout proportions and visual polish** are not yet close enough.
- The current design feels like an inspired version; the reference is much more **compact, editorial, soft, card-based, and composition-driven**.
- The **hero right visual**, **product/works cards**, **reply banner**, **about/testimonial layout**, and **footer CTA** still need stronger fidelity.
- The trainings page works, but it does not yet feel as premium or as intentionally designed as the homepage.

## Homepage refinement plan

### 1. Hero (`src/components/Hero.tsx`)
Refine it to match the reference composition more tightly:
- Tighten the left/right column ratio so the text and visual sit closer together.
- Adjust headline line breaks, font sizing, max-width, and spacing to mirror the reference rhythm more closely.
- Refine the capsule cluster:
  - more accurate heights, tilt angles, spacing, and overlap
  - softer shadows
  - better vertical text sizing/positioning
  - reduce extra floating stat cards if they do not exist in the reference composition
- Restyle buttons to match the reference more precisely:
  - primary pill with compact arrow circle treatment
  - secondary outlined meeting button with cleaner icon/avatar treatment
- Add subtle hero background structure/grid blocks similar to the reference instead of a plain empty background.

### 2. Header (`src/components/Header.tsx`)
Make the nav feel closer to the Dribbble header:
- Reduce visual noise and align spacing more precisely.
- Refine the centered pill nav container size, padding, and inactive/active contrast.
- Tune logo scale and spacing.
- Match the CTA pill shape/size more closely.
- Ensure the header feels lighter and more “floating” over the page.

### 3. CTA banner (`src/components/CtaBanner.tsx`)
Bring it closer to the reference block:
- Convert it into a larger soft card panel with clearer inner padding and rounded corners.
- Match the reference’s centered type scale and line breaks more closely.
- Tighten button styling and spacing.
- Improve the logo strip presentation:
  - consistent logo sizing
  - better divider spacing
  - stronger alignment within the panel

### 4. Latest Works (`src/components/Products.tsx`)
This section needs a stronger match:
- Rework the section header into the same compact editorial layout as the reference.
- Change cards from generic app cards to more premium showcase panels:
  - varied card heights for a curated editorial feel
  - more accurate corner radius and frame padding
  - stronger image/preview crop treatment
  - softer shadows and hover behavior
- Reduce overly generic card chrome so the work previews feel more like design pieces.

### 5. Reply banner (`src/components/ReplyBanner.tsx`)
Current version is too simple compared to the reference:
- Rebuild as a cleaner centered card section with more deliberate composition.
- Add subtle decorative micro-elements around the headline to echo the reference.
- Adjust heading scale, supporting copy width, and button proportions.
- Make it feel like a designed interstitial, not just another CTA block.

### 6. Services (`src/components/Services.tsx`)
Keep the content, but sharpen the reference match:
- Refine header row proportions and spacing.
- Improve the abstract top illustrations so they feel more art-directed and less placeholder-like.
- Increase variation between service card headers.
- Adjust card padding, border softness, and title/description hierarchy.
- Make the 3-column layout breathe like the reference.

### 7. About / Testimonials / Why us (`src/components/About.tsx`)
This section needs the biggest visual refinement after hero:
- Recompose the testimonial block so it looks more like a split editorial section.
- Improve logo placement, quote spacing, star row, and author block.
- Rebuild the “Why Elite Forums” cards to look more like premium visual tiles:
  - larger top visual area
  - softer pastel surfaces
  - more consistent heights
  - better spacing between header and cards
- Keep existing content exactly, but present it in a much more reference-accurate arrangement.

### 8. Contact (`src/components/Contact.tsx`)
Refine to feel aligned with the new homepage language:
- Reduce generic form styling.
- Use cleaner section spacing and better contrast between contact info and form card.
- Match button shapes, inputs, and cards to the homepage system.

### 9. Footer (`src/components/Footer.tsx`)
Make it feel closer to the reference ending:
- Rebalance the CTA headline, action pills, and supporting footer grid.
- Improve visual separation between the CTA area and the utility footer links.
- Refine logo strip styling so it feels intentional, not appended.
- Match radius, spacing, and shadow language used above.

### 10. Global polish (`src/index.css`)
Add shared styling primitives needed for accuracy:
- softer surface shadows
- more precise radii scale
- utility classes for editorial section widths
- subtle grid/background block helpers
- consistent section spacing tokens
- refined muted text contrast and button treatments

## Trainings page upgrade plan (`src/pages/Trainings.tsx`)
Make the trainings page feel premium and more intentionally designed while keeping its distinct corporate-edtech identity.

### 1. Trainings hero
- Rebuild the hero with stronger composition and cleaner spacing.
- Keep all current training content, but present it with:
  - clearer left content block
  - better right-side stat card arrangement
  - softer premium background layers
  - more polished CTA buttons
- Make the hero feel like a dedicated landing page, not a standard internal page.

### 2. Student testimonials section
- Replace the current raw scrolling-strip feel with a more designed testimonial presentation.
- Keep the data and popup behavior, but improve:
  - card styling
  - section framing
  - typography hierarchy
  - spacing and container polish

### 3. Features / enterprise learning section
- Upgrade feature cards to match the new visual system:
  - more premium icon containers
  - more consistent heights
  - softer surface styling

### 4. Industry-ready programs
This is the most important trainings section visually:
- Make the program cards feel stronger and more premium.
- Keep all hardcoded programs and icons exactly as-is.
- Improve:
  - card layout
  - badge styling
  - header treatment
  - metadata row
  - hover polish
- Use a clearer section header and better spacing between rows.

### 5. Benefits section
- Keep all checklist content.
- Redesign into a more premium split layout with stronger visual rhythm and cleaner benefit tiles.

### 6. Final CTA + enquiry modal
- Upgrade the bottom CTA block so it feels more branded and less generic.
- Refine the modal styling:
  - padding
  - radius
  - field spacing
  - sticky header polish
  - submit button visual hierarchy

## Files to refine
- `src/components/Header.tsx`
- `src/components/Hero.tsx`
- `src/components/CtaBanner.tsx`
- `src/components/Products.tsx`
- `src/components/ReplyBanner.tsx`
- `src/components/Services.tsx`
- `src/components/About.tsx`
- `src/components/Contact.tsx`
- `src/components/Footer.tsx`
- `src/pages/Index.tsx`
- `src/pages/Trainings.tsx`
- `src/index.css`

## Technical notes
- No business content will be changed.
- No services/trainings will be removed or renamed.
- Existing backend/data integrations stay intact.
- The work is mainly about:
  - layout proportions
  - spacing
  - card composition
  - shadows/radii
  - background treatments
  - visual hierarchy
  - closer fidelity to the reference’s art direction

## Expected outcome
After this pass, the homepage should feel much closer to the reference in structure and polish, while the trainings page will feel significantly more premium, cohesive, and aligned with the rest of the brand without copying the homepage one-to-one.
