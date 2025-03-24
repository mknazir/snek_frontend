import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput, ToastAndroid,ActivityIndicator } from 'react-native';
import { BackIcon } from '../../../assets/AuthIcons';
import { Color, FontFamily } from '../../../GlobalStyle';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BASE_URL } from '../../../Components/constant/Url';

const Otp = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { email } = route.params;

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [focusedInput, setFocusedInput] = useState(null);
    const [loading, setLoading] = useState(false);
    const inputs = useRef([]);

    const handleInputChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text && index < 5) {
            inputs.current[index + 1].focus();
        }
    };

    const handleBackspace = (text, index) => {
        if (text === '' && index > 0) {
            inputs.current[index - 1].focus();
            const newOtp = [...otp];
            newOtp[index - 1] = '';
            setOtp(newOtp);
        }
    };

    const handleVerify = async () => {
        const otpCode = otp.join("");
        if (!otpCode || otpCode.length !== 6) {
            ToastAndroid.show("Please enter a valid 6-digit OTP", ToastAndroid.SHORT);
            return;
        }

        setLoading(true); 

        try {
            const response = await fetch(`${BASE_URL}/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: otpCode }),
            });
            const resData = await response.json();

            if (response.ok) {
                ToastAndroid.show(resData.message, ToastAndroid.SHORT);
                navigation.navigate("RenewPassword", { email });
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
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                    <BackIcon style={{ transform: [{ scale: 1.4 }] }} />
                </TouchableOpacity>
            </View>

            <View style={{ width: '100%', height: '8%', justifyContent: 'space-between', paddingHorizontal: '3%' }}>
                <Text style={styles.labelText}>OTP Verification</Text>
                <Text style={styles.paraText}>It is a long established fact that a reader distracted</Text>
            </View>

            <View style={styles.inputWrapper}>
                <Text style={styles.labelText}>Enter your Otp</Text>
                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={ref => inputs.current[index] = ref}
                            style={[
                                styles.input,
                                { borderColor: focusedInput === index ? '#528E8E' : '#D0E7E7' }
                            ]}
                            value={digit}
                            keyboardType="numeric"
                            maxLength={1}
                            onFocus={() => setFocusedInput(index)}
                            onBlur={() => setFocusedInput(null)}
                            onChangeText={text => handleInputChange(text, index)}
                            onKeyPress={({ nativeEvent }) => {
                                if (nativeEvent.key === 'Backspace') {
                                    handleBackspace(digit, index);
                                }
                            }}
                            autoFocus={index === 0}
                        />
                    ))}
                </View>
            </View>

            <View style={{ height: '5%', justifyContent: 'center', width: '100%', alignItems: 'center', flexDirection: 'row' }}>
                <TouchableOpacity onPress={handleVerify} style={{ height: '100%', width: '95%', borderRadius: 50, backgroundColor: Color.cyan1, alignItems: 'center', justifyContent: 'center' }}>
                    {loading ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Text style={{ color: 'white', fontFamily: FontFamily.nunitoRegular, fontSize: 20 }}>Verify</Text>
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
        height: '15%',
        justifyContent: 'center',
    },
    input: {
        height: '80%',
        borderRadius: 10,
        borderColor: '#D0E7E7',
        borderWidth: 1.5,
        paddingHorizontal: 10,
        fontFamily: FontFamily.nunitoRegular,
        fontSize: 16,
        backgroundColor: '#D0E7E7',
        width: '10%',
        color: 'black'
    },
    otpContainer: {
        width: '100%',
        height: '50%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
});

export default Otp;
