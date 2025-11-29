# Multiploku

## Running Tests

Install dependencies and run the test suite with:

```bash
npm install
npm test
```

In CI environments, make sure `npm install` runs before invoking `npm test` so
that all dependencies are available.

## Playing locally

Open `index.html` in a browser to load the current Multiploku build. If you
prefer a local server, you can use any static file host (for example `npx serve`)
from the repository root and visit `http://localhost:3000`.

## If your local copy gets messy

If a merge or conflict went sideways, this is a quick way to start fresh with
the latest code from the `work` branch:

1. Save any changes you want to keep somewhere safe (copy/paste to a note).
2. In a terminal run:
   ```bash
   git fetch origin
   git checkout work
   git reset --hard origin/work
   ```
3. Open `index.html` again to see the clean version of the game.
