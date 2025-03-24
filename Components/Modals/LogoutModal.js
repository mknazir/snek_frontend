import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { FontFamily } from '../../GlobalStyle';
import { useAuth } from '../../Context/AuthContext';

const LogoutModal = ({ isVisible, toggleModal }) => {
    const { logout, isLoading } = useAuth();  

    const handleLogout = async () => {
        toggleModal();  
        await logout(); 
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
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#7355A8" />
                            <Text style={styles.loadingText}>Logging Out...</Text>
                        </View>
                    ) : (
                        <>
                            <Text style={styles.heading}>Logout</Text>
                            <View style={{ width: '100%', height: 1, backgroundColor: '#7355A8' }}></View>
                            <Text style={styles.subHeading}>
                                Are you sure you want to logout?
                            </Text>

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity onPress={toggleModal} style={styles.noButton}>
                                    <Text style={styles.noText}>NO</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleLogout} style={styles.yesButton}>
                                    <Text style={styles.yesText}>YES</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    noButton: {
        backgroundColor: '#E5E7EB',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginRight: 10,
        borderRadius: 20,
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    yesButton: {
        backgroundColor: '#DD453A',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    noText: {
        color: 'black',
        fontSize: 16,
        fontFamily: FontFamily.nunitoSemiBold,
    },
    yesText: {
        color: 'white',
        fontSize: 16,
        fontFamily: FontFamily.nunitoSemiBold,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#6B7280',
        fontFamily: FontFamily.nunitoRegular,
    },
});

export default LogoutModal;
