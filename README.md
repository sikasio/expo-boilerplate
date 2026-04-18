<p align="center">
  <img src="https://raw.githubusercontent.com/sikasio/expo-boilerplate/main/examples/_default/assets/logo.png" alt="@sikasio/expo-boilerplate" width="120" />
</p>

<h1 align="center">Production-Ready Expo / React Native Boilerplate</h1>

<p align="center">
  <strong>The Expo / React Native boilerplate you stop writing from scratch.</strong><br/>
  26 themed UI components · 5 form components · 4 reusable screens · 7 contexts · 8 services · 6 hooks · 9 utility modules · <strong>111 unit tests</strong> — all TypeScript, all tree-shakable via subpath exports, RTL-ready from day one.<br/>
  Battle-tested in multiple shipped Expo/React Native apps.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@sikasio/expo-boilerplate"><img src="https://img.shields.io/npm/v/@sikasio/expo-boilerplate?style=flat-square&logo=npm&color=CB3837" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@sikasio/expo-boilerplate"><img src="https://img.shields.io/npm/dw/@sikasio/expo-boilerplate?style=flat-square&logo=npm&color=CB3837" alt="npm downloads" /></a>
  <a href="https://github.com/sikasio/expo-boilerplate/actions/workflows/test.yml"><img src="https://img.shields.io/github/actions/workflow/status/sikasio/expo-boilerplate/test.yml?style=flat-square&logo=github&label=tests" alt="tests" /></a>
  <img src="https://img.shields.io/badge/tests-111_passing-success?style=flat-square" alt="111 tests passing" />
  <img src="https://img.shields.io/badge/Expo-SDK_54-000020?style=flat-square&logo=expo&logoColor=white" alt="Expo SDK 54" />
  <img src="https://img.shields.io/badge/React_Native-0.81-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React Native 0.81" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript 5.9" />
  <a href="LICENSE"><img src="https://img.shields.io/npm/l/@sikasio/expo-boilerplate?style=flat-square&color=blue" alt="Apache 2.0 license" /></a>
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> &bull;
  <a href="#why-sikasioexpo-boilerplate">Why?</a> &bull;
  <a href="#features">Features</a> &bull;
  <a href="#installation">Install</a> &bull;
  <a href="#usage">Usage</a> &bull;
  <a href="#api-surface">API</a> &bull;
  <a href="./examples/_default">Example</a> &bull;
  <a href="#testing">Testing</a> &bull;
  <a href="#contributing">Contributing</a>
</p>

---

## Quick Start

```bash
npm install @sikasio/expo-boilerplate
```

```tsx
// Drop a production-grade auth screen into your app
import { AuthScreen } from '@sikasio/expo-boilerplate/screens';

export default function LoginRoute() {
  return (
    <AuthScreen
      variant="login-email"
      layout="centered"
      onSubmit={async ({ email, password }) => { /* your auth logic */ }}
    />
  );
}
```

**Full setup with peers →** [Installation](#installation)  ·  **Runnable example app →** [`examples/_default`](./examples/_default)  ·  **See every export →** [API Surface](#api-surface)

---

## Why @sikasio/expo-boilerplate?

| Problem every Expo/RN app has on day one | This package's answer |
|---|---|
| Writing `Button`, `Card`, `Text`, `Modal`, `Avatar`, `List`, `Icon`, … from scratch | **26 themed UI components** with variants, sizes, loading states, animations, and a11y |
| Forms that need password toggle, OTP, phone mask, searchable select | **5 form components** with validation and controlled/uncontrolled modes |
| Writing an auth flow with 10 variants (login, register, forgot password, OTP, verification, …) | **AuthScreen** with 13 variants × 6 layouts × 6 themes, or pass `customFields` to extend |
| RTL is a nightmare — `marginLeft`/`marginRight` don't flip, icons point the wrong way | **Full RTL utility suite** — `transformRTLStyle`, `getRTLMargin`, `getRTLPadding`, icon flipping, 25/26 components RTL-ready |
| AsyncStorage everywhere, no namespacing, can't clear per-app | **StorageService** with app-prefixed keys + `smartClear`, `nuclearClear`, `showClearingDialog` |
| Theme + dark mode + color schemes require 200 lines of Context plumbing | **ThemeProvider + useTheme** with 6 color schemes, system/light/dark, persistent via AsyncStorage |
| Fonts are a pain — especially Arabic fonts that look right at every weight | **8 weights of Zain Arabic** bundled and require-able via subpath: `@sikasio/expo-boilerplate/fonts/Zain-Regular.ttf` |
| No shared code between apps means bug fixes don't propagate | **Versioned npm package** — semver releases, one source of truth, your fix ships to every app |
| Utilities (date formatting, validation, color parsing) are re-implemented per app | **9 utility modules with 111 unit tests** — validation, formatters, helpers, RTL, async retry, and more |

---

## Features

### 🎨 UI Components (26)

| Component | Variants / Key Props |
|-----------|---------------------|
| **Avatar** | sizes, status badges, initials fallback |
| **Button** | 10 variants, 5 sizes, icons, loading states |
| **ButtonGroup** | multi-select, orientation |
| **Card** | 8 color schemes, header/footer/actions |
| **Checkbox** | indeterminate, ReactNode labels |
| **CountdownTimer** | threshold states, animations |
| **EnhancedIcon** | icon families, smart fallbacks |
| **GallerySlider** | carousel with pagination |
| **HeroSection** | landing-page hero with variants |
| **HorizontalCardScroll** | horizontal scroll, empty states |
| **Icon** | auto RTL flipping |
| **LazyImage** | progressive loading, blurhash-friendly |
| **List** | collapsible sections, nested items |
| **LoadingScreen** | 4 variants (Simple, Detailed, Progress, Error) |
| **LoadingSpinner** | 3 variants, positioned |
| **MiniView** | RTL-aware `View` wrapper |
| **Modal** | 4 sizes × 5 variants, animated |
| **NetworkConnectivityBar** | online/offline indicator |
| **SkeletonCard** | 5 skeleton variants |
| **SplashLoader** | custom splash |
| **StarRating** | interactive, read-only modes |
| **Switch** | toggle, theme-aware |
| **TabBarIcon** | tab nav icons |
| **Text** | 5 variants, auto RTL alignment |
| **ThemeStatusBar** | auto-theme-aware status bar |
| **ThemeToast** | theme-aware notification toasts |

### 📝 Form Components (5)

- **TextInput** — password toggle, icons, validation hints, RTL
- **MaskedTextInput** — phone, credit card, date masks
- **OTPInput** — auto-focus, completion callback
- **Select** — searchable, multi-select, icons
- **SimpleDatePicker** — button-based date picker, theme-aware

### 🖼 Reusable Screens (4)

- **AuthScreen** — 13 variants (login, register, forgot-password, OTP, verification, …) × 6 layouts × 6 themes. `customFields` slot for extending.
- **SettingsScreen** — 4 layout variants, pre-built sections, pull-to-refresh.
- **OnboardingScreen** — swipe navigation, auto-play, progress indicators.
- **SplashScreen** — customizable splash with animations.

### 🧠 Contexts (7)

| Context | Responsibility |
|---------|----------------|
| **ThemeProvider** | Theme mode (system/light/dark) + color schemes, persistent |
| **RTLProvider** | RTL/LTR direction, persistent, per-app defaults |
| **FontProvider** | Font family + size, platform-aware line heights |
| **AuthProvider** | Generic auth state + token refresh |
| **AppProvider** | Global app state via useReducer |
| **SplashProvider** | Splash screen visibility |
| **CartProvider** | Shopping-cart state (generic `<T extends BaseProduct>`) |

### ⚙️ Services (8)

- **StorageService** — AsyncStorage wrapper with type safety + app-key prefixing
- **AuthService** — login, register, session, token refresh
- **CartService** — add/remove/update cart items with persistence
- **NotificationService** — push notification setup (expo-notifications)
- **NetworkConnectivityService** — online/offline monitoring
- **AppInitializationService** — startup orchestration (theme/RTL/font/auth checks)
- **StorageClearingService** — `smartClear`, `nuclearClear`, `quickTestClear`
- **FirstTimeService** — first-run detection per app+version

### 🪝 Hooks (6)

- **useAsync** — async state (`{ loading, error, data, execute }`)
- **useDebounce** — value + callback debouncing
- **useStorage** — reactive AsyncStorage hook
- **useKeyboard** — keyboard visibility tracking
- **useOrientation** — device orientation
- **use3ButtonNavigationDetector** — Android 3-button nav bar detection

### 🛠 Utilities (9 modules, 111 unit tests)

- **rtl** — `getFlexDirection`, `getTextAlign`, `getRTLMargin`, `getRTLPadding`, `getRTLBorder`, `transformRTLStyle`, `getRTLIconName`
- **validation** — email, password, phone, URL, numeric, alphabetic, alphanumeric, length boundaries, credit card (Luhn)
- **format** — currency, number, percentage, file size, phone, credit card, email masking, date
- **formatters** — `formatNumberWithCommas`, `formatPrice`, `formatPercentage`, `formatQuantity`
- **helpers** — `ArrayUtils` (unique, groupBy, chunk, shuffle), `ObjectUtils` (pick, omit, isEmpty, deepEqual), `ColorUtils` (hexToRgb, rgbToHex, adjustOpacity), `RandomUtils` (id, number, boolean, color), `AsyncUtils` (delay, retry)
- **logger** — scoped log channels (`logAuth`, `logAPI`, `logNavigation`, `logPerformance`, …)
- **fontUtils** — font-loading helpers
- **getCurrentApp** — multi-app environment detection

### 🌍 Zain Arabic Fonts (bundled)

All 8 weights ship with the package and are `require()`-able via subpath:

```ts
'Zain-Regular'     // 400
'Zain-Light'       // 300
'Zain-ExtraLight'  // 200
'Zain-Bold'        // 700
'Zain-ExtraBold'   // 800
'Zain-Black'       // 900
'Zain-Italic'
'Zain-LightItalic'
```

Licensed under [SIL Open Font License 1.1](assets/fonts/Zain/OFL.txt).

---

## Tech Stack

```
Framework     Expo SDK 54  ·  React Native 0.81  ·  Expo Router 6
Language      TypeScript 5.9 (ships as raw .ts, consumer Metro transpiles)
Peers         react 19  ·  react-hook-form 7  ·  reanimated 4  ·  gesture-handler 2
Storage       @react-native-async-storage/async-storage  ·  expo-secure-store
Fonts         Zain Arabic family (8 weights, OFL 1.1)
Testing       Jest  ·  ts-jest (111 tests, node env, RN mocked)
CI            GitHub Actions (test on every push/PR, publish on tag)
```

---

## Installation

```bash
npm install @sikasio/expo-boilerplate
```

Then install the peer dependencies your app uses (common set):

```bash
npx expo install expo-router expo-font expo-constants expo-linking \
  expo-splash-screen expo-status-bar expo-system-ui expo-haptics \
  expo-secure-store expo-blur expo-image expo-notifications \
  @react-native-async-storage/async-storage \
  @expo/vector-icons react-hook-form \
  react-native-gesture-handler react-native-reanimated \
  react-native-safe-area-context react-native-screens \
  react-native-worklets
```

> **Note**: Metro resolves this package's raw `.ts` source directly — no build step required on your side. If you hit resolver issues with subpath imports, confirm your `metro.config.js` uses Expo's default config (`getDefaultConfig(__dirname)`).

---

## Usage

### Common imports

```ts
import { Button, Card, Text, Modal } from '@sikasio/expo-boilerplate/components/ui';
import { TextInput, OTPInput, Select } from '@sikasio/expo-boilerplate/components/forms';
import { ThemeProvider, useTheme, useRTL, useFont } from '@sikasio/expo-boilerplate/contexts';
import { StorageService, AuthService, networkConnectivityService } from '@sikasio/expo-boilerplate/services';
import { useDebounce, useAsync } from '@sikasio/expo-boilerplate/hooks';
import { ValidationUtils, FormatUtils, ArrayUtils } from '@sikasio/expo-boilerplate/utils';
import { AuthScreen, SettingsScreen, OnboardingScreen } from '@sikasio/expo-boilerplate/screens';
```

### Bootstrap your app with the provider stack

```tsx
import { ExpoRoot } from 'expo-router';
import {
  AppProvider, AuthProvider, ThemeProvider, RTLProvider,
  FontProvider, SplashProvider
} from '@sikasio/expo-boilerplate/contexts';

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <ThemeProvider>
          <RTLProvider>
            <FontProvider>
              <SplashProvider>
                <ExpoRoot context={require.context('./app')} />
              </SplashProvider>
            </FontProvider>
          </RTLProvider>
        </ThemeProvider>
      </AuthProvider>
    </AppProvider>
  );
}
```

### Use the shared Auth screen

```tsx
import { AuthScreen } from '@sikasio/expo-boilerplate/screens';

export default function LoginRoute() {
  return (
    <AuthScreen
      variant="login-email"
      layout="centered"
      theme="light"
      logoSource={require('./assets/logo.png')}
      onSubmit={async ({ email, password }) => { /* ... */ }}
    />
  );
}
```

### Load Zain Arabic fonts

```tsx
import { useFonts } from 'expo-font';

const [loaded] = useFonts({
  'Zain-Regular':   require('@sikasio/expo-boilerplate/fonts/Zain-Regular.ttf'),
  'Zain-Bold':      require('@sikasio/expo-boilerplate/fonts/Zain-Bold.ttf'),
  'Zain-Black':     require('@sikasio/expo-boilerplate/fonts/Zain-Black.ttf'),
});
```

### RTL-safe styles

```tsx
import { useRTL } from '@sikasio/expo-boilerplate/contexts';
import { getRTLPadding, getFlexDirection } from '@sikasio/expo-boilerplate/utils';

function MyCard() {
  const { isRTL } = useRTL();
  return (
    <View style={{
      flexDirection: getFlexDirection(isRTL),
      ...getRTLPadding(isRTL).paddingStart(16),
      ...getRTLPadding(isRTL).paddingHorizontal(8),
    }}>
      <Text>مرحبا</Text>
    </View>
  );
}
```

---

## API Surface

The package uses **subpath exports** for clean tree-shaking. Import each category from its own barrel:

| Subpath | Exports |
|---------|---------|
| `@sikasio/expo-boilerplate` | root barrel re-exporting everything |
| `@sikasio/expo-boilerplate/components` | all components (UI + forms + layout + nav + overlays) |
| `@sikasio/expo-boilerplate/components/ui` | 26 UI components |
| `@sikasio/expo-boilerplate/components/forms` | TextInput, OTPInput, MaskedTextInput, Select, SimpleDatePicker |
| `@sikasio/expo-boilerplate/components/layout` | Container, KeyboardAvoidingContainer |
| `@sikasio/expo-boilerplate/components/navigation` | Header, BackButton, ThemedStackScreen, BottomTabNavigator |
| `@sikasio/expo-boilerplate/components/overlays` | GlobalConfigPanel |
| `@sikasio/expo-boilerplate/contexts` | 7 context providers + hooks |
| `@sikasio/expo-boilerplate/services` | 8 services |
| `@sikasio/expo-boilerplate/hooks` | 6 custom hooks |
| `@sikasio/expo-boilerplate/utils` | 9 utility modules |
| `@sikasio/expo-boilerplate/screens` | AuthScreen, SettingsScreen, OnboardingScreen, SplashScreen |
| `@sikasio/expo-boilerplate/config` | theme, navigation, fonts |
| `@sikasio/expo-boilerplate/constants` | shared constants |
| `@sikasio/expo-boilerplate/types` | TypeScript types |
| `@sikasio/expo-boilerplate/fonts/<file>.ttf` | Zain Arabic font files (8 weights) |

<details>
<summary><strong>Full peer-dependency matrix</strong></summary>

The package declares the following as `peerDependencies` — your app pins the versions:

| Package | Range |
|---------|-------|
| `expo` | `~54.0.0` |
| `react` | `19.1.0` |
| `react-native` | `0.81.5` |
| `expo-router` | `~6.0.7` |
| `expo-font` | `~14.0.4` |
| `expo-constants` | `~18.0.9` |
| `expo-linking` | `~8.0.8` |
| `expo-splash-screen` | `~31.0.10` |
| `expo-status-bar` | `~3.0.8` |
| `expo-system-ui` | `~6.0.7` |
| `expo-haptics` | `~15.0.7` |
| `expo-secure-store` | `~15.0.7` |
| `expo-blur` | `~15.0.7` |
| `expo-image` | `~3.0.8` |
| `expo-notifications` | `^0.32.11` |
| `@react-native-async-storage/async-storage` | `2.2.0` |
| `@expo/vector-icons` | `>=14.0.0` |
| `react-hook-form` | `^7.61.1` |
| `react-native-gesture-handler` | `~2.28.0` |
| `react-native-reanimated` | `~4.1.0` |
| `react-native-safe-area-context` | `^5.4.0` |
| `react-native-screens` | `~4.16.0` |
| `react-native-worklets` | `^0.5.1` |

Direct `dependencies` (owned by this package): `axios`, `date-fns`, `react-native-toast-message`, `react-native-url-polyfill`.

</details>

---

## Example

A full runnable example lives in [`examples/_default`](./examples/_default):

```bash
cd examples/_default
npm install
npx expo start
```

The example uses `"@sikasio/expo-boilerplate": "file:../.."` so edits to `src/` live-reload into the example without a publish cycle. Metro's `watchFolders` is configured in the example's `metro.config.js` to include this package root.

It's also the fastest way to **scaffold a new Sikasio app**:

```bash
cp -r examples/_default ~/projects/my-new-app
cd ~/projects/my-new-app
# 1. swap "file:../.." for the published version in package.json:
#      "@sikasio/expo-boilerplate": "^0.1.9"
# 2. edit app.json (name, slug, bundleIdentifier, package)
npm install
npx expo start
```

---

## Testing

The package ships a 111-test Jest suite covering the utility layer. Tests run in a Node environment with a minimal React Native mock — no RN rendering surface, no jest-expo — so the suite finishes in **~1 second**.

```bash
npm test                  # full suite
npm run test:coverage     # with lcov report in coverage/
npm run test:watch        # TDD mode
```

| Module | Tests | Focus |
|--------|-------|-------|
| `utils/rtl` | 19 | flex/text/margin/padding/border direction, style transforms, icon flipping |
| `utils/validation` | 15 | email, password, phone, URL, length, numeric/alpha checks |
| `utils/format` | 17 | currency, number, percentage, file size, phone, card, email masking |
| `utils/formatters` | 10 | `formatNumberWithCommas`, `formatPrice`, `formatPercentage`, `formatQuantity` |
| `utils/helpers` | 47 | `ArrayUtils`, `ObjectUtils`, `ColorUtils`, `RandomUtils` |
| `utils/helpers` (AsyncUtils) | 3 | `delay`, `retry` success/failure paths |

CI runs the full suite on every push and pull request via [`.github/workflows/test.yml`](.github/workflows/test.yml). Publishing to npm is automated via `v*` tag pushes (`.github/workflows/publish.yml`).

---

## Project Structure

```
@sikasio/expo-boilerplate/
├── src/
│   ├── components/
│   │   ├── ui/              26 themed UI components
│   │   ├── forms/           5 form components
│   │   ├── layout/          Container, KeyboardAvoidingContainer
│   │   ├── navigation/      Header, BackButton, ThemedStackScreen, BottomTabNavigator
│   │   └── overlays/        GlobalConfigPanel
│   ├── contexts/            7 context providers (Theme, RTL, Font, Auth, App, Splash, Cart)
│   ├── services/            8 services (storage, auth, cart, notifications, …)
│   ├── hooks/               6 custom hooks
│   ├── utils/               9 utility modules (rtl, validation, format, helpers, …)
│   ├── screens/             4 reusable screens (Auth, Settings, Onboarding, Splash)
│   ├── config/              theme, navigation, fonts
│   ├── constants/
│   └── types/
├── assets/
│   └── fonts/Zain/          8 weights of Zain Arabic + OFL 1.1 license
├── examples/
│   └── _default/            Runnable Expo app wired to this package via file:..
├── __tests__/               111 Jest tests + RN mock
│   ├── utils/
│   └── __mocks__/
├── .github/workflows/       Test + Publish CI
├── package.json             Subpath exports, peer deps, raw-source shipping
└── LICENSE                  Apache 2.0
```

---

## Contributing

Contributions are welcome. See below for the dev setup, areas where help is most needed, and the security disclosure policy.

```bash
git clone https://github.com/sikasio/expo-boilerplate.git
cd expo-boilerplate
npm install
npm test
cd examples/_default && npm install && npx expo start
```

### Areas where help is welcome

- **More tests** — contexts, hooks (useAsync, useDebounce), services (cart, storage)
- **Component snapshot tests** via `@testing-library/react-native`
- **Accessibility** — ARIA labels, screen reader flows, focus order audit
- **Docs site** — Storybook or a dedicated docs page
- **Examples** — `examples/supabase-starter`, `examples/firebase-starter`, etc.

### Security

Found a vulnerability? Please use GitHub's [private vulnerability reporting](https://github.com/sikasio/expo-boilerplate/security/advisories/new) instead of a public issue. We aim to acknowledge reports within 72 hours and ship a fix or mitigation before any public disclosure.

---

## Versioning & Release

- **Semver** — breaking changes bump the major, features bump the minor, fixes bump the patch.
- **Pre-1.0** — the public API can still shift; review release notes before upgrading.
- **Release flow** — `npm version <patch|minor|major> && git push --follow-tags` → GitHub Actions publishes to npm automatically via the `NPM_TOKEN` secret.

---

## License

Released under the [Apache 2.0 License](LICENSE). Free for commercial and non-commercial use, no attribution required but appreciated.

> The `Zain` Arabic font family is distributed under the [SIL Open Font License 1.1](assets/fonts/Zain/OFL.txt) — a separate, font-specific license bundled alongside the package.

---

## Keywords

`expo` · `expo-boilerplate` · `expo-template` · `expo-starter` · `expo-router` · `react-native` · `react-native-boilerplate` · `react-native-template` · `react-native-starter` · `react-native-ui` · `ui-components` · `ui-kit` · `component-library` · `theme` · `dark-mode` · `rtl` · `arabic` · `i18n` · `auth-screen` · `form-components` · `react-hook-form` · `async-storage` · `typescript` · `hooks` · `boilerplate` · `template` · `starter` · `mobile` · `zain-font` · `subpath-exports`

---

<p align="center">
  <strong>Built by <a href="https://sikasio.com">Sikasio</a></strong> — A design &amp; development studio from Cairo, Egypt.<br/>
  <a href="https://github.com/sikasio/expo-boilerplate/issues">Report Bug</a> &bull;
  <a href="https://github.com/sikasio/expo-boilerplate/issues/new">Request Feature</a> &bull;
  <a href="https://github.com/sikasio/expo-boilerplate">Star on GitHub</a>
</p>
