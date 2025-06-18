# AGENT Instructions for Multiploku

This project is a web-based educational game called **Multiploku**. The game is designed to help children aged 6–10 improve their multiplication skills using an interactive grid interface.

## 🔧 Tech Stack

- HTML for structure
- CSS for styling
- Vanilla JavaScript (modular files, no frameworks or libraries)
- File organization:
  - `multiploku.html`: Main game interface
  - `clickProductCell.js`: Logic for when product cells are clicked
  - `math_game_subroutines.js`: Shared utility and UI subroutines

## 🎯 Game Behavior

- The core interface is a 4x4 multiplication grid.
- Top and left rows represent factors (e.g., 3 × 4), the inner grid contains the products.
- Some cells are hidden; players must fill them in based on visible clues.
- When a product cell is clicked:
  - The corresponding row and column factors are shown in an equation bar.
  - The product term is also displayed and synced.
  - Hidden product cells should autofocus to allow typing.
- Clicking a new product cell should:
  - Clear the previous highlights and equation fields.
  - Activate the new equation's factor and product highlights.

## ♿ Accessibility

- Avoid excessive motion or sound.
- Use high-contrast styles and semantic HTML.
- Grid and input fields should be keyboard-accessible.

## 🔁 Coding Conventions

- Helper and subroutine functions are written in ALL_CAPS or PascalCase (e.g., `HANDLE_PRODUCT_INPUT_STATE`).
- Avoid jQuery or frameworks like React — keep it lightweight.
- Use plain JavaScript event listeners and modular script files.
- Maintain readable indentation and descriptive variable names.

## 🔍 TODOs (if AI wants to assist)

- Ensure input values from grid cells sync in real-time to the equation display.
- Improve mobile responsiveness for smaller screens.
- Add auditory or visual feedback for correct/incorrect answers (with option to disable).
- Add level-based progression with difficulty settings.
- Modularize remaining logic currently inline in `multiploku.html`.

