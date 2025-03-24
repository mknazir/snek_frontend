import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatDetailsScreen from '../screens/Chat/ChatDetailsScreen';
import Chat from '../screens/Chat/Chat';
import Report from '../screens/Chat/Report';

const ChatStack = createNativeStackNavigator();

const ChatStackScreen = () => {
  return (
    <ChatStack.Navigator screenOptions={{ headerShown: false }}>
      <ChatStack.Screen name="Chat" component={Chat} />
      <ChatStack.Screen name="ChatDetails" component={ChatDetailsScreen} />
      <ChatStack.Screen name="Report" component={Report} />
    </ChatStack.Navigator>
  );
};

export default ChatStackScreen;
