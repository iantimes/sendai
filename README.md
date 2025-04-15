
# SendAI - LLM Response Formatter

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

SendAI is a lightweight web application that transforms plain LLM/AI responses into beautifully formatted, Gmail-compatible HTML content. It allows users to quickly paste Markdown text, preview the formatted email output, and copy it for use in email clients, primarily targeting Gmail's rendering quirks.

**🔗 Live App:** [https://sendai.web.app](https://sendai.web.app)

<!-- Optional: Add a screenshot here -->
<!-- ![SendAI Screenshot](path/to/screenshot.png) -->

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (LTS version recommended)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js)

You can verify your installation by running:
```bash
node -v
npm -v
```

## 🚀 Quick Start

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/iantimes/sendai.git # Replace with your actual repo URL if different
    cd sendai
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm start
    ```
    This will open the app at `http://localhost:1234` and enable hot reloading.

## 🏗️ Build & Deploy

**Build for Production:**
```bash
npm run build
```
This cleans previous builds and outputs optimized static files to the `dist/` directory.

**Deploy to Firebase:**
1.  Install Firebase CLI (if needed): `npm install -g firebase-tools`
2.  Login: `firebase login`
3.  Associate Project (if needed): `firebase use --add` (Select your Firebase project)
4.  Deploy: `firebase deploy` (Deploys the contents of the `dist/` directory as configured in `firebase.json`)

## 📝 Features

*   **Easy formatting**: Transform markdown into email-ready HTML.
*   **Gmail-optimized**: Creates HTML structure and inline styles that render well in Gmail.
*   **Width options**: Choose small (450px), medium (600px), or large (800px) templates.
*   **Verification Message**: Optionally add a customizable verification banner (top or bottom) with initials or a drawn signature.
*   **Copy options**: Copy formatted content (rich text), raw HTML, or plain text.
*   **Responsive design**: Usable on desktop and mobile.
*   **Privacy-focused**: All processing happens client-side; no data sent to servers.
*   **Persistent Preferences**: Remembers width, verification settings, and signature via localStorage.

## 🔧 Development Notes

*   **Bundler**: Uses [Parcel](https://parceljs.org/) for easy bundling and development server.
*   **Markdown**: Uses [Marked](https://marked.js.org/) for Markdown parsing.
*   **Client-Side**: All logic runs in the user's browser.
*   **State**: UI preferences and signature data are stored in `localStorage`.

## 💻 Project Structure

```
.
├── .gitignore         # Specifies intentionally untracked files that Git should ignore
├── LICENSE            # Project's MIT License
├── README.md          # This file
├── firebase.json      # Firebase Hosting configuration
├── package.json       # Project metadata and dependencies
├── public/            # Static assets (currently unused by build, assets are in src/)
└── src/               # Source code for the application
    ├── index.html     # Main HTML entry point
    ├── index.js       # Main JavaScript entry point (imports CSS, JS modules)
    ├── assets/        # Favicons, manifest, and other static assets
    ├── css/           # CSS stylesheets
    │   ├── signature.css # Styles for the signature modal
    │   └── styles.css    # Main application styles
    └── js/            # JavaScript modules
        ├── app.js             # Main application setup and initialization
        ├── clipboard-manager.js # Handles copy-to-clipboard actions
        ├── markdown-processor.js # Converts Markdown to email-friendly HTML
        ├── signature.js       # Manages signature modal and storage
        ├── ui-controller.js   # Handles UI interactions and preferences
        └── utility.js         # Helper functions (e.g., feedback messages)
```

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2025 iantimes
