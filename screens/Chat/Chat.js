import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Matches from './Matches';
import { useNavigation } from '@react-navigation/native';
import { Color } from '../../GlobalStyle';
import { useAuth } from '../../Context/AuthContext';
import { useChat } from '../../Context/ChatContext';
import ChatItem from '../../Components/chat/ChatItem';
import { getRoomId, clearRoomId } from '../../Navigations/NavigationService'
import { useFocusEffect } from '@react-navigation/native';
import { styles } from './Styles';
import Empty from '../../Components/Empty';

const Chat = () => {
  const navigation = useNavigation();
  const { userDetails, isLoading } = useAuth();
  const { loadingMatches, matches, fetchMatches, onlineUsers, checkBlockedStatus } = useChat();
  const [filteredMatches, setFilteredMatches] = useState(matches);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [blockedList, setBlockedList] = useState([]);

  useEffect(() => {
    const getMatches = async () => {
      const data = await fetchMatches();
      setFilteredMatches(data);
    };
    if (matches?.length === 0) {
      getMatches();
    }
  }, [userDetails?._id]);

  useEffect(() => {
    setFilteredMatches(matches);
  }, [userDetails?._id, matches]);


  useEffect(() => {
    if (!searchQuery) {
      setFilteredMatches(matches);
    } else {
      setFilteredMatches(matches.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    }
  }, [searchQuery, matches]);

  useEffect(() => {
    const fetchBlockedStatus = () => {
      onlineUsers?.map(async (user) => {
        const blocked = await checkBlockedStatus(user);
        if (blocked) {
          setBlockedList(prev => [...prev, user]);
        }
      });
    };
    fetchBlockedStatus();
  }, [onlineUsers]);

  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => {
        const pendingRoomId = getRoomId();
        const matchedUser = matches.find(item => item.roomId === pendingRoomId);

        if (pendingRoomId) {
          navigation.navigate('ChatDetails', { roomId: pendingRoomId, name: matchedUser?.name, profileImage: matchedUser?.profileImage, receiverId: matchedUser?._id });
          clearRoomId();
        }
      }, 500)

    }, [matches, navigation])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMatches();
    setRefreshing(false);
  };

  // Show loader while loading
  if (isLoading || refreshing || !loadingMatches) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Color.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.matchesTitleContainer}>
        <Text style={styles.matchesTitle}>Chat</Text>
      </View>
      <Matches />

      <View style={styles.searchBar}>
        <TextInput
          placeholder="Search"
          placeholderTextColor={'grey'}
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {
        filteredMatches?.length == 0 &&
        <Empty
          imgSource={require('../../assets/Images/no-chat.png')}
          title={'No Chat Available'}
          desc={'Swipe right to chat'}
        />
      }

      <FlatList
        data={filteredMatches}
        extraData={filteredMatches?.length}
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        renderItem={({ item }) => (
          <ChatItem
            key={item._id}
            item={item}
            onlineUsers={onlineUsers}
            blockedList={blockedList}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Chat;