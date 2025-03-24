import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastAndroid } from 'react-native';
import { BASE_URL } from '../Components/constant/Url';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null)
  const [accountType, setAccountType] = useState(null)

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const token = await AsyncStorage.getItem('loginToken');
        const userId = await AsyncStorage.getItem('userId');
        const adminId = await AsyncStorage.getItem('adminId');
        const accountType = await AsyncStorage.getItem('accountType');
        setIsAuthenticated(!!token);

        if (accountType === "Admin") {
          setAccountType("Admin");
          if (token && adminId) {
            await verifyToken(token, adminId);
          }
        } else if (accountType === "User") {
          setAccountType("User");
          if (token && userId) {
            await verifyToken(token, userId);
            await fetchUserDetails(token);
          }
        }
      } catch (error) {
        ToastAndroid.showWithGravityAndOffset(error.message, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const authenticate = status => {
    setIsAuthenticated(status);
  };

  const verifyToken = async (token, userId) => {
    try {
      await fetch(`${BASE_URL}/user/verify/${userId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(res => {
          if (res.authenticated === true) {
            authenticate(true);
          } else {
            ToastAndroid.showWithGravityAndOffset('Not Authenticated', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            logout();
          }
        });
    } catch (error) {
      ToastAndroid.showWithGravityAndOffset('Not Authenticated', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
      logout();
      authenticate(false);
    }
  };

  const fetchUserDetails = async (token) => {
    let userId = await AsyncStorage.getItem("userId")
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/user-details/${userId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (response.ok) {
        setUserDetails(data.data);
      } else {
        ToastAndroid.showWithGravityAndOffset(data.error || 'Failed to fetch user details', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
      }
    } catch (error) {
      ToastAndroid.showWithGravityAndOffset(error.message || 'Network Error', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      await fetch(`${BASE_URL}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })
        .then(res => res.json())
        .then(async res => {
          if (res.error) {
            setIsLoading(false);
            ToastAndroid.showWithGravityAndOffset(res.error || 'Something went wrong', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            return;
          }

          if (res.token) {
            if(res.accountType === "Admin") {
              setAccountType("Admin");
              await AsyncStorage.setItem('loginToken', res.token);
              await AsyncStorage.setItem('adminId', res.user._id);
              await AsyncStorage.setItem('accountType', "Admin");
            } else if (res.accountType === "User") {
              setAccountType("User");
              await AsyncStorage.setItem('loginToken', res.token);
              await AsyncStorage.setItem('userId', res.user._id);
              await AsyncStorage.setItem('accountType', "User");
              await fetchUserDetails(res.user._id, res.token);
            }
            ToastAndroid.showWithGravityAndOffset('LoggedIn, Redirecting', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
          }
        });
    } catch (error) {
      setIsLoading(false);
      ToastAndroid.showWithGravityAndOffset(error.message || 'Network Error', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem('loginToken');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('adminId');
      await AsyncStorage.removeItem('accountType');
      setIsAuthenticated(false);
      setUserDetails(null);
      ToastAndroid.showWithGravityAndOffset('Logged out successfully', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
    } catch (error) {
      ToastAndroid.showWithGravityAndOffset(error.message, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authenticate,
        isLoading,
        logout,
        login,
        userDetails,
        fetchUserDetails,
        accountType
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);