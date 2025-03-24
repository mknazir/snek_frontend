import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AdminDashboard from '../screens/Admin/Index';
import CreateHobby from '../screens/Admin/CreateHobby';
import PendingAcc from '../screens/Admin/PendingAcc';
import AccDetails from '../screens/Admin/AccDetails';
 

const AdminDashStack = createNativeStackNavigator();

const AdminStack = () => {
  return (
    <AdminDashStack.Navigator screenOptions={{headerShown: false}}>
      <AdminDashStack.Screen name="AdminDashboard" component={AdminDashboard} />
      <AdminDashStack.Screen name="CreateHobby" component={CreateHobby} />
      <AdminDashStack.Screen name="PendingAcc" component={PendingAcc} />
      <AdminDashStack.Screen name="AccDetails" component={AccDetails} />
    </AdminDashStack.Navigator>
  );
};

export default AdminStack;
