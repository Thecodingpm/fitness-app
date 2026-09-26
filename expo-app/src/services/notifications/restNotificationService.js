// restNotificationService.js — Local Notification Scheduler for Rest Completion

let customNotificationDriver = null;
let activeScheduledNotificationId = null;
let isConfigured = false;

export function setNotificationDriver(driver) {
  customNotificationDriver = driver;
}

export function getActiveNotificationIdForTest() {
  return activeScheduledNotificationId;
}

export function resetNotificationStateForTest() {
  activeScheduledNotificationId = null;
  isConfigured = false;
}

async function getNotifications() {
  if (customNotificationDriver) return customNotificationDriver;
  try {
    const mod = await import('expo-notifications');
    return mod?.default || mod;
  } catch (_err) {
    return null;
  }
}

/**
 * Configures foreground notification presentation options.
 * When LIFT is in the foreground, we suppress alert/sound so in-app UI handles feedback.
 */
export async function configureForegroundNotifications() {
  if (isConfigured) return;
  const Notifications = await getNotifications();
  if (Notifications && typeof Notifications.setNotificationHandler === 'function') {
    try {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: false,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
      isConfigured = true;
    } catch (_err) {
      // Graceful fallback for non-native / unsupported runtimes
    }
  }
}

/**
 * Contextually requests notification permissions.
 * Does not throw on rejection.
 */
export async function requestNotificationPermissionIfNeeded() {
  const Notifications = await getNotifications();
  if (!Notifications || typeof Notifications.getPermissionsAsync !== 'function') {
    return false;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    if (existingStatus === 'granted') {
      await configureForegroundNotifications();
      return true;
    }

    if (typeof Notifications.requestPermissionsAsync === 'function') {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        await configureForegroundNotifications();
        return true;
      }
    }
    return false;
  } catch (_err) {
    return false;
  }
}

/**
 * Schedules a single local notification for when the rest timer reaches 0.
 * Automatically cancels any previously scheduled rest notification.
 */
export async function scheduleRestNotification(restEndsAt) {
  if (!restEndsAt || typeof restEndsAt !== 'number') return null;

  // Always cancel any prior scheduled notification first
  await cancelRestNotification();

  const now = Date.now();
  const seconds = Math.max(1, Math.ceil((restEndsAt - now) / 1000));

  const Notifications = await getNotifications();
  if (!Notifications || typeof Notifications.scheduleNotificationAsync !== 'function') {
    return null;
  }

  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'LIFT',
        body: 'Rest complete — time for your next set.',
        sound: true,
      },
      trigger: {
        type: 'timeInterval',
        seconds,
        repeats: false
      },
    });

    activeScheduledNotificationId = id;
    return id;
  } catch (_err) {
    return null;
  }
}

/**
 * Cancels any active rest-complete notification.
 */
export async function cancelRestNotification() {
  if (!activeScheduledNotificationId) return;

  const idToCancel = activeScheduledNotificationId;
  activeScheduledNotificationId = null;

  const Notifications = await getNotifications();
  if (!Notifications || typeof Notifications.cancelScheduledNotificationAsync !== 'function') {
    return;
  }

  try {
    await Notifications.cancelScheduledNotificationAsync(idToCancel);
  } catch (_err) {
    // Ignore cancellation errors
  }
}
