import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native'
import React, { useState } from 'react';
import { BackIcon } from '../../../assets/AuthIcons';
import { FontFamily } from '../../../GlobalStyle';
import UnblockModal from '../../../Components/Modals/UnblockModal';
import { useNavigation } from "@react-navigation/native";
import { useChat } from '../../../Context/ChatContext';
import Empty from '../../../Components/Empty';

const BlockAcc = () => {
  const navigation = useNavigation();
  const [isUnblockVisible, setUnblockVisible] = useState(false);
  const [blockedId, setBlockedId] = useState(null);
  const { blockedList } = useChat();
  const toggleUnblock = () => {
    setUnblockVisible(!isUnblockVisible);
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={{ height: 100, width: '90%', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => { navigation.navigate("Settings") }} style={{ width: '10%', }}>
            <BackIcon style={{ transform: [{ scale: 1.4 }] }} />
          </TouchableOpacity>

          <View style={{ width: '75%', }}>
            <Text style={styles.labelText}>Block Users</Text>
          </View>
        </View>

        {blockedList?.length === 0 && (
          <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
            <Empty imgSource={require('../../../assets/Images/no-profile.png')}
              title={'No Blocked Users'}
              desc={'You have not blocked anyone yet'}
            />
          </View>
        )}

        {blockedList?.map((user) => (
          <View key={user._id} style={{ height: 100, width: '90%', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginVertical: 10 }}>
            <Image
              source={{ uri: user.blocked.profileImage }}
              style={{ height: 50, width: 50, borderRadius: 50, backgroundColor: '#C4C4C4' }}
            />
            <View style={{ height: '100%', width: '45%', justifyContent: 'center' }}>
              <Text style={[styles.labelText, { color: '#889095', fontSize: 18 }]}>{user.blocked.name}</Text>
            </View>
            <View style={{ height: '100%', width: '35%', justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => { toggleUnblock(); setBlockedId(user.blocked._id) }} style={{ width: '90%', height: '40%', borderRadius: 15, backgroundColor: '#66B2B2', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={[styles.labelText, { color: 'white', fontSize: 16 }]}>Unblock</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}


        <UnblockModal isVisible={isUnblockVisible} toggleModal={toggleUnblock} blockedId={blockedId} />

      </View>
    </ScrollView>

  )
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  labelText: {
    color: '#4E4559',
    fontFamily: FontFamily.nunitoRegular,
    fontSize: 18,
    marginLeft: '5%'
  },
});

export default BlockAcc