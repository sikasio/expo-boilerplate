# Sikasio default example

Minimal Expo Router app that imports from `@sikasio/expo-boilerplate` and
showcases every component/context/hook/util exposed by the package.

Run it from this directory:

```bash
cd examples/_default
npm install
npx expo start
```

## How it's wired

- **`@sikasio/expo-boilerplate`** comes from `file:../..` so local edits to
  the parent package's `src/` reload into this example without needing a
  publish cycle. `metro.config.js` adds the parent as a `watchFolder`.
- Routes live under `app/` (Expo Router file-based).
- Example-only app code lives under `lib/` (mirrors the standalone-app
  layout used by the real Sikasio apps).
- Logo assets are local; real apps bring their own.

## What's demonstrated

Each tab in `app/(tabs)/` demonstrates a different slice of the boilerplate:
- `index.tsx` — theme + RTL overview
- `components.tsx` — UI components (Button, Card, Modal, List, …)
- `screens.tsx` — reusable screens (AuthScreen variants, Settings, Splash, Onboarding)
- `icons.tsx` — Icon + EnhancedIcon
- `explore.tsx` — misc utilities and hooks

## Use this as a scaffold

To start a fresh Sikasio app from scratch:

```bash
cp -r examples/_default ~/projects/my-new-app
cd ~/projects/my-new-app
# Edit package.json → replace "file:../.." with "^0.1.7" (published npm version)
# Adjust app.json (name, slug, bundleIdentifier, package)
npm install
npx expo start
```
