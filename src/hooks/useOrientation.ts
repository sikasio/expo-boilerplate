import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export type Orientation = 'portrait' | 'landscape';

export function useOrientation(): Orientation {
  const [orientation, setOrientation] = useState<Orientation>(
    getOrientationFromDimensions(Dimensions.get('window'))
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setOrientation(getOrientationFromDimensions(window));
    });

    return () => subscription?.remove();
  }, []);

  return orientation;
}

function getOrientationFromDimensions({ width, height }: { width: number; height: number }): Orientation {
  return width > height ? 'landscape' : 'portrait';
}