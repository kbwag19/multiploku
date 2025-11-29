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

## "fatal: not a git repository" error

If your terminal prints `fatal: not a git repository (or any of the parent
directories): .git`, it means the shell is not currently inside a cloned copy of
Multiploku. To fix it:

1. Check your present working directory with `pwd` and confirm you are inside
   the folder that contains this README and a hidden `.git` directory.
2. If you do not see those files, clone the repo again and re-enter it:
   ```bash
   git clone <REPO_URL>
   cd multiploku
   ```
3. If you renamed or moved the project folder, update your terminal path with
   `cd /full/path/to/multiploku` before running Git commands.
4. After changing directories, verify Git sees the repo with `git status` before
   making edits.
