import { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ToastAndroid, ScrollView, ActivityIndicator } from 'react-native';
import { FontFamily, Color } from '../../../GlobalStyle';
import { EyeIcon, EyeOffIcon } from '../../../assets/AuthIcons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../Context/AuthContext';
import { styles } from '../Styles'

const Login = () => {
  const navigation = useNavigation();
  const { login } = useAuth()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOnClick = async () => {
    if (!email || !password) {
      ToastAndroid.showWithGravityAndOffset('All Fields are Required', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
      return;
    }

    setLoading(true); // Set loading state to true
    try {
      await login(email, password);
    } catch (error) {
      ToastAndroid.showWithGravityAndOffset('Login Failed', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
    } finally {
      setLoading(false); // Set loading state back to false after login
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require('../../../assets/Images/authicon1.png')} style={styles.image} />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.labelText}>Email</Text>
            <TextInput style={styles.input}
              onChangeText={setEmail}
              value={email}
              autoComplete="email"
              textContentType="emailAddress"
              keyboardType="email-address" />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.labelText}>Password</Text>
            <View style={{ height: 50, borderRadius: 10, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
              <TextInput 
                style={[styles.input, { width: '100%' }]}
                secureTextEntry={!isPasswordVisible}
                onChangeText={setPassword}
                value={password}
                autoComplete="password"
                textContentType="password" />
              <TouchableOpacity onPress={togglePasswordVisibility} style={{ marginLeft: '-10%' }}>
                {/* Toggle between EyeIcon and EyeOffIcon */}
                {isPasswordVisible ? (
                  <EyeOffIcon style={{ transform: [{ scale: 1.4 }] }} />
                ) : (
                  <EyeIcon style={{ transform: [{ scale: 1.4 }] }} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ height: '10%', justifyContent: 'center', width: '100%', alignItems: 'flex-end' }}>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassStack')}>
            <Text style={{ color: '#8B9898', fontFamily: FontFamily.nunitoRegular, fontSize: 15, paddingHorizontal: '7%' }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: '15%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={handleOnClick}
            disabled={loading}
            style={{ height: '40%', width: '90%', borderRadius: 50, backgroundColor: Color.cyan1, alignItems: 'center', justifyContent: 'center' }}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text
                style={{
                  color: 'white',
                  fontFamily: FontFamily.nunitoRegular,
                  fontSize: 20,
                }}
              >
                Log In
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ height: '5%', justifyContent: 'center', width: '100%', alignItems: 'center', flexDirection: 'row' }}>
          <Text style={{ color: '#1E232C', fontFamily: FontFamily.nunitoRegular, fontSize: 15 }}> Register Your account ? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignupStack')}>
            <Text style={{ color: Color.cyan2, fontFamily: FontFamily.nunitoRegular, fontSize: 15 }}> Sign Up Now </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Login;