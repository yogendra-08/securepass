# Contributing to SecurePass

Thanks for helping improve SecurePass! Security-conscious contributions are especially welcome.

## Setup
1. Fork `https://github.com/yogendra-08/securepass` and clone your fork.
2. Create a branch: `git checkout -b feat/your-change`
3. Open `index.html` in a modern browser. There is no build step.

## Guidelines
- Use only HTML, CSS and vanilla JavaScript. No dependencies.
- Never use `Math.random()` for password generation; use Web Crypto.
- Never log, store, or transmit generated passwords.
- Keep the UI accessible (labels, keyboard use, focus, contrast).
- **Never include real passwords, secrets or credentials** in code, issues, or pull requests.

## Manual testing
- Length matches the slider for 8, 20 and 64.
- Each enabled category appears in the output; disabling all shows an error.
- Regenerate, show/hide and copy work; strength updates.
- Layout holds at ~360px width with no horizontal scroll.
- DevTools console has no errors and no password output; Storage tab is empty.

## Pull requests
Push your branch to your fork, open a PR against `main`, describe what changed and how you tested it.
Report vulnerabilities privately to the maintainer rather than in a public issue.
