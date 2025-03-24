import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput, ToastAndroid,ActivityIndicator } from 'react-native';
import { BackIcon } from '../../../assets/AuthIcons';
import { Color, FontFamily } from '../../../GlobalStyle';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../../Components/constant/Url';

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {

    if (!email) {
      ToastAndroid.show("Please enter your email", ToastAndroid.SHORT);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/generate-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const resData = await response.json();

      if (response.ok) {
        ToastAndroid.show(resData.message, ToastAndroid.SHORT);
        navigation.navigate("Otp", { email });
      } else {
        ToastAndroid.show(resData.error, ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }finally {
      setLoading(false); 
    }
  };


  return (
    <View style={styles.container}>
      <View style={{ height: '10%', width: '100%', justifyContent: 'center', marginLeft: '8%' }}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <BackIcon style={{ transform: [{ scale: 1.4 }] }} />
        </TouchableOpacity>
      </View>

      <View style={{ width: '100%', height: '8%', justifyContent: 'space-between', paddingHorizontal: '3%' }}>
        <Text style={styles.labelText}>Forget Password?</Text>
        <Text style={styles.paraText}>It is a long established fact that a reader distracted</Text>
      </View>


      <View style={styles.inputWrapper}>
        <Text style={styles.labelText}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="abc123@gmail.com"
          placeholderTextColor="#6A707C"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>


      <View style={{ height: '5%', justifyContent: 'center', width: '100%', alignItems: 'center', flexDirection: 'row' }}>
        <TouchableOpacity onPress={handleSendCode} style={{ height: '100%', width: '95%', borderRadius: 50, backgroundColor: Color.cyan1, alignItems: 'center', justifyContent: 'center' }}>
          
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={{ color: 'white', fontFamily: FontFamily.nunitoRegular, fontSize: 20 }}>Send Code</Text>
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
    width: '100%',
    height: '100%',
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
    height: '15%',
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
    color: 'black'
  },
});

//make this component available to the app
export default ForgotPassword;
