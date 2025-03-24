import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { FontFamily } from '../../GlobalStyle';
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useNavigation } from '@react-navigation/native';
import ClearChatModal from './ClearChatModal';
import BlockUserModal from './BlockUserModal';
import UnblockModal from './UnblockModal';
import { useChat } from '../../Context/ChatContext';

const ChatOptions = ({ isVisible, toggleModal, chatInfo, setMessages }) => {
    const { receiverId } = chatInfo;
    const navigation = useNavigation();
    const { blockedList } = useChat();
    const [modalType, setModalType] = useState(null); // 'clear', 'block', 'unblock', null
    const [blocked, setBlocked] = useState(false);

    useEffect(() => {
        if (modalType === 'block' || modalType === 'unblock' || modalType === null) {
            setBlocked(false);
            blockedList.map(blocked => {
                if (blocked?.blocked?._id === receiverId) {
                    setBlocked(true);
                } else {
                    setBlocked(false);
                }
            });
        }
    }, [modalType, blockedList, receiverId]);

    const handleToggleModal = (type) => {
        if (type === modalType) {
            setModalType(null);
        } else {
            setModalType(type);
        }
        if (type === 'block' || type === 'unblock') {
            toggleModal(); // Ensure to call this after a slight delay if needed
        }
    };

    const closeModal = () => {
        setModalType(null);
        toggleModal();
    }

    return (
        <>
            <Modal
                animationType="fade"
                transparent={true}
                visible={isVisible}
                onRequestClose={() => closeModal()}
            >
                <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={() => closeModal()}>
                    <TouchableOpacity style={styles.modalContent} activeOpacity={1}>
                        {blocked ? (
                            <TouchableOpacity onPress={() => handleToggleModal('unblock')}>
                                <Text style={[styles.heading, { color: 'green' }]}>Unblock</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={() => handleToggleModal('block')}>
                                <Text style={[styles.heading, { color: '#ff0000' }]}>Block</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity onPress={() => navigation.navigate('Report', { receiverId })}>
                            <Text style={styles.heading}>Report</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => handleToggleModal('clear')}>
                            <Text style={styles.heading}>Clear Chat</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            <ClearChatModal
                isVisible={modalType === 'clear'}
                toggleModal={closeModal}
                roomId={chatInfo.roomId}
                setMessages={setMessages}
            />

            <BlockUserModal
                isVisible={modalType === 'block'}
                toggleModal={closeModal}
                userInfo={{ profileImage: chatInfo.profileImage, name: chatInfo.name, blockedId: receiverId }}
            />

            <UnblockModal
                isVisible={modalType === 'unblock'}
                toggleModal={closeModal}
                blockedId={receiverId}
            />
        </>
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
        width: '40%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    heading: {
        fontSize: hp('2%'),
        fontFamily: FontFamily.nunitoSemiBold,
        marginBottom: 10,
        color: 'black',
    },
});

export default ChatOptions;
