# @sikasio/expo-boilerplate

Sikasio's shared Expo / React Native component & utilities package.
Published from [github.com/sikasio/expo-boilerplate](https://github.com/sikasio/expo-boilerplate).

## Install

```bash
npm install @sikasio/expo-boilerplate
```

## Usage

```ts
import { Button, Card, Text } from '@sikasio/expo-boilerplate/components/ui';
import { useTheme, useRTL } from '@sikasio/expo-boilerplate/contexts';
import { StorageService } from '@sikasio/expo-boilerplate/services';
import { transformRTLStyle } from '@sikasio/expo-boilerplate/utils';
```

### Fonts (Zain Arabic family)

```ts
import { useFonts } from 'expo-font';

useFonts({
  'Zain-Regular': require('@sikasio/expo-boilerplate/fonts/Zain-Regular.ttf'),
  'Zain-Bold':    require('@sikasio/expo-boilerplate/fonts/Zain-Bold.ttf'),
  // …
});
```

## Examples

The [`examples/`](./examples) directory contains a runnable Expo app that
imports from this package via `file:..`, so local changes to `src/` reload
into the example immediately. Great starting point for a new Sikasio app
or a playground for testing changes to the boilerplate.

- [`examples/_default`](./examples/_default) — minimal starter demoing every
  component, context, hook, util, and screen exposed by the package.
  `cd examples/_default && npm install && npx expo start`.

Examples are not shipped in the npm tarball (see `.npmignore`).

## License

Apache-2.0 © Sikasio
