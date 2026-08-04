# Scroll Frame Animation — Design

## Goal

Full-viewport scroll-scrubbed image sequence from the provided Eagle frames. Visual only — no UI chrome, copy, overlays, or zoom.

## Constraints

- Source: 240 JPG frames at `1280×720` (`assets/frames/ezgif-frame-001.jpg` … `240`)
- End-to-end (edge-to-edge) coverage of the viewport
- No zoom in/out across the sequence (static cover fit only)
- No additional elements or components on screen
- Stack: Vite + React (TypeScript)

## Approach

**Canvas + scroll lerp**

1. Tall scroll container (~350vh) creates scrub range.
2. Fixed full-viewport `<canvas>` draws the current frame.
3. Scroll progress `0→1` maps to frame index `0→239`.
4. Each animation frame, lerp displayed index toward the target for smooth scrubbing.
5. Draw with **cover** math: scale so the frame fills the viewport, crop overflow — no animated scale transform.

## Visual rules

- Black (or frame-edge) page background only where letterboxing would otherwise show; cover should eliminate letterboxing on typical viewports.
- Canvas: `position: fixed; inset: 0; width: 100%; height: 100%`.
- No nav, loader text, progress UI, or CTAs (optional silent preload; blank until first frame ready is fine).

## File layout

```
/
  index.html
  package.json
  vite.config.ts
  src/
    main.tsx
    App.tsx          # scroll shell + canvas only
    scrollSequence.ts # preload, cover draw, lerp loop
    index.css         # reset + fixed canvas + scroll height
  public/
    frames/          # copy of assets/frames JPGs
```

## Out of scope

- Text, branding, stats, secondary sections
- GSAP / ScrollTrigger
- Zoom, Ken Burns, or parallax on the frames
- Mobile-specific UI affordances beyond normal scroll

## Success criteria

- Scrolling plays the sequence smoothly without stuttery frame jumps.
- Viewport is filled edge-to-edge; sequence does not zoom.
- Screen contains only the animation (no other UI).
- `npm install && npm run dev` runs the experience.
