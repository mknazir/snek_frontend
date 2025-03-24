import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { FontFamily } from "../../GlobalStyle";
import { useAuth } from "../../Context/AuthContext";
import ChatOptions from "../../Components/Modals/ChatOptions";
import { useChat } from "../../Context/ChatContext";
import { BASE_URL } from "../../Components/constant/Url";

export default function ChatDetailsScreen({ route }) {
  const { roomId, name, profileImage, receiverId } = route.params;
  const { userDetails } = useAuth();
  const navigation = useNavigation();
  const { socket, leaveRoom, sendMessage, checkBlockedStatus, onlineUsers, matches } = useChat();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [online, setOnline] = useState(false);
  const flatListRef = useRef(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);

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

  useEffect(() => {
    joinRoom(roomId);
    socket.current.emit('get_online_users');
    const fetchBlockedStatus = async () => {
      const isUserBlocked = await checkBlockedStatus(receiverId || matchedUser?._id);
      setIsBlocked(isUserBlocked);
    }
    fetchBlockedStatus();
    return () => leaveRoom(roomId);
  }, [roomId, receiverId,]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${BASE_URL}/chat/get-messages/${roomId}/${userDetails._id}`);
        const data = await res.json();
        if (res.ok) {
          setMessages(data.messages);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        alert(error.message || "Failed to fetch messages.");
      }

    };
    fetchMessages();
    const matchedUser = matches.find(item => item.roomId === roomId);
    setMatchedUser(matchedUser);
  }, [roomId, userDetails._id]);

  useEffect(() => {
    if (matches.length > 0) { // Ensure matches is available
      const matchedUserData = matches.find(item => item.roomId === roomId);
      if (matchedUserData) {
        setMatchedUser(matchedUserData);
      }
    }
  }, [matches, roomId]);

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
    flatListRef.current.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    const isOnline = onlineUsers.includes(receiverId || matchedUser?._id);
    setOnline(isOnline);
  }, [onlineUsers, receiverId]);

  // Handle message send action
  const handleSendMessage = async () => {
    setMessage('');
    const isUserBlocked = await checkBlockedStatus(receiverId || matchedUser?._id);
    if (message.trim() && !isUserBlocked) {
      await sendMessage(roomId, message.trim());
    } else {
      alert("You cannot send a message as you are blocked or this user is in your block list.");
    }
  };

  const isSeen = (messageId) => {
    const found = messages.find((message) => message._id === messageId);
    return found ? found.is_seen : false;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="chevron-back-outline" size={hp(2.5)} color={"white"} />
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: profileImage || matchedUser?.profileImage || 'https://via.placeholder.com/150' }} style={styles.avatar} />
          </View>
          <View style={styles.nameWrapper}>
            <Text style={styles.nameText}>{name || matchedUser?.name}</Text>
            < Text style={[styles.matchStatus, {
              display: isBlocked ? 'none' : 'flex'
            }]} >{online ? 'Online' : 'Offline'}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.moreOptionsWrapper}>
          <TouchableOpacity onPress={() => setModalVisible(!isModalVisible)}>
            <Icon name="ellipsis-vertical-sharp" size={hp(3)} color={"white"} />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => `${item._id}`}
        initialNumToRender={20}
        maxToRenderPerBatch={10}
        renderItem={({ item }) => (
          <View style={[
            styles.chatMessageContainer,
            item.sender === userDetails._id ? styles.myMessage : styles.theirMessage
          ]}>
            <View style={styles.messageBubble}>
              <Text style={styles.messageText}>{item.content}</Text>
            </View>
            <View style={styles.messageMeta}>
              <Text style={styles.readTimestamp}>{formatTimestamp(item.createdAt)}</Text>
              {/* Only show "Seen" indicator for messages sent by the user and marked as seen */}
              {item.sender === userDetails._id && (
                isSeen(item._id) ? (
                  <Text style={styles.seenIndicator}>seen</Text>
                ) : <Text style={styles.seenIndicator}>not seen</Text>
              )}

            </View>
          </View>
        )}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
      />


      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Message..."
            placeholderTextColor="gray"
            style={styles.textInput}
            value={message}
            onChangeText={setMessage}
          />
        </View>
        <TouchableOpacity style={styles.sendButton} disabled={!message} onPress={handleSendMessage} >
          <Icon name="send" size={hp(3.8)} color="#66B2B2" />
        </TouchableOpacity>
      </View>

      <ChatOptions
        isVisible={isModalVisible}
        toggleModal={() => setModalVisible(false)}
        chatInfo={{ roomId, receiverId, name, profileImage }}
        setMessages={setMessages}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#66B2B2',
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrapper: {
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#F87171",
    borderRadius: hp(4.5) / 2,
  },
  avatar: {
    width: hp(4.5),
    height: hp(4.5),
    borderRadius: hp(4.5) / 2,
  },
  nameWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  nameText: {
    fontFamily: FontFamily.nunitoRegular,
    fontSize: hp(2.5),
    color: 'white',
  },
  matchStatus: {
    fontFamily: FontFamily.nunitoRegular,
    fontSize: hp(1.5),
    color: 'white',
  },
  moreOptionsWrapper: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#F1F1F1',
    paddingHorizontal: 16,
  },
  dateText: {
    textAlign: "center",
    color: "#9CA3AF",
    paddingVertical: 10,
    fontSize: hp(1.8),
  },
  chatListContent: {
    paddingBottom: 10,
  },
  chatMessageContainer: {
    marginBottom: 12,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#D9F2F3",
    borderRadius: 15,
    borderBottomRightRadius: 3,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  theirMessage: {
    alignSelf: "flex-start",
    backgroundColor: "white",
    borderRadius: 15,
    borderBottomLeftRadius: 3,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  messageText: {
    fontSize: hp(1.8),
    color: "black",
  },
  readTimestamp: {
    alignSelf: "flex-end",
    fontSize: hp(1.2),
    color: "#6B7280",
    marginTop: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#E6F7F7",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  inputContainer: {
    flex: 1,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  textInput: {
    flex: 1,
    height: 40,
    fontSize: hp(2),
    color: "black",
    fontFamily: FontFamily.nunitoRegular,
  },
  iconWrapper: {
    marginLeft: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  messageMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  seenIndicator: {
    fontSize: hp(1.2),
    color: "#66B2B2", // Greenish color for "Seen"
    marginLeft: 8,
  },
  dot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'green',
  }
});





/**
 * Formats the timestamp for chat messages.
 * @param {string} createdAt - The ISO string date from the server.
 * @returns {string} - The formatted date string.
 */
function formatTimestamp(createdAt) {
  const date = new Date(createdAt);
  const now = new Date();
  const yesterday = new Date(now - 86400000); // 86400000ms = 24 hours

  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  const timeOptions = { hour: '2-digit', minute: '2-digit' };

  // Check if the message was sent on the same day
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], timeOptions);
  }

  // Check if the message was sent yesterday
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  // For older messages, show the full date
  return date.toLocaleDateString([], dateOptions);
}