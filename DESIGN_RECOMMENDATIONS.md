# Multiploku – Design Recommendations (current build)

## Information architecture and maintainability
- Move inline gameplay logic from `multiploku_June12B(37).html` into the existing modular scripts (e.g., `math_game_subroutines.js`, `clickProductCell.js`) so behaviors like `generateGrid`, equation syncing, and solver widget state live in testable modules rather than a single 700+ line `<script>` block.
- Extract shared helpers (e.g., grid selection state, `getRowCol`, `getValue`, equation activation) into a small state manager; expose a clean API for the UI layer to call and keep DOM wiring minimal.

## Accessibility and input flow
- Convert clickable `.cell` elements into semantic buttons (or add `role="button"` + keyboard handlers) and ensure hidden inputs receive focus via Tab, not only click, so keyboard users can solve the puzzle without a mouse.
- Announce validation states (`correct`/`incorrect`) with `aria-live` or helper text near the grid; the current color-only feedback is difficult for color-blind players.
- Allow standard text editing in hidden-cell inputs; the custom Backspace/Delete handler that wipes the value makes text entry unforgiving on touch keyboards.

## Responsiveness and layout
- The grid and sidebar panels use fixed padding and max widths; add CSS clamp-based sizing or media queries so the grid, widget, and visual panels stack vertically on narrow screens without horizontal scrolling.
- Ensure the navbar height and `.game-wrapper` spacing collapse gracefully on smaller viewports; consider turning the SCORECARD/CHALLENGE buttons into an overflow menu on phones.

## Gameplay clarity and fairness
- Keep the “only one hidden part per multiplication fact” rule explicit; the current hide logic still allows up to two per equation, which can make some puzzles unsolvable for younger players. A guarantee of one hidden element per fact at beginner mode would balance difficulty.
- Provide a visible “equation active” badge or breadcrumbs in the equation panel to reduce confusion when multiple cells are highlighted; right now the selection state relies on color and border thickness.

## Visual polish
- Reuse the factor color palette (the `colorMap` shades) in the equation bar and widget to reinforce the link between highlighted factors and the active multiplication fact.
- Consider toning down the heavy bevel/gradient styling on cells for a flatter, kid-friendly look; keeping the pulse animation for the selected cell but simplifying other states will reduce visual noise.
