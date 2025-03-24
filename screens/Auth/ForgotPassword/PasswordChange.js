import React, { Component } from 'react';
import { View, Text, StyleSheet,Dimensions,TouchableOpacity,TextInput,Image } from 'react-native';
import { BackIcon } from '../../../assets/AuthIcons';
import { Color, FontFamily } from '../../../GlobalStyle';
import { useNavigation } from '@react-navigation/native';
 
const PasswordChange = () => {
    const navigation = useNavigation(); 


    return (
        <View style={styles.container}>
            <View style={{height:'10%',width:'100%',justifyContent:'center',marginLeft:'8%'}}>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <BackIcon style={{ transform: [{ scale: 1.4 }]}}/>
                </TouchableOpacity>
            </View>

            <View style={{height:'70%',width:'100%',justifyContent:'center',alignItems:'center'}}>
            <View style={styles.logoContainer}>
                <Image 
                    source={require('../../../assets/Images/PassChange.png')} 
                    style={styles.image}
                />
            </View>

            <View style={{width:'100%',height:'15%',justifyContent:'space-between',paddingHorizontal:'3%',alignItems:'center',marginBottom:'1%'}}>
                <Text style={styles.labelText}>Password Changed!</Text>
                <View style={{width:'60%',height:'50%',alignItems:'center',justifyContent:'center'}}>
                <Text style={styles.paraText}>Your password has been changed successfully.</Text>
                </View>
            </View>

            <View style={{height:'20%',justifyContent:'center',width:'100%',alignItems:'center',flexDirection:'row',justifyContent:'center'}}>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}  style={{height:'45%',width:'95%',borderRadius:50,backgroundColor:Color.cyan1,alignItems:'center',justifyContent:'center'}}>
                    <Text style={{color: 'white',fontFamily: FontFamily.nunitoRegular,fontSize:20}}>Back to Login</Text>
                </TouchableOpacity>
            </View>
            </View>


        </View>
    );
};
 
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        width: width,
        height: height,
    },
    labelText: {
        color: '#4E4559',
        fontFamily: FontFamily.nunitoBold,
        fontSize: 30,
    },
    paraText:{
        color: '#717171',
        fontFamily: FontFamily.nunitoSemiBold,
        fontSize: 20,
    },
    logoContainer: {
        height: '20%',
        justifyContent: 'center',
        alignItems: 'center',
        width: '60%',
        margin:'3%'
    },
    image: {
        width: '100%',  
        height: '100%',  
        resizeMode: 'contain',
    },
});

//make this component available to the app
export default PasswordChange;
