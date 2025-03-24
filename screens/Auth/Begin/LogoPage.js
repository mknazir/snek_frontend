//import liraries
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Color } from '../../../GlobalStyle';

 
const LogoPage = () => {
    const navigation = useNavigation();
    const scaleAnim = useRef(new Animated.Value(1)).current; 

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.2,  
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,  
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
 
        const timeoutId = setTimeout(() => {
            navigation.navigate('Begining');  
        }, 3000);

        return () => clearTimeout(timeoutId); 
    }, [navigation, scaleAnim]);

    return (
        <View style={styles.container}>
            <Animated.View style={{ height: '40%', justifyContent: 'center', alignItems: 'center', width: '60%', transform: [{ scale: scaleAnim }] }}>
                <Image 
                    source={require('../../../assets/Images/authicon1.png')} 
                    style={styles.image}
                />
            </Animated.View>
        </View>
    );
};
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Color.cyan2,
    },
    image: {
        width: "50%",
        height: "50%",  
        resizeMode: 'contain',
    },
});

 
export default LogoPage;
