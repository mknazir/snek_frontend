//import liraries
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Color, FontFamily } from '../../GlobalStyle';
import { useAuth } from '../../Context/AuthContext';

// create a component
const AdminDashboard = () => {
    const navigation = useNavigation();
    const { logout } = useAuth()
    return (
        <View style={styles.container}>
            <Text style={{ fontFamily: FontFamily.nunitoBold, color: 'black', fontSize: 25 }}>Admin Dashboard</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('CreateHobby')}
            >
                <Text style={styles.buttonText}>Hobby Control</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('PendingAcc')}
            >
                <Text style={styles.buttonText}>Accounts Control</Text>
            </TouchableOpacity >
            <TouchableOpacity style={styles.button} onPress={logout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: '80%',
        padding: 20,
        backgroundColor: Color.cyan1,
        borderRadius: 10,
        marginVertical: 10,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontFamily: FontFamily.nunitoBold
    },
});

//make this component available to the app
export default AdminDashboard;
