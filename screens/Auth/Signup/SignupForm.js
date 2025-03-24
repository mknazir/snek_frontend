import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ToastAndroid, ScrollView, ActivityIndicator } from 'react-native';
import { FontFamily, Color } from '../../../GlobalStyle';
import { EyeIcon, EyeOffIcon } from '../../../assets/AuthIcons';
import { useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import { useSignupContext } from '../../../Context/SignupContext';
import { OtpInput } from "react-native-otp-entry";
import { BASE_URL } from '../../../Components/constant/Url';
import { styles } from '../Styles';

const SignupForm = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [gender, setGender] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const { updateSignupData, signupData } = useSignupContext();
  const [loading, setLoading] = useState(false); // Add loading state


  const handleOnClick = async () => {
    if (!name || !email || !mobile || !password || !gender) {
      ToastAndroid.showWithGravityAndOffset("All Fields are Required", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
      return;
    }

    if (mobile.length !== 10) {
      ToastAndroid.showWithGravityAndOffset("Mobile number must be exactly 10 digits", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
      return;
    }

    if (!emailVerified) {
      ToastAndroid.showWithGravityAndOffset("Please verify your email before proceeding", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 5);
      return;
    }

    updateSignupData('name', name);
    updateSignupData('email', email);
    updateSignupData('phone', mobile);
    updateSignupData('password', password);
    updateSignupData('gender', gender);
    navigation.navigate('Hobby');
  };

  const handleVerifyEmail = async () => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      ToastAndroid.showWithGravityAndOffset("Email is required to generate OTP", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 5);
      return;
    }

    if (!emailRegex.test(email)) {
      ToastAndroid.showWithGravityAndOffset("Please enter a valid email address", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 5);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/auth/generate-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsOtpVisible(true);
        ToastAndroid.showWithGravityAndOffset("OTP sent to your email", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 5);
      } else {
        ToastAndroid.showWithGravityAndOffset(data.error || "Failed to send OTP", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 5);
      }
    } catch (error) {
      ToastAndroid.showWithGravityAndOffset("An error occurred while sending OTP", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 5);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otp) => {
    if (!email || !otp) {
      ToastAndroid.showWithGravityAndOffset("Email and OTP are required for verification", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 5);
      return;
    }

    try {
      // Ensure OTP is serialized properly
      const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: String(otp) }), // Convert OTP to a string
      });

      const data = await response.json();

      if (response.ok) {
        setIsOtpVisible(false);
        setEmailVerified(true);
        ToastAndroid.showWithGravityAndOffset("OTP Verified Successfully", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 5);
      } else {
        ToastAndroid.showWithGravityAndOffset(data.error || "Invalid OTP", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 5);
      }
    } catch (error) {
      ToastAndroid.showWithGravityAndOffset("An error occurred while verifying OTP", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 5);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const data = [
    { label: 'Male', value: '1' },
    { label: 'Female', value: '2' },
    { label: 'Others', value: '3' },
  ];

  return (
    <ScrollView style={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <View style={styles.signUpFormContainer}>
        <View style={styles.signUpLogoContainer}>
          <Image source={require('../../../assets/Images/authicon1.png')} style={styles.signUpImage} />
        </View>

        <View style={styles.signUpInputContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.labelText}>Full Name*</Text>
            <TextInput style={styles.input} placeholder="Name" placeholderTextColor="#6A707C" onChangeText={setName} value={name} />
          </View>

          <View style={styles.inputWrapper}>
            <View style={{ width: '100%', height: 'auto', justifyContent: 'space-between', flexDirection: 'row' }}>
              <Text style={styles.labelText}>Email*</Text>
              <TouchableOpacity onPress={handleVerifyEmail} disabled={emailVerified}>
                <Text style={[styles.labelText, { color: 'blue', textDecorationLine: 'underline', fontSize: 15 }, emailVerified && { color: 'green' }]}>
                  {emailVerified ? 'Verified' : 'Verify Email'}
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput style={styles.input} placeholder="abc@gmail.com" placeholderTextColor="#6A707C" onChangeText={setEmail} value={email} />
          </View>

          {loading ? (
            // Show Activity Indicator when loading
            <ActivityIndicator size="large" color={Color.cyan1} />) : isOtpVisible ?
            (
              // Show OTP Input only when OTP is visible
              <View style={styles.inputWrapper}>
                <View style={{ width: '100%', height: 'auto', justifyContent: 'space-between', flexDirection: 'row' }}>
                  <Text style={styles.labelText}>Otp*</Text>
                  <TouchableOpacity onPress={handleVerifyOtp}>
                    <Text style={[styles.labelText, { color: 'blue', textDecorationLine: 'underline', fontSize: 15 }]}>
                      Verify Otp
                    </Text>
                  </TouchableOpacity>
                </View>
                <OtpInput
                  numberOfDigits={6}
                  focusColor="Color.cyan1"
                  autoFocus={false}
                  hideStick={true}
                  placeholder="-----"
                  blurOnFilled={true}
                  disabled={false}
                  type="numeric"
                  secureTextEntry={false}
                  focusStickBlinkingDuration={500}
                  onFilled={(otp) => handleVerifyOtp(otp.trim())}
                  theme={{
                    containerStyle: styles.otpContainer,
                    pinCodeContainerStyle: styles.pinCodeContainer,
                    pinCodeTextStyle: styles.pinCodeText,
                    focusStickStyle: styles.focusStick,
                    focusedPinCodeContainerStyle: styles.activePinCodeContainer,
                    placeholderTextStyle: styles.placeholderText,
                    filledPinCodeContainerStyle: styles.filledPinCodeContainer,
                    disabledPinCodeContainerStyle: styles.disabledPinCodeContainer,
                  }}
                />
              </View>
            ) : null}

          <View style={styles.inputWrapper}>
            <Text style={styles.labelText}>Mobile No*</Text>
            <TextInput
              style={styles.input}
              placeholder="1234567890"
              placeholderTextColor="#6A707C"
              onChangeText={(text) => {
                const formattedText = text.replace(/[^0-9]/g, '').slice(0, 10);
                setMobile(formattedText);
              }}
              value={mobile}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.labelText}>Password*</Text>
            <View
              style={{
                height: 50,
                borderRadius: 10,
                backgroundColor: 'white',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TextInput
                style={[styles.input, { width: '100%' }]}
                placeholder="********"
                placeholderTextColor="#6A707C"
                secureTextEntry={!isPasswordVisible}
                onChangeText={setPassword}
                value={password}
              />
              <TouchableOpacity
                onPress={togglePasswordVisibility}
                style={{ marginLeft: '-10%' }}>
                {isPasswordVisible ? (
                  <EyeOffIcon style={{ transform: [{ scale: 1.4 }] }} />
                ) : (
                  <EyeIcon style={{ transform: [{ scale: 1.4 }] }} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.labelText}>Gender*</Text>
            <Dropdown
              style={[styles.dropdown,{borderColor: '#D0E5E5',padding: 10,}]}
              placeholderStyle={styles.signupPlaceholderStyle}
              selectedTextStyle={styles.signUpSelectedTextStyle}
              inputSearchStyle={styles.signUpInputSearchStyle}
              iconStyle={styles.iconStyle}
              data={data}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Gender"
              value={signupData.gender}
              onChange={item => {
                updateSignupData('gender', item.value);
                setGender(item.value);
              }}
              renderItem={item => (
                <View style={{ padding: 10 }}>
                  <Text style={[styles.selectedTextStyle]}>{item.label}</Text>
                </View>
              )}
            />
          </View>
        </View>

        <View
          style={{
            marginTop: '20%',
            height: '15%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={handleOnClick}
            style={{
              height: '40%',
              width: '90%',
              borderRadius: 50,
              backgroundColor: Color.cyan1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                fontFamily: FontFamily.nunitoRegular,
                fontSize: 20,
              }}>
              {' '}
              Next{' '}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            height: '5%',
            justifyContent: 'center',
            width: '100%',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              color: '#1E232C',
              fontFamily: FontFamily.nunitoRegular,
              fontSize: 15,
            }}>
            {' '}
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text
              style={{
                color: Color.cyan2,
                fontFamily: FontFamily.nunitoRegular,
                fontSize: 15,
              }}>
              {' '}
              Login Now{' '}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignupForm;