//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions,Image, TouchableOpacity } from 'react-native';
import { Color, FontFamily } from '../../../GlobalStyle';
import { useNavigation } from '@react-navigation/native';

// create a component
const Options = () => {
    const navigation = useNavigation(); 

    return (
        <View style={styles.container}>
            <View style={{height:'40%',justifyContent:'center',alignItems:'center',width:'60%'}}>
                <Image 
                        source={require('../../../assets/Images/authicon2.png')} 
                        style={styles.image}
                />
            </View>

        <View style={{height:'20%',width:'100%',alignItems:'center',justifyContent:'center'}}>

        </View>

        <View style={{height:'15%',width:'100%',alignItems:'center',justifyContent:'space-between'}}>
        <TouchableOpacity  onPress={() => navigation.navigate('Login')}  style={{height:'40%',width:'80%',borderRadius:50,backgroundColor:Color.cyan1,alignItems:'center',justifyContent:'center'}}>
            <Text style={{color: 'white',fontFamily: FontFamily.nunitoRegular,fontSize:20}}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignupStack')} style={{height:'40%',width:'80%',borderRadius:50,backgroundColor:'white',alignItems:'center',justifyContent:'center',borderColor:'#263238',borderWidth:2}}>
            <Text style={{color: '#263238',fontFamily: FontFamily.nunitoRegular,fontSize:20}}>Register</Text>
        </TouchableOpacity>
        </View>
        </View>
    );
};

const { width, height } = Dimensions.get('window');
// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        width: width ,
        height: height,
    },
    image: {
        width: '100%',  
        height: '100%',  
        resizeMode: 'contain',  
    },
});
 
export default Options;
