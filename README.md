# SmartHerz Assistant FE

Frontend foundation for the SmartHerz Assistant application.

The right panel selects cards by matching keywords in the question and completed
answer. `src/data/poiCatalog.json` contains the 280 source rows from the `svi POI`
sheet, with bilingual card text and image URLs. Confirmed duplicate places share
one card. Names support diacritics, Cyrillic and common grammatical endings.
Card content comes from the local catalog. Municipality filters support places
shared by multiple municipalities, and the user can expand all matching POIs.
No integration API key is embedded in the frontend.

This project is built with the `Next.js` App Router and currently serves as the initial UI skeleton for further assistant development. The goal of this codebase is to provide a stable frontend setup, a basic layout system, a UI component library, and a static build/deployment flow.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Current Implementation](#current-implementation)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Configuration](#configuration)
- [Build and Deployment](#build-and-deployment)
- [Notes](#notes)

## Overview

This repository contains the frontend base for SmartHerz Assistant. The current version is not a finished production interface. It is a starting point for building the main UI modules and future integrations.

The current setup is intended to:

- provide a `Next.js` frontend with `TypeScript`
- use `MUI` as the primary UI library
- prepare the project for internationalization through `i18next`
- support static export for simpler deployment

## Tech Stack

- `Next.js 14`
- `React 18`
- `TypeScript`
- `MUI`
- `Emotion`
- `i18next`
- `Axios`
- `Fabric.js`

## Current Implementation

The codebase currently includes:

- a root layout in `src/app/layout.tsx`
- `Inter` and `Roboto Mono` fonts loaded through `next/font/google`
- global styles and base CSS variables in `src/app/globals.css`
- a two-column `MUI Box` layout on the home page in `src/app/page.tsx`
- a responsive layout:
  - single column on smaller screens
  - two columns from the `md` breakpoint upward
- placeholder `LEFT` and `RIGHT` panels as the base for future modules

Internationalization and helper dependencies are installed, but they are not yet wired into the active UI flow.

## Project Structure

```text
.
|-- globals.d.ts
|-- next.config.js
|-- package.json
|-- public/
`-- src/
    `-- app/
        |-- favicon.ico
        |-- globals.css
        |-- layout.tsx
        |-- page.module.css
        `-- page.tsx
```

Key files:

- `src/app/page.tsx` - current home page and layout entry point
- `src/app/layout.tsx` - global layout and font configuration
- `src/app/globals.css` - base global styles
- `next.config.js` - build and deployment configuration
- `globals.d.ts` - TypeScript declaration for CSS imports

## Getting Started

### Prerequisites

- `Node.js` LTS
- `npm`

### Installation

```bash
npm install
```

### Run in Development

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Available Scripts

```bash
npm run dev
npm run build
npm run lint
```

Script summary:

- `npm run dev` - starts the development server
- `npm run build` - creates the production static build
- `npm run lint` - runs ESLint

## Configuration

The project uses `next.config.js` with the following relevant settings:

- `output: "export"` for static export
- `trailingSlash: true`
- `basePath` and `assetPrefix` driven by `NEXT_PUBLIC_BASE_PATH`
- `images.unoptimized: true`
- remote image host allowlist for `cybercompany.ai`
- `topLevelAwait` enabled through webpack experiments

### Environment Variables

Optional:

```bash
NEXT_PUBLIC_BASE_PATH=/your-base-path
NEXT_PUBLIC_CHAT_URL=http://localhost:8000
```

Use this when the application needs to be served from a subpath.
`NEXT_PUBLIC_CHAT_URL` selects the SmartHerz backend used by the chat UI.

In Windows PowerShell:

```powershell
$env:NEXT_PUBLIC_BASE_PATH="/your-base-path"
```

## Build and Deployment

To create a production build:

```bash
npm run build
```

The static output is generated in the `out/` directory.

To preview the exported build locally:

```bash
npx serve@latest out
```

`npm start` is not a valid runtime flow for the current setup because `Next.js` with `output: "export"` does not support `next start`.

## Food photos in chat

`src/data/foodCatalog.ts` contains the food names in Bosnian and English, matching aliases, and photo URLs. Add or update entries here to maintain the available food photos.

Food photos are enabled per message only when `isFoodQuestion` recognizes a dish name or an explicit food/dining topic in the user's question, in Bosnian or English. General sightseeing questions do not show food photos just because the reply mentions cuisine. Existing interest filters and earlier food questions do not enable photos for later unrelated questions.

After an eligible assistant reply finishes, `findFoodImages` matches names in that reply. `FoodImages` displays each matched photo once below its message, in order of mention, with captions in the selected interface language. Photos that fail to load are hidden.

Click a food photo to open its full image in a modal. Close it with the close button, Escape, or a click outside the image. Keyboard focus returns to the photo button after closing.

## Notes

- `page.module.css` is still present in the repository, but the active home page is currently styled through `MUI` in `page.tsx`.
- The implementation is currently a project foundation, not a final user-facing interface.
- Internationalization dependencies are installed, but not yet integrated into the application flow.
