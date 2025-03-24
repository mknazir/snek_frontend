import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput, ToastAndroid,ActivityIndicator } from 'react-native';
import { BackIcon, EyeIcon, EyeOffIcon } from '../../../assets/AuthIcons';
import { Color, FontFamily } from '../../../GlobalStyle';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BASE_URL } from '../../../Components/constant/Url';

const RenewPassword = () => {
  const navigation = useNavigation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisibleNew, setIsPasswordVisibleNew] = useState(false);
  const [isPasswordVisibleConfirm, setIsPasswordVisibleConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const route = useRoute();

  const { email } = route.params;
    // If email is missing, redirect back to OTP screen
    useEffect(() => {
      if (!email) {
        navigation.replace("Otp");
      }
    }, [email]);

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      ToastAndroid.show('Please fill out all fields', ToastAndroid.SHORT);
      return;
    }

    if (newPassword !== confirmPassword) {
      ToastAndroid.show('Passwords do not match', ToastAndroid.SHORT);
      return;
    }

    setLoading(true);
  
    try {
      const response = await fetch(`${BASE_URL}/update-password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: newPassword }),
      });
      const resData = await response.json();

      if (response.ok) {
        ToastAndroid.show(resData.message, ToastAndroid.SHORT);
        navigation.navigate('PasswordChangeSuccessful')
      } else {
        ToastAndroid.show(resData.error, ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }finally {
      setLoading(false);  
    }

  };


  // Toggle password visibility
  const togglePasswordVisibilityNew = () => {
    setIsPasswordVisibleNew(!isPasswordVisibleNew);
  };

  const togglePasswordVisibilityConfirm = () => {
    setIsPasswordVisibleConfirm(!isPasswordVisibleConfirm);
  };


  return (
    <View style={styles.container}>
      <View style={{ height: '10%', width: '100%', justifyContent: 'center', marginLeft: '8%' }}>
        <TouchableOpacity onPress={() => navigation.navigate('Otp')}>
          <BackIcon style={{ transform: [{ scale: 1.4 }] }} />
        </TouchableOpacity>
      </View>

      <View style={{ width: '100%', height: '8%', justifyContent: 'space-between', paddingHorizontal: '3%' }}>
        <Text style={styles.labelText}>Create New Password</Text>
        <Text style={styles.paraText}>It is a long established fact that a reader distracted</Text>
      </View>


      <View style={styles.inputWrapper}>
        <Text style={styles.labelText}>New Password</Text>
        <View style={{ height: 50, borderRadius: 10, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            style={[styles.input, { width: '100%' }]}
            placeholder="New Password"
            placeholderTextColor="#6A707C"
            secureTextEntry={!isPasswordVisibleNew}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity onPress={togglePasswordVisibilityNew} style={{ marginLeft: '-10%' }}>
            {/* Toggle between EyeIcon and EyeOffIcon */}
            {isPasswordVisibleNew ? (
              <EyeOffIcon style={{ transform: [{ scale: 1.4 }], marginLeft: '-5%' }} />
            ) : (
              <EyeIcon style={{ transform: [{ scale: 1.4 }], marginLeft: '-5%' }} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.labelText}>Confirm Password</Text>
        <View style={{ height: 50, borderRadius: 10, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            style={[styles.input, { width: '100%' }]}
            placeholder="Confirm Password"
            placeholderTextColor="#6A707C"
            secureTextEntry={!isPasswordVisibleConfirm}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={togglePasswordVisibilityConfirm} style={{ marginLeft: '-10%' }}>
            {/* Toggle between EyeIcon and EyeOffIcon */}
            {isPasswordVisibleConfirm ? (
              <EyeOffIcon style={{ transform: [{ scale: 1.4 }], marginLeft: '-5%' }} />
            ) : (
              <EyeIcon style={{ transform: [{ scale: 1.4 }], marginLeft: '-5%' }} />
            )}
          </TouchableOpacity>
        </View>


      </View>


      <View style={{ height: '5%', justifyContent: 'center', width: '100%', alignItems: 'center', flexDirection: 'row' }}>
        <TouchableOpacity onPress={handleUpdatePassword} style={{ height: '100%', width: '95%', borderRadius: 50, backgroundColor: Color.cyan1, alignItems: 'center', justifyContent: 'center' }}>
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={{ color: 'white', fontFamily: FontFamily.nunitoRegular, fontSize: 20 }}>Reset Password</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={{ height: '60%', width: '100%' }}></View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: width,
    height: height,
  },
  labelText: {
    color: '#4E4559',
    fontFamily: FontFamily.nunitoSemiBold,
    fontSize: 25,
  },
  paraText: {
    color: '#717171',
    fontFamily: FontFamily.nunitoSemiBold,
    fontSize: 20,
  },
  inputWrapper: {
    width: '95%',
    height: '10%',
    justifyContent: 'center',
  },
  input: {
    height: 50,
    borderRadius: 10,
    borderColor: '#D0E5E5',
    borderWidth: 1,
    paddingHorizontal: 10,
    fontFamily: FontFamily.nunitoRegular,
    fontSize: 16,
    backgroundColor: 'white',
    width: '100%',
    color: 'black',
  },
});

//make this component available to the app
export default RenewPassword;
