# ProactivReferenceLanding Specification

- **Target:** `src/blocks/proactiv-reference-landing.tsx`
- **Reference:** local source project's `app/(marketing)/page.tsx` and imported component files.
- **Interaction model:** mixed — click-driven controls, timed testimonial carousel, and scroll-to-composer CTAs.

## Layout

- Overall surface: `#08090a` / white, with low-opacity diagonal ambient radial lighting.
- Hero: centered, `max-width: 1280px`, large 4xl→8xl headline, trust row, white CTA, and elevated 28px rounded product frame.
- Features: `max-width: 1024px`, 1→3 responsive grid, first card spans two desktop columns.
- Tools: 1-column mobile and 2-column desktop rows, screenshot panels use copied reference assets.
- Testimonials, pricing, FAQ and CTA preserve the source order, copy and dark visual language.

## Destination-specific preservation

The source hero's static dashboard is replaced by the existing functional `ProactivHeroComposer`. Its generated prompt navigates to `/text-to-image`, preserving the existing dialog/composer behavior requested by the user.

## Assets

All reference-owned homepage imagery is in `public/proactiv-reference/`; avatar portraits retain the source's `i.pravatar.cc` URL pattern.

## Responsive behavior

- Desktop: hero and section headings scale to their source-inspired large type; tool rows are two-column; pricing is four-column.
- Tablet: pricing becomes two-column.
- Mobile: all feature, tool, pricing and CTA layouts stack; the composer remains full width.
