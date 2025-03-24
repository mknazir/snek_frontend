import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Svg, Path } from 'react-native-svg';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FontFamily } from '../../GlobalStyle';
import { useAuth } from '../../Context/AuthContext';
import { useChat } from '../../Context/ChatContext';
import { useNavigation } from '@react-navigation/native';

const ChatItem = ({ item, onlineUsers, blockedList }) => {
    const navigation = useNavigation();
    const { userDetails } = useAuth();
    const { socket, fetchMatches, matches } = useChat();
    const [lastMessage, setLastMessage] = useState({
        content: item.lastMessage,
        sender: item.lastMessageSender,
        roomId: item.roomId,
        is_seen: item.is_seen,
    });

    useEffect(() => {
        const handleUpdateLastMessage = (newLastMessage) => {
            if (item.roomId === newLastMessage?.roomId) {
                setLastMessage(() => {
                    return {
                        _id: newLastMessage?._id,
                        content: newLastMessage?.content,
                        sender: newLastMessage?.sender,
                        roomId: newLastMessage?.roomId,
                        is_seen: newLastMessage?.is_seen,
                    };
                });
            }
            fetchMatches();
        };

        const handleMessagesSeenUpdate = ({ messages }) => {
            setLastMessage((prevMessage) => {
                if (messages?.includes(prevMessage?._id) && !prevMessage?.is_seen) {
                    return { ...prevMessage, is_seen: true };
                }
                return prevMessage;
            });
        };

        socket?.current?.on("messages_seen_update", handleMessagesSeenUpdate);
        socket?.current?.on("update_last_message", handleUpdateLastMessage);

        return () => {
            socket?.current?.off("messages_seen_update", handleMessagesSeenUpdate);
            socket?.current?.off("update_last_message", handleUpdateLastMessage);
        };
    }, [item.roomId, matches]); // Removed lastMessage to avoid infinite re-renders

    const handleChatPress = () => {
        navigation.navigate('ChatDetails', { roomId: item.roomId, name: item.name, profileImage: item.profileImage, receiverId: item._id });
    };

    return (
        <TouchableOpacity
            key={item._id}
            style={styles.chatItem}
            onPress={() => {
                if (item.isActive) {
                    handleChatPress(item._id, item.name, item.profileImage);
                }
            }}
            disabled={!item.isActive}
        >
            {/* Profile Image or Default Icon */}
            <View style={styles.avatarContainer}>
                {item.isActive ? (
                    <Image
                        source={{ uri: item.profileImage || 'https://via.placeholder.com/150' }}
                        style={styles.avatar}
                    />
                ) : (
                    <MaterialCommunityIcons name="account" size={40} color="grey" style={{ marginLeft: 10 }} />
                )}

                {/* Online Indicator */}
                {onlineUsers?.includes(item._id) && !blockedList?.includes(item._id) && (
                    <View style={styles.onlineIndicator} />
                )}
            </View>

            {/* Chat Info */}
            <View style={styles.chatInfoContainer}>
                <View style={styles.chatNameContainer}>
                    <Text style={styles.chatName}>{item.isActive ? item.name : 'User'}</Text>
                    {(!lastMessage?.is_seen && lastMessage?.sender != userDetails._id && lastMessage?.content) && (
                        <View style={{
                            position: 'absolute',
                            width: 6,
                            height: 6,
                            borderRadius: 5,
                            backgroundColor: 'red',
                            right: 0
                        }} />
                    )}
                </View>
                <View style={styles.lastMessageContainer}>
                    {lastMessage?.content && lastMessage?.sender == userDetails._id && (
                        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={{ marginRight: 2 }}>
                            {lastMessage?.is_seen ? (
                                // Double Check (Read)
                                <>
                                    <Path d="M17.5 6.5L9 15l-3.5-3.5" stroke="#34B7F1" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                    <Path d="M21 6.5L12.5 15l-3.5-3.5" stroke="#34B7F1" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                </>
                            ) : (
                                // Single Check (Unread)
                                <>
                                    <Path d="M17.5 6.5L9 15l-3.5-3.5" stroke="#808080" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                    <Path d="M21 6.5L12.5 15l-3.5-3.5" stroke="#808080" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                </>
                            )}
                        </Svg>
                    )}

                    {/* Last Message Text */}
                    {lastMessage?.content ? (
                        <Text
                            style={[
                                styles.lastMessage,
                                { color: lastMessage?.is_seen ? "gray" : "black", fontFamily: lastMessage?.is_seen || lastMessage?.sender == userDetails._id ? FontFamily.nunitoRegular : FontFamily.nunitoBold }
                            ]}
                        >
                            {lastMessage?.content?.length >= 40 ? `${lastMessage?.content.slice(0, 40)}...` : lastMessage?.content}
                        </Text>
                    ) : (
                        <Text style={[styles.lastMessage, { color: "gray" }]}>{item.isActive ? `Start a new conversation` : ''}</Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    chatItem: {
        width: '100%',
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#d1d5db',
    },
    avatarContainer: {
        position: 'relative',
        justifyContent: 'center',
        width: hp(7),
        height: hp(7),
    },
    avatar: {
        width: '90%',
        height: '90%',
        borderRadius: hp(7) / 2,
    },
    chatInfoContainer: {
        width: '80%',
        marginLeft: 5,
        height: hp(6),
    },
    chatNameContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chatName: {
        fontSize: hp(2),
        fontFamily: FontFamily.nunitoSemiBold,
        color: 'black',
    },
    lastMessageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    lastMessage: {
        fontSize: hp(1.5),
        color: 'grey',
        fontFamily: FontFamily.nunitoRegular,
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'green',
    },
});

export default ChatItem;
