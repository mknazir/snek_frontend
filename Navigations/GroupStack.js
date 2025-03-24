import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Group from '../screens/Group/Group';
import CreateGroup from '../screens/Group/CreateGroup';

const ChatStack = createNativeStackNavigator();

const GroupStack = () => {
  return (
    <ChatStack.Navigator screenOptions={{ headerShown: false }}>
      <ChatStack.Screen name="Group" component={Group} />
      <ChatStack.Screen name="CreateGroup" component={CreateGroup} />
    </ChatStack.Navigator>
  );
};

export default GroupStack;
