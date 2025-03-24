import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ToastAndroid, RefreshControl, ActivityIndicator, Image } from 'react-native';
import { Color, FontFamily } from '../../GlobalStyle';
import { useNavigation } from '@react-navigation/native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import axios from 'axios';
import { useAuth } from '../../Context/AuthContext';
import { GroupAddIcon } from '../../assets/GroupIcons';
import { BASE_URL } from '../../Components/constant/Url';
import JoinGroupModal from '../../Components/Modals/JoinGroupModal';
import Empty from '../../Components/Empty';

const Group = () => {
  const navigation = useNavigation();
  const [datingAppGroups, setDatingAppGroups] = useState([]);
  const [pastGroups, setPastGroups] = useState([]);
  const [upcomingGroups, setUpcomingGroups] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { userDetails, isLoading } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedTab, setSelectedTab] = useState('upcoming'); // Track selected tab

  // Safe assignment of userId
  const userId = userDetails?._id;

  const fetchGroups = async () => {
    if (!userId || !userDetails?.collegeName) {
      ToastAndroid.show('Failed to load groups. Please try again.', ToastAndroid.SHORT);
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/group/get-all`);

      const processedGroups = response.data
        .filter((group) => {
          const groupCollege = group.createdBy?.collegeName?.trim()?.toLowerCase();
          const userCollege = userDetails?.collegeName?.trim()?.toLowerCase();
          return groupCollege && userCollege && groupCollege === userCollege;
        })
        .map((group) => {
          const member = group.members.find((m) => m.userId?._id === userId);
          return {
            ...group,
            isMember: !!member,
            hasPaid: member?.payment || false,
            noOfMembers: group.members.length,
          };
        });

      setDatingAppGroups(processedGroups);
    } catch (error) {
      ToastAndroid.show('Failed to load groups. Please try again.', ToastAndroid.SHORT);
    }
  };

  const filterUpcomingGroups = (groups) => {
    // Get current local date and time in milliseconds
    const now = new Date();
    // console.log("Now (Local Time):", now.toISOString());

    return groups.filter(group => {
      // Convert group's start date and time to a full Date object
      const groupDateTime = new Date(`${group.startDate}T${group.startTime}`);
      // console.log("Group DateTime:", groupDateTime.toISOString());

      // Compare timestamps
      return groupDateTime >= now && group.groupActive;
    });
  };
  const filterPastGroups = (groups) => {
    // Get current local date and time in milliseconds
    const now = new Date();
    // console.log("Now (Local Time):", now.toISOString());

    return groups.filter(group => {
      // Convert group's start date and time to a full Date object
      const groupDateTime = new Date(`${group.startDate}T${group.startTime}`);
      // console.log("Group DateTime:", groupDateTime.toISOString());

      // Compare timestamps
      return groupDateTime < now || !group.groupActive;;
    });
  };
  useEffect(() => {
    setUpcomingGroups(filterUpcomingGroups(datingAppGroups));
    setPastGroups(filterPastGroups(datingAppGroups));
  }, [datingAppGroups]);

  const refreshGroups = async () => {
    await fetchGroups();  // Call fetchGroups to refresh the list
  };



  useEffect(() => {
    if (userId) {
      fetchGroups();
    }
  }, [userDetails]);

  // Refresh groups
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGroups();
    setRefreshing(false);
  };

  const handleOpenModal = (groupId) => {
    setSelectedGroupId(groupId);
    setModalVisible(true);
  };

  const handleJoinSuccess = () => {
    fetchGroups();  // Refresh group data after successful join
    setModalVisible(false);  // Close the modal after updating the data
  };


  const renderGroups = () => {
    if (selectedTab === 'upcoming') {
      return (
        <View style={{ height: '75%', width: '100%' }}>
          {upcomingGroups.length === 0 ? (
            <Empty
              imgSource={require('../../assets/Images/no-group.png')}
              title={'No Upcoming Groups'}
              desc={'Revisit After Few Hours'}
            />
          ) : (
            <ScrollView
              style={{ width: '100%' }}
              contentContainerStyle={{ flexGrow: 1 }}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
              {upcomingGroups.filter(group => group.groupActive).map((group) => (
                <View
                  key={group._id}
                  style={{
                    width: '100%',
                    height: 300,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginVertical: 3,
                  }}
                >
                  <View
                    style={{
                      width: '90%',
                      height: '90%',
                      borderColor: '#D0E5E5',
                      borderWidth: 1,
                      borderRadius: 15,
                      justifyContent: 'space-between',
                    }}
                  >
                    <View
                      style={{
                        width: '100%',
                        height: '25%',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal: hp('2%'),
                      }}
                    >
                      <View style={{ width: '80%' }}>
                        <Text style={{ fontFamily: FontFamily.nunitoSemiBold, color: 'black', fontSize: hp('2%') }}>
                          {group.groupName}
                        </Text>
                      </View>
                      {userDetails._id === group.createdBy._id && (
                        <View
                          style={{
                            width: '22%',
                            backgroundColor: Color.cyan1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 20,
                            paddingVertical: 5,
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: FontFamily.nunitoSemiBold,
                              color: 'white',
                              fontSize: hp('0.8%'),
                            }}
                          >
                            *Created By You
                          </Text>
                        </View>
                      )}


                    </View>

                    <View style={{ width: '100%', paddingHorizontal: hp('2%'), marginTop: 10 }}>
                      <Text style={{ fontFamily: FontFamily.nunitoRegular, color: 'black', fontSize: hp('1.6%') }}>
                        {group.description}
                      </Text>
                      {((group.isMember && group.hasPaid) || (userDetails._id === group.createdBy._id)) && (
                        <>
                          <Text style={{ fontFamily: FontFamily.nunitoRegular, color: 'black', fontSize: hp('1.6%') }}>
                            {group.startDate} | {group.startTime} - {group.endTime}
                          </Text>
                          <Text style={{ fontFamily: FontFamily.nunitoRegular, color: 'black', fontSize: hp('1.6%') }}>
                            Location: {group.location}
                          </Text>
                        </>
                      )}
                    </View>


                    <View
                      style={{
                        width: '100%',
                        height: '30%',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal: hp('2%'),
                      }}
                    >
                      <View
                        style={{
                          borderRadius: 20,
                          backgroundColor: '#E6F7F7',
                          alignItems: 'center',
                          justifyContent: 'center',
                          paddingHorizontal: hp('2%'),
                          height: '50%',
                        }}
                      >
                        <Text style={{ fontFamily: FontFamily.nunitoSemiBold, color: 'black', fontSize: hp('1.3%') }}>
                          {group.noOfMembers} members
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={group.isMember ? styles.joinedButton : styles.joinButton}
                        onPress={() => group.isMember ? null : handleOpenModal(group._id)}
                        disabled={group.isMember}
                      >
                        <Text style={{ fontFamily: FontFamily.nunitoRegular, color: 'black', fontSize: hp('1.8%') }}>
                          {group.isMember ? 'Joined' : 'Join'}
                        </Text>
                      </TouchableOpacity>

                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}

          <JoinGroupModal
            isVisible={isModalVisible}
            toggleModal={() => setModalVisible(false)}
            groupId={selectedGroupId}
            userId={userId}
            onSuccess={handleJoinSuccess}
          />
        </View>
      );
    } else if (selectedTab === 'history') {
      return (
        <View style={{ height: '75%', width: '100%' }}>
          {pastGroups.length === 0 ? (
            <Empty
              imgSource={require('../../assets/Images/no-group.png')}
              title={'No Past Groups Found'}
              desc={'Revisit After Few Hours'}
            />
          ) : (
            <ScrollView
              style={{ width: '100%' }}
              contentContainerStyle={{ flexGrow: 1 }}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
              {pastGroups.map((group) => (
                <View
                  key={group._id}
                  style={{
                    width: '100%',
                    height: 300,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginVertical: 3,
                  }}
                >
                  <View
                    style={{
                      width: '90%',
                      height: '90%',
                      borderColor: '#D0E5E5',
                      borderWidth: 1,
                      borderRadius: 15,
                      justifyContent: 'space-between',
                    }}
                  >
                    <View
                      style={{
                        width: '100%',
                        height: '25%',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal: hp('2%'),
                      }}
                    >
                      <View style={{ width: '80%' }}>
                        <Text style={{ fontFamily: FontFamily.nunitoSemiBold, color: 'black', fontSize: hp('2%') }}>
                          {group.groupName}
                        </Text>
                      </View>
                      {userDetails._id === group.createdBy._id && (
                        <View
                          style={{
                            width: '22%',
                            backgroundColor: Color.cyan1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 20,
                            paddingVertical: 5,
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: FontFamily.nunitoSemiBold,
                              color: 'white',
                              fontSize: hp('0.8%'),
                            }}
                          >
                            *Created By You
                          </Text>
                        </View>
                      )}


                    </View>

                    <View style={{ width: '100%', paddingHorizontal: hp('2%'), marginTop: 10 }}>
                      <Text style={{ fontFamily: FontFamily.nunitoRegular, color: 'black', fontSize: hp('1.6%') }}>
                        {group.description}
                      </Text>
                      {((group.isMember && group.hasPaid) || (userDetails._id === group.createdBy._id)) && (
                        <>
                          <Text style={{ fontFamily: FontFamily.nunitoRegular, color: 'black', fontSize: hp('1.6%') }}>
                            {group.startDate} | {group.startTime} - {group.endTime}
                          </Text>
                          <Text style={{ fontFamily: FontFamily.nunitoRegular, color: 'black', fontSize: hp('1.6%') }}>
                            Location: {group.location}
                          </Text>
                        </>
                      )}
                    </View>


                    <View
                      style={{
                        width: '100%',
                        height: '30%',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal: hp('2%'),
                      }}
                    >
                      <View
                        style={{
                          borderRadius: 20,
                          backgroundColor: '#E6F7F7',
                          alignItems: 'center',
                          justifyContent: 'center',
                          paddingHorizontal: hp('2%'),
                          height: '50%',
                        }}
                      >
                        <Text style={{ fontFamily: FontFamily.nunitoSemiBold, color: 'black', fontSize: hp('1.3%') }}>
                          {group.noOfMembers} members
                        </Text>
                      </View>
                      {/* <TouchableOpacity
                        style={group.isMember ? styles.joinedButton : styles.joinButton}
                        onPress={() => group.isMember ? null : handleOpenModal(group._id)}
                        disabled={group.isMember}
                      >
                        <Text style={{ fontFamily: FontFamily.nunitoRegular, color: 'black', fontSize: hp('1.8%') }}>
                          {group.isMember ? 'Joined' : 'Join'}
                        </Text>
                      </TouchableOpacity> */}
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}

          <JoinGroupModal
            isVisible={isModalVisible}
            toggleModal={() => setModalVisible(false)}
            groupId={selectedGroupId}
            userId={userId}
            onSuccess={handleJoinSuccess}
          />
        </View>
      );
    }
  };


  // Show loader if userDetails is loading
  if (isLoading || !userId) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Color.primary} />
      </View>
    );
  }



  return (
    <View style={styles.container}>
      <View style={{ width: '100%', paddingHorizontal: '5%', height: '8%', justifyContent: 'center' }}>
        <Text style={{ fontFamily: FontFamily.nunitoSemiBold, color: '#181126', fontSize: 25 }}>Groups</Text>
      </View>


      {(userDetails.status === "Un-Verified") ?
        (<View style={{ height: '80%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: FontFamily.nunitoSemiBold, color: '#A0A09E', fontSize: 20 }}>Wait please once you will get verified you can join the groups</Text>
        </View>) : (
          <>

            <View style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
              <TouchableOpacity
                style={[styles.tab, selectedTab === 'upcoming' && styles.activeTab]}
                onPress={() => setSelectedTab('upcoming')}
              >
                <Text style={styles.tabText}>Upcoming Groups🔥</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, selectedTab === 'history' && styles.activeTab]}
                onPress={() => setSelectedTab('history')}
              >
                <Text style={styles.tabText}>History🔍</Text>
              </TouchableOpacity>
            </View>

            {renderGroups()}
          </>
        )
      }

      <View style={{ width: '100%', height: '10%', alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity onPress={() => {
          if (userDetails.status === "Un-Verified") {
            ToastAndroid.show('Wait till you are verified for creating a group.', ToastAndroid.LONG);
          } else {
            navigation.navigate('CreateGroup', { refreshGroups });
          }
        }}>
          <GroupAddIcon style={{ transform: [{ scale: 1 }] }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: hp('3%'),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinButton: {
    borderRadius: 8,
    backgroundColor: Color.cyan1,
    width: '30%',
    height: '45%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinedButton: {
    borderRadius: 8,
    backgroundColor: '#d3d3d3',
    width: '30%',
    height: '55%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tab: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Color.cyan1,
  },
  tabText: {
    fontFamily: FontFamily.nunitoSemiBold,
    color: '#181126',
    fontSize: 16,
  },
});

export default Group;
