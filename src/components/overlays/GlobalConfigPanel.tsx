import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  ViewStyle,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { StorageClearingService } from '../../services/storageClearingService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useRTL } from '../../contexts/RTLContext';
import { useFont } from '../../contexts/FontContext';
import { getCurrentAppDefaults, logCurrentAppDefaults } from '../../config/appDefaults';
import { getCurrentApp } from '../../utils/getCurrentApp';
import { Icon } from '../ui/Icon';
import { Text } from '../ui/Text';
import { List, ListItem } from '../ui/List';
import { Switch } from '../ui/Switch';

interface GlobalConfigPanelProps {
  style?: ViewStyle;
  testID?: string;
}

interface ConfigOption {
  id: string;
  label: string;
  icon: string;
  description: string;
  type: 'toggle' | 'colorScheme' | 'fontFamily' | 'fontSize';
  value?: boolean | string | number;
  onToggle?: (value: boolean) => void;
  onPress?: () => void;
  onValueChange?: (value: any) => void;
  options?: { label: string; value: string; primary?: string; secondary?: string; description?: string }[];
  min?: number;
  max?: number;
  step?: number;
}

export function GlobalConfigPanel({
  style,
  testID = 'global-config-panel',
}: GlobalConfigPanelProps) {
  // Only show in development mode, hide in production builds
  if (process.env.EXPO_PUBLIC_APP_ENV === 'production') {
    return null;
  }

  const { theme, toggleTheme, colorScheme, setColorScheme, setThemeMode } = useTheme();
  const { isRTL, toggleRTL } = useRTL();
  const { fontFamily, fontSize, availableFonts, setFontFamily, setFontSize } = useFont();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = Dimensions.get('window');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(true); // Start in half-hidden mode

  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const menuOpacity = useRef(new Animated.Value(0)).current;
  const menuScale = useRef(new Animated.Value(0.95)).current;
  const menuTranslateY = useRef(new Animated.Value(-50)).current;
  const slideAnim = useRef(new Animated.Value(45)).current; // Start in half-hidden position (45px offset)

  // Color scheme options
  const colorSchemeOptions = [
    { label: 'Blue', value: 'blue', primary: '#007AFF', secondary: '#5856D6' },
    { label: 'Green', value: 'green', primary: '#34C759', secondary: '#32ADE6' },
    { label: 'Purple', value: 'purple', primary: '#AF52DE', secondary: '#007AFF' },
    { label: 'Orange', value: 'orange', primary: '#FF9500', secondary: '#FF3B30' },
    { label: 'Red', value: 'red', primary: '#FF3B30', secondary: '#FF9500' },
    { label: 'Teal', value: 'teal', primary: '#5AC8FA', secondary: '#34C759' },
  ];

  const handleColorSchemeChange = (newColorScheme: string) => {
    setColorScheme(newColorScheme);
    const selectedColor = colorSchemeOptions.find(c => c.value === newColorScheme);
    console.log(`Color scheme changed to: ${selectedColor?.label} (Primary: ${selectedColor?.primary}, Secondary: ${selectedColor?.secondary})`);
  };

  const handleFontFamilyChange = (fontId: string) => {
    setFontFamily(fontId);
    setIsMenuOpen(false);
    setTimeout(() => slideOut(), 300);
  };

  const handleFontSizeChange = (size: number) => {
    setFontSize(size);
  };

  const handleResetToDefaults = () => {
    Alert.alert(
      'Reset to App Defaults',
      'This will reset theme and RTL settings to the default values for this app. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            const appDefaults = getCurrentAppDefaults();
            console.log('Resetting to app defaults:', appDefaults);

            // Reset color scheme
            setColorScheme(appDefaults.theme.colorScheme);

            // Reset theme mode - use setThemeMode directly instead of toggle
            setThemeMode(appDefaults.theme.mode);

            // Reset RTL setting
            if (appDefaults.rtl.enabled !== isRTL) {
              await toggleRTL();
            }

            setIsMenuOpen(false);
            setTimeout(() => slideOut(), 300);

            // Show confirmation with current app name
            const currentApp = getCurrentApp();
            Alert.alert('Reset Complete', `Settings have been reset to defaults for ${currentApp}:\n• Theme: ${appDefaults.theme.mode}\n• Colors: ${appDefaults.theme.colorScheme}\n• RTL: ${appDefaults.rtl.enabled ? 'Enabled' : 'Disabled'}`);
          }
        }
      ]
    );
  };


  const handleClearAllAppData = () => {
    StorageClearingService.showClearingDialog({
      onComplete: (result, method) => {
        // Close menu after clearing
        setIsMenuOpen(false);
        setTimeout(() => slideOut(), 300);

        // Log the result for debugging
        console.log(`${method} clear completed:`, result);
      },
      onCancel: () => {
        // Just close the menu if user cancels
        setIsMenuOpen(false);
        setTimeout(() => slideOut(), 300);
      }
    });
  };

  // Prepare font family options
  const fontFamilyOptions = availableFonts.map(font => ({
    label: font.displayName,
    value: font.id,
    description: font.description,
  }));

  // Configuration options - Theme, RTL, and Color Scheme
  const configOptions: ConfigOption[] = [
    {
      id: 'dark-mode-toggle',
      label: 'Dark Mode',
      icon: 'moon-outline',
      description: 'Use dark color scheme',
      type: 'toggle',
      value: theme.isDark,
      onToggle: (value: boolean) => {
        if (value !== theme.isDark) {
          toggleTheme();
        }
        setIsMenuOpen(false);
        setTimeout(() => slideOut(), 300);
      },
    },
    {
      id: 'rtl-direction-toggle',
      label: 'RTL Direction',
      icon: 'text-outline',
      description: 'Use Right-to-Left layout',
      type: 'toggle',
      value: isRTL,
      onToggle: (value: boolean) => {
        if (value !== isRTL) {
          toggleRTL();
        }
        setIsMenuOpen(false);
        setTimeout(() => slideOut(), 300);
      },
    },
    {
      id: 'color-scheme',
      label: 'Color Scheme',
      icon: 'color-palette-outline',
      description: 'Choose your app accent color',
      type: 'colorScheme',
      value: colorScheme,
      options: colorSchemeOptions,
    },
    {
      id: 'font-family',
      label: 'Font Family',
      icon: 'text-outline',
      description: 'Choose your preferred font style',
      type: 'fontFamily',
      value: fontFamily.id,
      options: fontFamilyOptions,
      onValueChange: handleFontFamilyChange,
    },
    {
      id: 'font-size',
      label: 'Font Size',
      icon: 'resize-outline',
      description: 'Adjust text size for better readability',
      type: 'fontSize',
      value: fontSize,
      min: 12,
      max: 24,
      step: 1,
      onValueChange: handleFontSizeChange,
    },
  ];

  // Add reset button option (development only)
  const devConfigOptions: ConfigOption[] = [
    ...configOptions,
    {
      id: 'reset-defaults',
      label: 'Reset to App Defaults',
      icon: 'refresh-outline',
      description: 'Reset all settings to current app defaults',
      type: 'toggle',
      value: false,
      onPress: handleResetToDefaults,
    },
    {
      id: 'clear-app-data',
      label: 'Clear All App Data & Cache',
      icon: 'trash-outline',
      description: 'Smart or nuclear clear of all app storage and cache',
      type: 'toggle',
      value: false,
      onPress: handleClearAllAppData,
    },
  ];


  // Animation functions
  const slideOut = () => {
    setIsHidden(true);
    Animated.timing(slideAnim, {
      toValue: 45, // Move 45px to the right (half hidden)
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const slideIn = () => {
    setIsHidden(false);
    Animated.timing(slideAnim, {
      toValue: 0, // Move back to original position
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    // If button is hidden, slide it in and open menu directly
    if (isHidden) {
      slideIn();
      // Open menu after slide-in animation completes
      setTimeout(() => {
        setIsMenuOpen(true);
      }, 300); // Match slide animation duration
      return;
    }

    // Animate button press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Toggle menu
    setIsMenuOpen(!isMenuOpen);
  };


  const handleOutsidePress = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      // Also slide out after closing menu
      setTimeout(() => {
        slideOut();
      }, 300);
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      Animated.parallel([
        Animated.timing(menuOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(menuScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(menuTranslateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(menuOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(menuScale, {
          toValue: 0.95,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(menuTranslateY, {
          toValue: -10,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isMenuOpen]);

  // Auto-close menu when user stops interacting
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isMenuOpen) {
      timeout = setTimeout(() => {
        setIsMenuOpen(false);
        // Slide out after auto-close
        setTimeout(() => {
          slideOut();
        }, 300);
      }, 5000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isMenuOpen]);

  // Auto slide-out when not interacting
  useEffect(() => {
    let slideTimeout: NodeJS.Timeout;
    if (!isMenuOpen && !isHidden) {
      slideTimeout = setTimeout(() => {
        slideOut();
      }, 3000); // Hide after 3 seconds of no interaction
    }
    return () => {
      if (slideTimeout) clearTimeout(slideTimeout);
    };
  }, [isMenuOpen, isHidden]);

  // Log app defaults on first render (development only)
  useEffect(() => {
    if (process.env.EXPO_PUBLIC_APP_ENV !== 'production') {
      logCurrentAppDefaults();
    }
  }, []);


  return (
    <>
      {/* Backdrop to close menu when tapping outside */}
      {isMenuOpen && (
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
      )}

      <Animated.View
        style={[
          styles.container,
          {
            top: screenHeight * 0.25, // 25% of device height
            transform: [
              { scale: scaleAnim },
              { translateX: slideAnim }
            ],
          },
          style,
        ]}
      >
        {/* Main Theme Button */}
        <TouchableOpacity
          onPress={handlePress}
          style={[
            styles.button,
            {
              backgroundColor: theme.colors.primary || '#007AFF',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            },
          ]}
          activeOpacity={0.8}
          testID={testID}
        >
          <View style={[
            styles.iconContainer,
            isHidden && styles.iconContainerShifted
          ]}>
            <Icon
              name={isHidden ? 'chevron-back-outline' : 'settings-outline'}
              size={20}
              color="#FFFFFF"
            />
          </View>
        </TouchableOpacity>

        {/* Configuration Menu Dropdown */}
        {isMenuOpen && (
          <Animated.View
            style={[
              styles.menu,
              {
                backgroundColor: theme.colors.surface || '#FFFFFF',
                borderColor: theme.colors.border || '#E5E5E5',
                opacity: menuOpacity,
                transform: [
                  { scale: menuScale },
                  { translateY: menuTranslateY }
                ],
              },
            ]}
          >
            <List variant="default" showDividers={true}>
              {(process.env.EXPO_PUBLIC_APP_ENV !== 'production' ? devConfigOptions : configOptions).map((option) => {
                if (option.type === 'toggle') {
                  const rightContent = option.id === 'reset-defaults' ? (
                    <TouchableOpacity
                      onPress={option.onPress}
                      style={{
                        backgroundColor: theme.colors.primary + '15',
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: theme.colors.primary
                      }}
                    >
                      <Text style={{ color: theme.colors.primary, fontSize: 12, fontWeight: '600' }}>
                        Reset
                      </Text>
                    </TouchableOpacity>
                  ) : option.id === 'clear-app-data' ? (
                    <TouchableOpacity
                      onPress={option.onPress}
                      style={{
                        backgroundColor: '#FF453A15',
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: '#FF453A'
                      }}
                    >
                      <Text style={{ color: '#FF453A', fontSize: 12, fontWeight: '600' }}>
                        Clear Data
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Switch
                      value={option.value as boolean}
                      onValueChange={(value) => option.onToggle?.(value)}
                      size="small"
                      activeColor={theme.colors.primary}
                      inactiveColor={theme.colors.border}
                      disabled={false}
                    />
                  );

                  return (
                    <ListItem
                      key={option.id}
                      title={option.label}
                      leftIcon={option.icon}
                      rightContent={rightContent}
                      variant="compact"
                    />
                  );
                } else if (option.type === 'colorScheme') {
                  return (
                    <React.Fragment key={option.id}>
                      <ListItem
                        title={option.label}
                        leftIcon={option.icon}
                        variant="compact"
                      />
                      {/* Color Options Row */}
                      <View style={styles.colorOptionsContainer}>
                        {option.options?.map((colorOption) => (
                          <TouchableOpacity
                            key={colorOption.value}
                            onPress={() => handleColorSchemeChange(colorOption.value)}
                            style={styles.colorOptionButton}
                            activeOpacity={0.7}
                          >
                            <View style={styles.colorRectangleContainer}>
                              <View
                                style={[
                                  styles.colorRectangle,
                                  styles.primaryColorRectangle,
                                  {
                                    backgroundColor: colorOption.primary,
                                  }
                                ]}
                              >
                                {option.value === colorOption.value && (
                                  <Icon
                                    name="checkmark"
                                    size={10}
                                    color="#FFFFFF"
                                  />
                                )}
                              </View>
                              <View
                                style={[
                                  styles.colorRectangle,
                                  styles.secondaryColorRectangle,
                                  {
                                    backgroundColor: colorOption.secondary,
                                  }
                                ]}
                              />
                            </View>
                            <Text style={[
                              styles.colorLabel,
                              {
                                color: option.value === colorOption.value 
                                  ? theme.colors.primary || '#007AFF'
                                  : theme.colors.textSecondary || '#666666',
                                fontWeight: option.value === colorOption.value ? '600' : '500',
                              }
                            ]}>
                              {colorOption.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </React.Fragment>
                  );
                } else if (option.type === 'fontFamily') {
                  return (
                    <React.Fragment key={option.id}>
                      <ListItem
                        title={option.label}
                        leftIcon={option.icon}
                        variant="compact"
                      />
                      {/* Font Family Options */}
                      <View style={styles.fontOptionsContainer}>
                        {option.options?.map((fontOption) => (
                          <TouchableOpacity
                            key={fontOption.value}
                            onPress={() => option.onValueChange?.(fontOption.value)}
                            style={[
                              styles.fontOptionButton,
                              {
                                backgroundColor: option.value === fontOption.value 
                                  ? theme.colors.primary + '15' 
                                  : theme.colors.surface,
                                borderColor: option.value === fontOption.value 
                                  ? theme.colors.primary 
                                  : theme.colors.border,
                              }
                            ]}
                            activeOpacity={0.7}
                          >
                            <Text style={[
                              styles.fontOptionText,
                              {
                                color: option.value === fontOption.value 
                                  ? theme.colors.primary 
                                  : theme.colors.text,
                                fontWeight: option.value === fontOption.value ? '600' : '500',
                              }
                            ]}>
                              {fontOption.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </React.Fragment>
                  );
                } else if (option.type === 'fontSize') {
                  return (
                    <React.Fragment key={option.id}>
                      <ListItem
                        title={option.label}
                        leftIcon={option.icon}
                        variant="compact"
                        rightContent={
                          <View style={styles.fontSizeContainer}>
                            <TouchableOpacity
                              onPress={() => option.onValueChange?.(Math.max(option.min || 12, (option.value as number) - 1))}
                              style={[styles.fontSizeButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                              disabled={(option.value as number) <= (option.min || 12)}
                            >
                              <Icon name="remove" size={16} color={theme.colors.text} />
                            </TouchableOpacity>
                            <Text style={[styles.fontSizeValue, { color: theme.colors.text }]}>
                              {option.value}px
                            </Text>
                            <TouchableOpacity
                              onPress={() => option.onValueChange?.(Math.min(option.max || 24, (option.value as number) + 1))}
                              style={[styles.fontSizeButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                              disabled={(option.value as number) >= (option.max || 24)}
                            >
                              <Icon name="add" size={16} color={theme.colors.text} />
                            </TouchableOpacity>
                          </View>
                        }
                      />
                    </React.Fragment>
                  );
                }
                return null;
              })}
            </List>
          </Animated.View>
        )}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9998,
  },
  container: {
    position: 'absolute',
    right: 20,
    zIndex: 9999,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  iconContainerShifted: {
    paddingLeft: 8,  // Less padding on left
    paddingRight: 16, // More padding on right
    alignItems: 'flex-start', // Align icon to the left
  },
  menu: {
    position: 'absolute',
    top: 60,
    right: 0,
    minWidth: 280,
    maxWidth: 320,
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  colorOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'transparent',
  },
  colorOptionButton: {
    alignItems: 'center',
    width: 45,
  },
  colorRectangleContainer: {
    width: 32,
    height: 20,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
    flexDirection: 'row',
  },
  colorRectangle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryColorRectangle: {
    // Primary color takes up the left half
  },
  secondaryColorRectangle: {
    // Secondary color takes up the right half
  },
  colorLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  fontOptionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  fontOptionButton: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
  },
  fontOptionText: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  fontOptionDescription: {
    fontSize: 10,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 2,
  },
  fontSizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fontSizeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontSizeValue: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'center',
  },
});