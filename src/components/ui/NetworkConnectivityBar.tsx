import React, { useState, useEffect } from 'react';
import { View, Animated, Dimensions, Platform } from 'react-native';
import { Text } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { networkConnectivityService, NetworkState } from '@/services/networkConnectivity.service';

interface NetworkConnectivityBarProps {
  testID?: string;
  offlineMessage?: string;
  onlineMessage?: string;
}

export const NetworkConnectivityBar: React.FC<NetworkConnectivityBarProps> = ({
  testID = 'network-connectivity-bar',
  offlineMessage = 'لا يوجد اتصال بالإنترنت',
  onlineMessage = 'تم استعادة الاتصال بالإنترنت'
}) => {
  const { theme } = useTheme();
  const [networkState, setNetworkState] = useState<NetworkState | null>(null);
  const [showBar, setShowBar] = useState(false);
  const [barMessage, setBarMessage] = useState('');
  const [slideAnim] = useState(new Animated.Value(100)); // Start hidden (below screen)

  useEffect(() => {
    // Initialize network service
    networkConnectivityService.initialize();

    // Get initial state
    const currentState = networkConnectivityService.getCurrentState();
    setNetworkState(currentState);

    // Listen for network changes
    const unsubscribe = networkConnectivityService.addListener((state: NetworkState) => {
      setNetworkState(state);

      if (!state.isConnected || !state.isInternetReachable) {
        // Show offline bar immediately
        setBarMessage(offlineMessage);
        setShowBar(true);
        animateIn();
      } else if (state.isNowOnline) {
        // Show connection restored bar
        setBarMessage(onlineMessage);
        setShowBar(true);
        animateIn();

        // Hide the bar after 3 seconds
        setTimeout(() => {
          animateOut();
        }, 3000);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const animateIn = () => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const animateOut = () => {
    const { height } = Dimensions.get('window');
    const slideOutDistance = height * 0.18; // Slide to 18% from bottom to hide completely

    Animated.spring(slideAnim, {
      toValue: slideOutDistance,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start(() => {
      setShowBar(false);
    });
  };

  if (!showBar || !networkState) {
    return null;
  }

  const isOffline = !networkState.isConnected || !networkState.isInternetReachable;
  const barColor = isOffline ? '#DC2626' : '#059669'; // Red for offline, Green for online
  const { height } = Dimensions.get('window');
  const bottomMargin = height * 0.1; // 10% from bottom

  return (
    <Animated.View
      testID={testID}
      style={[
        {
          position: 'absolute',
          bottom: bottomMargin,
          left: 16,
          right: 16,
          transform: [{ translateY: slideAnim }],
          borderRadius: 8,
        },
        Platform.select({
          ios: {
            zIndex: 999999,
          },
          android: {
            elevation: 999999,
          }
        })
      ]}
    >
      <View
        style={{
          backgroundColor: barColor,
          paddingVertical: 12,
          paddingHorizontal: 16,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
        }}
      >
        <Text
          style={{
            color: '#FFFFFF',
            fontSize: 14,
            fontWeight: '600',
            textAlign: 'center',
          }}
          testID={`${testID}-message`}
        >
          {barMessage}
        </Text>
      </View>
    </Animated.View>
  );
};