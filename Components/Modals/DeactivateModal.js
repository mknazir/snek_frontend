import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ToastAndroid } from 'react-native';
import { FontFamily } from '../../GlobalStyle';
import { useAuth } from '../../Context/AuthContext';
import { BASE_URL } from '../constant/Url';

const DeactivateModal = ({ isVisible, toggleModal }) => {

    const { userDetails, fetchUserDetails, logout } = useAuth();

    const handleDeactivateAccount = async () => {
        const userId = userDetails?._id;
        if (!userId) {
            ToastAndroid.show("User ID not found. Please try again.", ToastAndroid.SHORT);
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/deactivate/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                ToastAndroid.show("Your account has been deactivated.", ToastAndroid.SHORT);
                await logout();
                toggleModal();
                // fetchUserDetails();
            } else {
                ToastAndroid.show(data.message || "Unable to deactivate account.", ToastAndroid.LONG);
            }
        } catch (error) {
            ToastAndroid.show("Something went wrong. Please try again later.", ToastAndroid.LONG);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={toggleModal}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>

                    <Text style={[styles.heading]}>Deactivate Profile</Text>



                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={handleDeactivateAccount} style={styles.noButton}>

                            <Text style={[styles.noText]}>Deactivate Profile</Text>

                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            // Add your logout logic here
                            toggleModal();
                        }} style={styles.yesButton}>
                            <Text style={styles.yesText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    heading: {
        fontSize: 20,
        fontFamily: FontFamily.nunitoSemiBold,
        marginBottom: 10,
        color: 'black',
    },
    subHeading: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 20,
        fontFamily: FontFamily.nunitoRegular,
    },
    buttonContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
    },
    noButton: {
        backgroundColor: '#66B2B2',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginRight: 10,
        borderRadius: 20,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    yesButton: {
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'black',
        borderWidth: 1,
        marginTop: '3%'
    },
    noText: {
        color: 'white',
        fontSize: 16,
        fontFamily: FontFamily.nunitoSemiBold,
    },
    yesText: {
        color: 'black',
        fontSize: 16,
        fontFamily: FontFamily.nunitoSemiBold,
    },
});

export default DeactivateModal;
