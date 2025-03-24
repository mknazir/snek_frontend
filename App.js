import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './Navigations/AuthStack';
import { AuthProvider, useAuth } from './Context/AuthContext';
import { PaperProvider } from 'react-native-paper';
import AuthenticatedStack from './Navigations/AuthenticatedStack';
import { SignupProvider } from './Context/SignupContext';
import { ChatProvider } from './Context/ChatContext';
import { SwipeProvider } from './Context/SwipeContext';
import { requestNotificationPermission, requestUserPermission, createNotificationChannel, notificationListener } from './firebase/firebase'
import { ToastAndroid } from 'react-native';
import { navigationRef } from './Navigations/NavigationService';
import AdminStack from './Navigations/AdminStack';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <SignupProvider>
        <SwipeProvider>
          <PaperProvider>
            <NavigationContainer ref={navigationRef}>
              <ChatProvider>
                <AuthenticatedApp />
              </ChatProvider>
            </NavigationContainer>
          </PaperProvider>
        </SwipeProvider>
      </SignupProvider>
    </AuthProvider>
  );
};

const AuthenticatedApp = () => {
  const { isAuthenticated,accountType } = useAuth();

  useEffect(() => {
    let cleanup = null;

    const setup = async () => {
      if (isAuthenticated) {
        try {
          await requestNotificationPermission();
          await createNotificationChannel();
          await requestUserPermission();
          // Store the cleanup function
          cleanup = notificationListener();
        } catch (error) {
          ToastAndroid.showWithGravityAndOffset(
            error.message || "Something Went Wrong",
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
          );
        }
      }
    };

    setup();
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [isAuthenticated]);

  return isAuthenticated && accountType === 'Admin' ? 
  (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Admin" component={AdminStack} />
    </Stack.Navigator>
  ) : isAuthenticated && accountType === 'User' ? (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Authenticated" component={AuthenticatedStack} />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={AuthStack} />
    </Stack.Navigator>
  )
};

export default App;
