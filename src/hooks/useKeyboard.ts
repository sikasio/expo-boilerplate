import { useState, useEffect } from 'react';
import { Keyboard, KeyboardEvent } from 'react-native';

export interface KeyboardInfo {
  isVisible: boolean;
  height: number;
}

export function useKeyboard(): KeyboardInfo {
  const [keyboard, setKeyboard] = useState<KeyboardInfo>({
    isVisible: false,
    height: 0,
  });

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
    const hideListener = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  const handleKeyboardShow = (event: KeyboardEvent) => {
    setKeyboard({
      isVisible: true,
      height: event.endCoordinates.height,
    });
  };

  const handleKeyboardHide = () => {
    setKeyboard({
      isVisible: false,
      height: 0,
    });
  };

  return keyboard;
}