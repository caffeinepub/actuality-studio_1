# Actuality Studio Membership

## Current State

The `Navigation.tsx` component contains a sticky header with:
- Logo on the left
- Right side: Desktop nav links, PrincipalDisplay, LoginButton, Meet button, Theme (Palette) button
- A single right-side slide-out panel (`panelOpen` state) that contains: Brightness dimmer, Visual Theme selector, Connected Apps section (7 app cards), and a "For Connected App Developers" accordion (currently NOT present in code -- the theme panel only has brightness, theme, and connected apps)
- Mobile: Video icon + hamburger icon

The `CONNECTED_APPS` array (7 apps) and their themed card rendering live in the same file.

## Requested Changes (Diff)

### Add
- A new "Connected Apps" button in the header, desktop only, positioned immediately to the LEFT of the LoginButton. Styled identically to the existing Meet button (same className pattern: `hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card hover:border-terracotta/40 transition-colors text-muted-foreground hover:text-terracotta text-sm font-body`). Use `Globe` icon + "Connected Apps" label.
- A second panel state (`connectedPanelOpen`) for a new left-side slide-out panel.
- The new left-side Connected Apps panel: slides in from the LEFT side of the screen, same visual style as the existing right-side theme panel (bg-background, border, shadow-2xl, 320px wide on desktop, full width on mobile). Contains:
  - Panel header with "Connected Apps" title and X close button
  - Scrollable content: all 7 `CONNECTED_APPS` cards (identical rendering to what is currently in the theme panel)
  - A "For Connected App Developers" accordion/dropdown section below the app cards (collapsible, shows developer integration instructions/template content)
- A second dark overlay for the connected apps panel
- Mobile: add a Globe icon button next to the existing Video/hamburger buttons (mirrors how Meet is on mobile)

### Modify
- Theme (Palette) button position: move it to the LEFT of the new "Connected Apps" button (i.e., order from left to right: ...Meet, Theme, Connected Apps, Login). Alternatively: Meet | Theme | Connected Apps | Login.
- The existing right-side slide-out panel (theme panel): REMOVE the entire "Connected Apps" section div (the `<div>` with `Globe` icon header + `CONNECTED_APPS.map(...)`) and any "For Connected App Developers" content. The theme panel should ONLY contain: Brightness dimmer + Visual Theme selector.
- The panel header label can change from "Menu" to "Theme" since it now only contains theme controls.
- Escape key and overlay click handlers apply to both panels independently.

### Remove
- Connected Apps section from the theme/side panel (the entire `<div>` block with the `Globe` heading and `CONNECTED_APPS.map(...)` in the existing panel).
- Any "For Connected App Developers" content if it exists in the theme panel (it appears it was in earlier versions but may not be in current code -- confirm and remove if present).

## Implementation Plan

1. Add `connectedPanelOpen` state and `setConnectedPanelOpen` to Navigation.
2. Add "Connected Apps" header button (desktop) immediately left of LoginButton, styled like Meet button.
3. Add mobile Globe icon button for connected apps panel.
4. Add a "For Connected App Developers" accordion component inline -- a collapsible section with a chevron toggle showing developer integration template content (the standard Actuality Studio identity provider integration prompt template, as described in the conversation history).
5. Create the left-side Connected Apps panel `<aside>` (transform from translateX(-100%) to translateX(0)), with overlay, containing the 7 app cards + developer accordion.
6. Remove the Connected Apps div block from the existing right-side theme panel.
7. Update the right-side panel header from "Menu" to "Theme".
8. Ensure Escape key and overlay both work for each panel independently.
