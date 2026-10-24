<div align="center">

# 🌉 ContextBridge
### Precision AI Workstation for Pull Request Synthesis & Developer Context

Built during the **Build with AI by Google for Developers Bootcamp in Mumbai** 🇮🇳✨

[![React 18](https://img.shields.io/badge/React-18.x-61dafb?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

---

## 💡 The Problem: "Context Collapse" in Code Reviews

When developers open a Pull Request (PR), reviewers only see raw green and red code diffs. They lack the architectural background:
* *Why was this refactoring done?*
* *Which production incident or crash triggered this change?*
* *Which Architecture Decision Record (ADR) or RFC does it follow?*
* *What is the p99 latency impact or benchmark regression?*

**ContextBridge** bridges this gap. It connects live **repository Abstract Syntax Tree (AST)** code changes with **incident telemetry (Sentry)**, **engineering wiki specs (Notion RFCs & ADRs)**, and **real-time benchmarks**, synthesizing an airtight PR specification with cross-service evidence and an interactive AI context studio.

---

## ✨ Key Features

### 1. 🔍 AST-Grounded PR Rationale Synthesis
- Automatically analyzes branch diffs and cross-references them against repository AST nodes.
- Synthesizes formatted PR titles, decision logs, and motivation rationale with confidence scoring.

### 2. 🚨 Cross-Service Evidence & Incident Linking
- Surfaces inline badges directly over modified code diffs linking them to **Sentry error traces** (e.g. `AUTH-892`), **Architecture Decision Records** (`ADR-009 §4.2`), and **design RFCs** (`Notion RFC-088`).

### 3. 📊 Benchmark Telemetry & Validation
- Real-time comparison metrics (e.g., token revocation p99 latency dropped from `4.2ms` to `3.6ms`, connection pool exhaustions reduced from `12/hr` to `0`).

### 4. 💬 Semantic AST Chat Studio
- Allows engineers, security auditors, and reviewers to interactively query the PR's AST context using LLMs.
- Ask questions like *"Explain Valkey pipeline concurrency"* or *"Generate rollback migration script"* with instant AST-verified code answers.

### 5. 🎯 Canary Rollout & Pre-Merge Compliance Matrix
- Live rollout progress tracking (15% canary in `US-East-1`, 0.00% error rate, 25.4k RPS).
- Automated compliance matrix checking unit/race tests, Sentinel failover times, and SAST security scans.

### 6. ⚡ High-Density Precision Workstation UI
- Designed according to the **ContextBridge Precision System**: 1px hairline borders (`#E2E8F0`), Geist and JetBrains Mono typography, `⌘K` / `Ctrl+K` command palette, and full-bleed edge-to-edge desktop workstation layout.

---

## 📁 Repository Structure

```
contextbridge/
├── index.html                   # HTML entrypoint & Google Fonts
├── vite.config.ts               # Vite bundler configuration
├── tailwind.config.js           # Precision design system tokens
├── tsconfig.json                # Strict TypeScript configuration
├── package.json                 # Project dependencies
├── preview.html                 # Standalone, zero-install interactive preview
└── src/
    ├── main.tsx                 # React DOM mount
    ├── index.css                # Global styles & fonts
    ├── types/
    │   └── index.ts             # Type definitions (PRData, DiffFile, ChecklistItem, etc.)
    ├── data/
    │   └── mockPrData.ts        # Seed scenario (Valkey cluster & JWT session revocation)
    ├── hooks/
    │   └── useToast.ts          # Reactive toast notification hook
    ├── components/
    │   ├── Sidebar.tsx          # Structural left navigation rail
    │   ├── Header.tsx           # Edge-to-edge toolbar with repo selector & quota gauge
    │   ├── BranchBanner.tsx     # Branch flow & commit SHA copy banner
    │   ├── DiffInspector.tsx    # Multi-file syntax diff inspector with fullscreen toggle
    │   ├── RationaleCard.tsx    # Sticky PR rationale, benchmarks & interactive checklist
    │   ├── BottomNav.tsx        # Responsive mobile fallback navigation
    │   └── Toast.tsx            # Animated notification pill
    └── ContextBridgePRView.tsx  # Central workstation orchestrating all 4 views
```

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn` / `pnpm`

### Installation & Run

1. **Clone this repository:**
   ```bash
   git clone https://github.com/Rucha-Jadhav/contextbridge.git
   cd contextbridge
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` to explore the interactive workstation.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `⌘K` or `Ctrl + K` | Open global Command Palette & quick search |
| `ESC` | Close modal / command palette |

---

## 🏆 Acknowledgements

Built with ❤️ at the **Build with AI by Google for Developers Bootcamp in Mumbai** (October 2026). Special thanks to the Google for Developers community and mentors for their guidance and support!

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
