import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { FontFamily } from '../../GlobalStyle';
import { BASE_URL } from '../constant/Url';
import { useAuth } from '../../Context/AuthContext';
import { useChat } from '../../Context/ChatContext';

const UnblockModal = ({ isVisible, toggleModal, blockedId }) => {
    const { userDetails } = useAuth();
    const { fetchBlockedUsers, checkBlockedStatus } = useChat();
    const unblockUser = async () => {
        try {
            const res = await fetch(`${BASE_URL}/unblock/${userDetails?._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    blockerId: userDetails?._id,
                    blockedId: blockedId,
                }),
            });
            const result = await res.json();
            if (res.ok) {
                checkBlockedStatus();
                Alert.alert("Success", "User has been successfully unblocked.");
            } else {
                throw new Error(result.message || 'Failed to unblock user');
            }
        } catch (error) {
            Alert.alert("Error", error.message || "Failed to unblock user.");
        } finally {
            fetchBlockedUsers();
        }
    }
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={toggleModal}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.heading}>Unblock User</Text>
                    {/* <View style={{width:'100%',height:1,backgroundColor:'#7355A8'}}></View> */}
                    <Text style={styles.subHeading}>Are you sure you want to unblock?</Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={toggleModal} style={styles.noButton}>
                            <Text style={styles.noText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            // Add your logout logic here
                            unblockUser();
                            toggleModal();
                        }} style={styles.yesButton}>
                            <Text style={styles.yesText}>Unblock</Text>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    noButton: {
        backgroundColor: '#E5E7EB',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginRight: 10,
        borderRadius: 10,
        width: '49%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    yesButton: {
        backgroundColor: '#66B2B2',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        width: '49%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    noText: {
        color: 'black',
        fontSize: 16,
        fontFamily: FontFamily.nunitoRegular,
    },
    yesText: {
        color: 'white',
        fontSize: 16,
        fontFamily: FontFamily.nunitoRegular,
    },
});

export default UnblockModal;
