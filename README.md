<div align="center">

# 🔐 SecurePass

**A privacy-first password generator that runs entirely in your browser.**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

![SecurePass preview](preview.png)

</div>

## Features
- Cryptographically secure generation via `crypto.getRandomValues()`
- Length 8–64, with uppercase, lowercase, numbers and symbols toggles
- At least one character from every enabled category, then a secure shuffle
- Strength estimate (Weak / Fair / Strong / Very Strong) with entropy figure
- Show/hide, one-click copy with honest failure handling, clear validation messages
- Responsive, keyboard-accessible, reduced-motion friendly; no backend or tracking

## Tech stack
HTML5, CSS3, vanilla JavaScript (ES6+). No frameworks, build tools, or dependencies.

## Run locally
```bash
git clone https://github.com/yogendra-08/securepass.git
cd securepass
# open index.html in your browser
```

## Deploy to GitHub Pages
Repository **Settings → Pages → Build and deployment**: Source *Deploy from a branch*, Branch `main`, folder `/ (root)`. All asset paths are relative. Add the live URL here only after you've verified it.

## How it works
- **Web Crypto API:** randomness comes from `crypto.getRandomValues()`, never `Math.random()`. If unavailable, the app shows an error and does not fall back.
- **Unbiased selection:** a random 32-bit value is rejected if it falls in the incomplete final block of the range, so `value % n` has no modulo bias.
- **Guarantee + shuffle:** one character is drawn per enabled category, the rest from the combined pool, then a Fisher–Yates shuffle (also securely random).

## Strength estimation limitations
Estimated entropy = `length × log2(pool size)`, assuming uniformly random characters. Bands: < 45 bits Weak, < 70 Fair, < 100 Strong, otherwise Very Strong. It is an approximation, not a guarantee, and does not test against real attacks or breach data.

## Privacy & security
Passwords are generated locally, never sent anywhere, never written to LocalStorage, SessionStorage, cookies or URLs, and never logged. No analytics. The page makes no network requests beyond loading its own files. Use a unique password per account and a reputable password manager.

## Accessibility & compatibility
Semantic HTML, labelled controls, visible focus, live-region notifications (text + icons, not color alone), `prefers-reduced-motion` support. Requires a modern browser with Web Crypto, and the Clipboard API (HTTPS or localhost) for copy; the CSS uses `:has()` for highlighting selected options (graceful without it).

## Structure
```text
securepass/
├── index.html  ├── style.css  ├── script.js
├── README.md   ├── LICENSE    ├── .gitignore
├── CONTRIBUTING.md
└── preview.png   (capture from the running app)
```

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md).

## License
MIT — see [LICENSE](LICENSE). Replace the copyright-holder placeholder with your name.

## Roadmap
Passphrase mode, exclude-ambiguous-characters option, auto-clear clipboard, light theme.

## Acknowledgments
MDN Web Docs for the Web Crypto and Clipboard API references.
