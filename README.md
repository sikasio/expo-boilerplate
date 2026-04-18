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

## License

Apache-2.0 © Sikasio
