import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '../screens/Profile/Profile';
import Settings from '../screens/Profile/Settings/Settings';
import Help from '../screens/Profile/Settings/Help';
import Privacy from '../screens/Profile/Settings/Privacy';
import Terms from '../screens/Profile/Settings/Terms';
import BlockAcc from '../screens/Profile/Settings/BlockAcc';
import AdminStack from './AdminStack';

const ChatStack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <ChatStack.Navigator screenOptions={{ headerShown: false }}>
      <ChatStack.Screen name="Profile" component={Profile} />
      <ChatStack.Screen name="Settings" component={Settings} />
      <ChatStack.Screen name="BlockedUsers" component={BlockAcc} />
      <ChatStack.Screen name="HelpSupport" component={Help} />
      <ChatStack.Screen name="PrivacyPolicy" component={Privacy} />
      <ChatStack.Screen name="TermsCondition" component={Terms} />
      <ChatStack.Screen name="Admin" component={AdminStack} />
    </ChatStack.Navigator>
  );
};

export default ProfileStack;
