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
