import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PermissionsAndroid, Platform, ToastAndroid } from 'react-native';
import notifee from '@notifee/react-native';
import { BASE_URL } from '../Components/constant/Url';
import { navigateToTab } from '../Navigations/NavigationService';

// Request Notification Permissions for Android 13+
export const requestNotificationPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                {
                    title: 'Notification Permission',
                    message: 'This app needs access to your notifications',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return
            } else {
                ToastAndroid.showWithGravityAndOffset("Notification Permission Required to receive Real Time Alerts.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50)
                // Alert.alert("Notification Permission Required to receive Real Time Alerts.")
            }
        } catch (err) {
            ToastAndroid.showWithGravityAndOffset(err, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        }
    }
};

// Create a Notification Channel
export const createNotificationChannel = async () => {
    await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
    });
};

export const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        getFcmToken();
    }
};

const getFcmToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    let userId = await AsyncStorage.getItem('userId');
    if (!fcmToken) {
        try {
            fcmToken = await messaging().getToken();
            if (fcmToken) {
                await AsyncStorage.setItem('fcmToken', fcmToken);
                sendFcmToken(fcmToken, userId);
            }
        } catch (error) {
            ToastAndroid.showWithGravityAndOffset(error, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50)
        }
    } else {
        sendFcmToken(fcmToken, userId);
    }
};

const sendFcmToken = async (token, userId) => {
    await fetch(`${BASE_URL}/user/save-fcm-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId,
            fcmToken: token,
        })
    })
        .then(res => res.json())
        .then(res => {
            if (res.message) {
                return;
            } else {
                ToastAndroid.showWithGravityAndOffset("Failed to generate Session", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50)
            }
        })
        .catch(error => {
            ToastAndroid.showWithGravityAndOffset(error, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50)
        });
};

export const notificationListener = () => {
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
        if (remoteMessage) {
            await displayNotification(remoteMessage);
        }
    });

    const unsubscribeBackground = messaging().onNotificationOpenedApp(async remoteMessage => {
        if (remoteMessage) {
            handleNotificationClick(remoteMessage);
        }
    });

    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                setTimeout(() => {
                    handleNotificationClick(remoteMessage);
                }, 1000); // Wait for navigation to be ready
            }
        });

    // Return cleanup functions
    return () => {
        unsubscribeForeground();
        unsubscribeBackground();
    };
};

const displayNotification = async (remoteMessage) => {
    const notificationId = remoteMessage.messageId || Date.now().toString();

    // Check if notification with this ID already exists
    const displayedNotifications = await notifee.getDisplayedNotifications();
    const exists = displayedNotifications.some(n => n.id === notificationId);

    if (exists) {
        return;
    }

    if (remoteMessage.notification) {
        const { title, body } = remoteMessage.notification;
        if (title && body && typeof title === 'string' && typeof body === 'string') {
            await notifee.displayNotification({
                id: notificationId,
                title: title,
                body: body,
                android: {
                    channelId: 'default',
                    smallIcon: 'ic_launcher',
                    pressAction: { id: 'default' },
                },
            });
        }
    }
};

const handleNotificationClick = (remoteMessage, navigation) => {
    const { type,roomId } = remoteMessage.data || {};
    if (type === 'chat') {
        navigateToTab('chat',roomId);
    } else if (type === 'group') {
        navigateToTab('group');
    } else {
        navigateToTab('home');
    }
};