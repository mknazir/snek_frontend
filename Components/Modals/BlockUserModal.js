import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, Alert } from 'react-native';
import { FontFamily } from '../../GlobalStyle';
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useAuth } from '../../Context/AuthContext';
import { BASE_URL } from '../constant/Url';
import { useChat } from '../../Context/ChatContext';

const BlockUserModal = ({ isVisible, toggleModal, userInfo }) => {
    const { fetchBlockedUsers, checkBlockedStatus } = useChat();
    const { profileImage, name, blockedId } = userInfo;
    const { userDetails } = useAuth();
    const handleBlockUser = async () => {
        // Add your block logic here
        const data = {
            blockerId: userDetails?._id,
            blockedId: blockedId,
        };
        try {
            const res = await fetch(`${BASE_URL}/block`, {
                body: JSON.stringify(data),
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const result = await res.json();

            if (res.ok) {
                checkBlockedStatus();
                Alert.alert("Success", "User has been successfully blocked.");
            } else {
                throw new Error(result.message || 'Failed to block user');
            }
        } catch (error) {
            Alert.alert("Error", error.message || "Failed to block user.");
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
                    <View style={styles.userInfoContainer}>
                        <Image
                            source={{ uri: profileImage }}
                            style={styles.userImage}
                            resizeMode="cover"
                        />
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>{name}</Text>
                        </View>
                    </View>

                    <Text style={styles.messageText}>If you block this user, they will not be able to send you messages.</Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={toggleModal} style={styles.noButton}>
                            <Text style={styles.noText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            // Add your block logic here
                            handleBlockUser();
                            toggleModal();
                        }} style={styles.yesButton}>
                            <Text style={styles.yesText}>Block</Text>
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
        justifyContent: 'space-between',
    },
    userInfoContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: hp(1),
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: 'grey',
    },
    userInfo: {
        width: '100%',
        flexDirection: 'column',
        marginLeft: hp(1),
    },
    userName: {
        color: 'black',
        fontFamily: FontFamily.nunitoSemiBold,
        fontSize: hp(2.2),
        textAlign: 'center',
    },
    messageText: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 20,
        fontFamily: FontFamily.nunitoRegular,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
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
        backgroundColor: '#DD453A',
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
        fontFamily: FontFamily.nunitoSemiBold,
    },
    yesText: {
        color: 'white',
        fontSize: 16,
        fontFamily: FontFamily.nunitoSemiBold,
    },
});

export default BlockUserModal;
