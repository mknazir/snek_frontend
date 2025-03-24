// ChatContext.js
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { BASE_URL } from '../Components/constant/Url';
import { useAuth } from './AuthContext';
import { ToastAndroid } from 'react-native';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const { userDetails } = useAuth();
    const [receiverId, setReceiverId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [totalUnreadMessageCount, setTotalUnreadMessageCount] = useState(0);
    const [matches, setMatches] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [blockedList, setBlockedList] = useState([]);
    const [isBlocked, setIsBlocked] = useState(false);
    const [loadingMatches, setLoadingMatches] = useState(false);

    const socket = useRef(null);

    const fetchMatches = useCallback(async () => {
        if (userDetails?._id) {
            try {
                const res = await fetch(`${BASE_URL}/chat/matches/${userDetails?._id}`);
                const data = await res.json();
                setMatches(data?.matchedUsers);
                setLoadingMatches(true);
                return data?.matchedUsers;
            } catch (error) {
                ToastAndroid.show(error.message || 'Error fetching matches', ToastAndroid.SHORT);
                return [];
            }
        }
    }, [userDetails?._id]); // ✅ Only re-create when userId changes

    const fetchBlockedUsers = async () => {
        try {
            const response = await fetch(`${BASE_URL}/block/${userDetails?._id}`);
            const data = await response.json();
            setBlockedList(data);
        } catch (error) {
            ToastAndroid.showWithGravityAndOffset(
                error.message || "Something Went Wrong",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            );
        }
    };

    const checkBlockedStatus = async (id = receiverId) => {
        try {
            const res = await fetch(`${BASE_URL}/check-block-status`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: userDetails?._id, otherUserId: id }),
            });
            const blocked = await res.json();
            setIsBlocked(blocked);
            return blocked;
        } catch (error) {
            return false;
        }
    }

    useEffect(() => {
        if (userDetails?._id) {
            fetchBlockedUsers();
        }
    }, [userDetails?._id]);

    const fetchUnreadMessageCount = useCallback(() => {
        if (socket?.current) {
            socket.current.emit('get_unread_message_count', { userId: userDetails?._id });
        }
    }, [userDetails?._id, socket?.current]);

    const handleUnreadMessageCount = ({ totalUnreadCount }) => {
        setTotalUnreadMessageCount(totalUnreadCount);
    };

    useEffect(() => {
        if (userDetails?._id && !socket?.current) {
            socket.current = io(BASE_URL, {
                transports: ['websocket'],
                reconnection: true,
                reconnectionDelay: 1000,
                query: { userId: userDetails._id },
            });

            socket?.current?.on('connect', () => {
                fetchUnreadMessageCount();
            });

            // Setup listeners immediately after establishing the connection
            socket?.current?.on('user_online', (users) => {
                setOnlineUsers(users);
            });

            socket?.current?.on('user_offline', (users) => {
                setOnlineUsers(users);
            });

            socket.current.on('unread_message_count', handleUnreadMessageCount);
        }
        return () => {
            if (socket?.current) {
                socket.current.off('unread_message_count', handleUnreadMessageCount);
                socket?.current?.disconnect();
            }
        };
    }, [userDetails?._id]); // Depend on userDetails._id to ensure re-connection if it changes or becomes available

    useEffect(() => {
        if (socket?.current) {
            const handleMessagesSeenUpdate = ({ messages, userId }) => {
                if (userId !== userDetails?._id) { // Check to ensure the local user is not the one who marked them seen
                    setMessages(prevMessages => prevMessages.map(msg =>
                        messages?.includes(msg?._id.toString()) ? { ...msg, is_seen: true } : msg
                    ));
                }
            };

            socket?.current?.on('messages_seen_update', handleMessagesSeenUpdate);

            return () => {
                socket?.current?.off('messages_seen_update', handleMessagesSeenUpdate);
            };
        }
    }, [socket?.current, userDetails?._id]);

    useEffect(() => {
        const blockedStatus = checkBlockedStatus();
        setIsBlocked(blockedStatus);
    }, [userDetails?._id, receiverId]);


    const joinRoom = useCallback((roomId) => {
        if (socket.current && roomId) {
            socket.current.emit('join_room', { roomId, userId: userDetails?._id });
            // Setup the event listener only once upon joining the room
            const newMessageHandler = (newMessage) => {
                setMessages(prevMessages => [...prevMessages, newMessage]);
            };

            socket.current.on('new_message', newMessageHandler);

            return () => {
                socket.current.off('new_message', newMessageHandler);
            }
        }
    }, [userDetails?._id]);

    const leaveRoom = useCallback((roomId,) => {
        if (socket?.current && roomId) {
            socket?.current.emit('leave_room', { roomId });
            socket?.current.off('new_message');   // Ensure this is the right place to turn off the listener
            setMessages([]);  // Clear messages as you leave the room
        }
    }, [socket?.current]); // Include socket.current to ensure the callback updates with it


    const sendMessage = useCallback((roomId, message) => {
        if (socket.current && roomId && message) {
            socket.current.emit('send_message', {
                roomId,
                senderId: userDetails?._id,
                message
            });
        }
    }, [userDetails?._id]);

    return (
        <ChatContext.Provider value={{
            socket,
            receiverId,
            isBlocked,
            setIsBlocked,
            checkBlockedStatus,
            blockedList,
            fetchBlockedUsers,
            matches,
            messages,
            joinRoom,
            leaveRoom,
            sendMessage,
            fetchMatches,
            onlineUsers,
            totalUnreadMessageCount,
            loadingMatches
        }}>
            {children}
        </ChatContext.Provider>
    );
};
