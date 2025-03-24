import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LogoPage from '../screens/Auth/Begin/LogoPage';
import Login from '../screens/Auth/Login/Login';
import Begining from '../screens/Auth/Begin/Begining';
import Options from '../screens/Auth/Begin/Options';
import SignupForm from '../screens/Auth/Signup/SignupForm';
import Hobby from '../screens/Auth/Signup/Hobby';
import PersonalDetails from '../screens/Auth/Signup/PersonalDetails';
import AppSubmit from '../screens/Auth/Signup/AppSubmit';
import ForgotPassword from '../screens/Auth/ForgotPassword/ForgotPassword';
import Otp from '../screens/Auth/ForgotPassword/Otp';
import RenewPassword from '../screens/Auth/ForgotPassword/RenewPassword';
import PasswordChange from '../screens/Auth/ForgotPassword/PasswordChange';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Logo" component={LogoPage} />
      <Stack.Screen name="Begining" component={Begining} />
      <Stack.Screen name="Options" component={Options} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignupStack" component={SignupStack} />
      <Stack.Screen name="ForgotPassStack" component={ForgotPassStack} />
    </Stack.Navigator>
  );
};

const SignupStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="SignupForm" component={SignupForm} />
      <Stack.Screen name="Hobby" component={Hobby} />
      <Stack.Screen name="PersonalDetails" component={PersonalDetails} />
      <Stack.Screen name="AppSubmit" component={AppSubmit} />
    </Stack.Navigator>
  );
};

const ForgotPassStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="Otp" component={Otp} />
      <Stack.Screen name="RenewPassword" component={RenewPassword} />
      <Stack.Screen name="PasswordChangeSuccessful" component={PasswordChange} />
    </Stack.Navigator>
  );
};

export default AuthStack;
