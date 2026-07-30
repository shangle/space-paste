# 🚀 Space Paste (`spacepaste.app`)

> **Never Lose Your Place in the Physical World.**  
> *Space Paste seamlessly bridges your digital brain to real-world physical locations. Stash podcast episodes, cable guides, torque specs, and passwords directly to physical spots via instant web routes, QR stickers, or AI photo signatures.*

[![Live App](https://img.shields.io/badge/Live_App-spacepaste.app-FFB300?style=for-the-badge&logo=googlechrome&logoColor=2A1B17)](https://spacepaste.app/)
[![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-Active-006978?style=for-the-badge&logo=github)](https://shangle.github.io/space-paste/)
[![Local-First](https://img.shields.io/badge/Privacy-100%25_Local--First-C74800?style=for-the-badge&logo=sqlite)](https://spacepaste.app/)
[![Accessibility](https://img.shields.io/badge/Lighthouse_ADA-100%2F100-2A1B17?style=for-the-badge&logo=lighthouse)](https://spacepaste.app/)

---

## 🌟 Real-World Everyday Scenarios

### 🚗 1. The Car Podcast Memory Vault
You’re listening to an episode on your phone during your drive home. You arrive in your driveway and want to pick up right where you left off tomorrow.  
* **The Problem:** In the past, you couldn't "eject" the tape to pick up where you left off.
* **The Space Paste Solution:** Tap your podcast app's built-in **Share** button directly to **Space Paste → Car Stash**. Next time you step into your car or tap `spacepaste.app/car`, your saved episode pops up in 1 millisecond.

### 🧰 2. Toolbox & Workshop Specs
Print a QR sticker label and attach it to your workbench or red metal toolbox. Scan it to instantly pull up metric hex key sizes, oil filter part numbers, or wiring diagrams without searching through bookmarks while holding a wrench.

### ☕ 3. Espresso Coffee Bar Dial-In
Snap a quick photo signature of your coffee station. Space Paste matches your espresso machine visually and brings up your dialed-in grind sizes, water temperatures, and bean roast dates.

---

## ✨ Key Platform Features

- 🔒 **100% Local-First IndexedDB Vault**: All notes, links, passwords, and photo hashes stay strictly inside your browser's local IndexedDB storage. Zero cloud surveillance servers or tracking.
- 📲 **PWA & Web Share Target**: Add Space Paste to your home screen for 1-tap physical memory access. Receives shared URLs directly from iOS Safari or Android Chrome share sheets.
- 🏷️ **Tactile QR Sticker Studio**: Generate high-res printable QR code labels formatted for home thermal label printers or standard label sheets.
- 📸 **Perceptual Photo AI Recognition**: Uses 64-bit structural luminance hashing to recognize physical spots visually without requiring QR stickers.
- 🔍 **Slack/Gmail Style Search**: Global `/` or `Cmd/Ctrl + K` keyboard shortcut for instant live filtering across location names, notes, links, and tags.
- ♿ **WCAG AAA Contrast (100/100 Lighthouse)**: Certified high-contrast color tokens (`#2A1B17` Dark Kosmo Espresso, `#C74800` Orbit Orange, `#006978` Astro Turquoise).
- ✏️ **Full Vault Editing & Management**: Edit location names, descriptions, icon badges, theme colors, GPS tagging, and photo signatures anytime.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Core**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/)
- **Styling Engine**: Modern Vanilla CSS with high-performance CSS variable tokens and 44px minimum touch targets
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Persistence**: Native IndexedDB API
- **Audio Feedback**: Web Audio API Sound Synthesizer (`services/sound.ts`)
- **Visual AI**: HTML5 Canvas 2D Luminance Matrix Extraction (`services/vision.ts`)

---

## 🚀 Quick Start & Local Setup

```bash
# Clone repository
git clone https://github.com/shangle/space-paste.git
cd space-paste

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📦 Production Build & Deployment

```bash
# Compile TypeScript & Build Production Bundle
npm run build

# Deploy to GitHub Pages (spacepaste.app)
npx gh-pages -d dist
```

---

## 📄 License & Privacy Promise

Space Paste is **100% Free** and **Local-First**. No user tracking, no sign-ups, no data collection. Your physical memory remains private to your device.
