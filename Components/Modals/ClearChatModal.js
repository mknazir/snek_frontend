import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { FontFamily } from '../../GlobalStyle';
import { useChat } from '../../Context/ChatContext';
import { useAuth } from '../../Context/AuthContext';
import { BASE_URL } from '../constant/Url';

const ClearChatModal = ({ isVisible, toggleModal, roomId, setMessages }) => {
    const { userDetails } = useAuth();
    const { socket } = useChat();
    const clearChat = useCallback(async (roomId) => {
        try {
            const res = await fetch(`${BASE_URL}/chat/clearChat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userDetails?._id,
                    conversationId: roomId,
                }),
            });

            if (res.ok) {
                setMessages([]);
                Alert.alert("Chat Cleared", "Your chat has been successfully cleared.", [{ text: "OK" }]);
                if (socket?.current) {
                    socket.current.emit('chat_cleared', { roomId, userId: userDetails?._id });
                }
            } else {
                Alert.alert("Failed to Clear Chat", "Failed to clear chat. Unknown error.", [{ text: "OK" }]);
            }
        } catch (error) {
            Alert.alert("Error", `An error occurred while trying to clear the chat.`, [{ text: "OK" }]);
        }
    }, [userDetails?._id]);
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={toggleModal}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.heading}>Are you sure?</Text>
                    <Text style={styles.subHeading}>Chat will only be cleared for you</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={toggleModal} style={styles.noButton}>
                            <Text style={styles.noText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            clearChat(roomId);
                            toggleModal();
                        }} style={styles.yesButton}>
                            <Text style={styles.yesText}>Clear Chat</Text>
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
        fontSize: 15,
        fontFamily: FontFamily.nunitoSemiBold,
    },
});

export default ClearChatModal;
