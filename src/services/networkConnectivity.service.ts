/**
 * Network Connectivity Service
 *
 * Monitors internet connection state and notifies listeners when connectivity changes.
 * Essential for handling audio playback resume after internet reconnection.
 *
 * Uses simplified approach without external dependencies.
 */

import { logger } from '@/utils/logger';

export interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean;
  type: string;
  wasOffline: boolean;
  isNowOnline: boolean;
}

export class NetworkConnectivityService {
  private static instance: NetworkConnectivityService;
  private listeners: ((state: NetworkState) => void)[] = [];
  private currentState: NetworkState = {
    isConnected: true, // Assume connected initially
    isInternetReachable: true,
    type: 'unknown',
    wasOffline: false,
    isNowOnline: false,
  };
  private initialized = false;
  private checkInterval: NodeJS.Timeout | null = null;
  private connectionCheckUrl = 'https://www.google.com/favicon.ico'; // Small, fast endpoint

  public static getInstance(): NetworkConnectivityService {
    if (!NetworkConnectivityService.instance) {
      NetworkConnectivityService.instance = new NetworkConnectivityService();
    }
    return NetworkConnectivityService.instance;
  }

  /**
   * Initialize network monitoring with periodic checks
   */
  initialize() {
    if (this.initialized) {
      return;
    }

    this.initialized = true;

    // Start periodic connection checks
    this.startPeriodicChecks();

    logger.debug('Network connectivity monitoring initialized', {
      component: 'NetworkConnectivityService',
      checkInterval: '5 seconds'
    });
  }

  /**
   * Start periodic network connectivity checks
   */
  private startPeriodicChecks() {
    // Initial check
    this.checkConnectivity();

    // Check every 5 seconds
    this.checkInterval = setInterval(() => {
      this.checkConnectivity();
    }, 5000);
  }

  /**
   * Check internet connectivity by attempting to fetch a small resource
   */
  private async checkConnectivity() {
    try {
      const previousState = { ...this.currentState };

      // Use AbortController to timeout the request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(this.connectionCheckUrl, {
        method: 'HEAD',
        cache: 'no-cache',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const isConnected = response.ok;
      const newState: NetworkState = {
        isConnected,
        isInternetReachable: isConnected,
        type: 'unknown',
        wasOffline: !previousState.isConnected || !previousState.isInternetReachable,
        isNowOnline: false,
      };

      // Determine if we just came online
      newState.isNowOnline = newState.wasOffline && newState.isConnected && newState.isInternetReachable;

      // Only update and notify if state actually changed
      const stateChanged =
        previousState.isConnected !== newState.isConnected ||
        previousState.isInternetReachable !== newState.isInternetReachable;

      if (stateChanged) {
        // Log connectivity changes
        if (newState.isNowOnline) {
          logger.info('Internet connection restored', {
            component: 'NetworkConnectivityService',
            previousState: {
              isConnected: previousState.isConnected,
              isInternetReachable: previousState.isInternetReachable
            },
            newState: {
              isConnected: newState.isConnected,
              isInternetReachable: newState.isInternetReachable
            }
          });
        } else if (!newState.isConnected && previousState.isConnected) {
          logger.warn('Internet connection lost', {
            component: 'NetworkConnectivityService',
            state: {
              isConnected: newState.isConnected,
              isInternetReachable: newState.isInternetReachable
            }
          });
        }

        this.currentState = newState;
        this.notifyListeners(newState);
      }

    } catch (error) {
      // Connection failed - we're offline
      const previousState = { ...this.currentState };
      const wasOnline = previousState.isConnected || previousState.isInternetReachable;

      const newState: NetworkState = {
        isConnected: false,
        isInternetReachable: false,
        type: 'unknown',
        wasOffline: wasOnline,
        isNowOnline: false,
      };

      // Only update if we were previously online
      if (wasOnline) {
        logger.warn('Internet connection lost (fetch failed)', {
          component: 'NetworkConnectivityService',
          error: error instanceof Error ? error.message : 'Unknown error'
        });

        this.currentState = newState;
        this.notifyListeners(newState);
      }
    }
  }

  /**
   * Add listener for network state changes
   */
  addListener(listener: (state: NetworkState) => void): () => void {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      this.removeListener(listener);
    };
  }

  /**
   * Remove network state listener
   */
  removeListener(listener: (state: NetworkState) => void) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  /**
   * Notify all listeners of network state change
   */
  private notifyListeners(state: NetworkState) {
    this.listeners.forEach(listener => {
      try {
        listener(state);
      } catch (error) {
        logger.error('Error in network state listener:', error, {
          component: 'NetworkConnectivityService',
          function: 'notifyListeners'
        });
      }
    });
  }

  /**
   * Get current network state
   */
  getCurrentState(): NetworkState {
    return this.currentState;
  }

  /**
   * Check if currently online
   */
  isOnline(): boolean {
    return this.currentState.isConnected && this.currentState.isInternetReachable;
  }

  /**
   * Check if currently offline
   */
  isOffline(): boolean {
    return !this.isOnline();
  }

  /**
   * Get current network type
   */
  getNetworkType(): string {
    return this.currentState.type;
  }

  /**
   * Cleanup resources
   */
  destroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.listeners = [];
    this.initialized = false;
  }
}

export const networkConnectivityService = NetworkConnectivityService.getInstance();