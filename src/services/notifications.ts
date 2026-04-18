import * as Notifications from 'expo-notifications';
import { logger } from '../utils/logger';

export class NotificationService {
  static async initialize(): Promise<void> {
    // Configure notification behavior
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    // Request permissions
    await this.requestPermissions();
  }

  static async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        logger.warn('Failed to get push token for push notification!', {
          function: 'requestPermissions',
          component: 'NotificationService',
          finalStatus
        });
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Error requesting notification permissions', error, {
        function: 'requestPermissions',
        component: 'NotificationService'
      });
      return false;
    }
  }

  static async getPushToken(): Promise<string | null> {
    try {
      const { data: token } = await Notifications.getExpoPushTokenAsync();
      return token;
    } catch (error) {
      logger.error('Error getting push token', error, {
        function: 'getPushToken',
        component: 'NotificationService'
      });
      return null;
    }
  }

  static async scheduleNotification(
    title: string,
    body: string,
    trigger: Notifications.NotificationTriggerInput
  ): Promise<string> {
    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
        },
        trigger,
      });
      return id;
    } catch (error) {
      logger.error('Error scheduling notification', error, {
        function: 'scheduleNotification',
        component: 'NotificationService',
        title
      });
      throw error;
    }
  }

  static async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      logger.error('Error canceling notification', error, {
        function: 'cancelNotification',
        component: 'NotificationService',
        notificationId
      });
      throw error;
    }
  }

  static async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      logger.error('Error canceling all notifications', error, {
        function: 'cancelAllNotifications',
        component: 'NotificationService'
      });
      throw error;
    }
  }

  static async getBadgeCount(): Promise<number> {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      logger.error('Error getting badge count', error, {
        function: 'getBadgeCount',
        component: 'NotificationService'
      });
      return 0;
    }
  }

  static async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      logger.error('Error setting badge count', error, {
        function: 'setBadgeCount',
        component: 'NotificationService',
        count
      });
    }
  }

  static addNotificationListener(
    callback: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(callback);
  }

  static addNotificationResponseListener(
    callback: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }
}