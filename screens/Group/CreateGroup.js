import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, ToastAndroid,ActivityIndicator } from 'react-native';
import { Color, FontFamily } from '../../GlobalStyle';
import { BackIcon, DateIcon, TimeIcon, DropdownIcon } from '../../assets/GroupIcons';
import DatePicker from 'react-native-date-picker';
import { useNavigation, useRoute } from "@react-navigation/native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../Context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '../../Components/constant/Url';

// create a component
const CreateGroup = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);
  const { userDetails } = useAuth();
  const [loading, setLoading] = useState(false); 

  // Retrieve the refreshGroups function passed via navigation parameters
  const { refreshGroups } = route.params;


  const handleCreateGroup = async () => {
    if (!groupName || !description || !location || !selectedDate || !selectedStartTime || !selectedEndTime) {
      ToastAndroid.show('All Fields Required', ToastAndroid.SHORT);
      return;
    }
    if (selectedStartTime.getTime() === selectedEndTime.getTime()) {
      ToastAndroid.show('Start time and end time cannot be the same.', ToastAndroid.SHORT);
      return;
    }

    if (selectedEndTime.getTime() <= selectedStartTime.getTime()) {
      ToastAndroid.show('End time must be after the start time.', ToastAndroid.SHORT);
      return;
    }

    // Normalize both dates to midnight to avoid time component issues
    const normalizeDate = (date) => {
      const normalized = new Date(date);
      normalized.setHours(0, 0, 0, 0);
      return normalized;
    };

    if (normalizeDate(selectedDate) < normalizeDate(new Date())) {
      ToastAndroid.show('Date cannot be in the past.', ToastAndroid.SHORT);
      return;
    }

    const startDate = selectedDate.getFullYear() + "-" +
                  String(selectedDate.getMonth() + 1).padStart(2, '0') + "-" +
                  String(selectedDate.getDate()).padStart(2, '0');

    const groupData = {
      groupName,
      description,
      location,
      startDate, // Now in local time, not UTC
      startTime: selectedStartTime.toLocaleTimeString('en-US', { hour12: false }), 
      endTime: selectedEndTime.toLocaleTimeString('en-US', { hour12: false }),
      payment: false,
      userId: userDetails?._id, 
    };
    
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/group/create`, groupData);
      if (response.status === 201) {
        ToastAndroid.show('Group created successfully!', ToastAndroid.SHORT);
        refreshGroups();  // Refresh the group list in the Group screen
        navigation.goBack();  // Optionally navigate back to the Group screen
        // navigation.navigate('Group');
      }
    } catch (error) {
      ToastAndroid.show(
        error.response?.data?.error || 'Failed to create group. Please try again.',
        ToastAndroid.SHORT
      );
    }finally {
      setLoading(false);  
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.navigate('Group')} style={styles.backButton}>
                <BackIcon style={{ transform: [{ scale: 1.4 }] }} />
              </TouchableOpacity>
              <View style={styles.titleWrapper}>
                <Text style={styles.title}>Create Group</Text>
              </View>
            </View>

            {/* Group Name */}
            <View style={[styles.inputWrapper, { height: '12%' }]}>
              <Text style={styles.labelText}>Group Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#6A707C"
                value={groupName}
                onChangeText={setGroupName}
              />
            </View>

            {/* Group Description */}
            <View style={[styles.inputWrapper, { height: '22%' }]}>
              <Text style={styles.labelText}>Group Description</Text>
              <TextInput
                style={styles.inputDesc}
                placeholder="Description"
                placeholderTextColor="#6A707C"
                value={description}
                onChangeText={setDescription}
                multiline={true}
                textAlignVertical="top"
              />
            </View>

            {/* Location */}
            <View style={[styles.inputWrapper, { height: '12%' }]}>
              <Text style={styles.labelText}>Location</Text>
              <TextInput
                style={styles.input}
                placeholder="Location"
                placeholderTextColor="#6A707C"
                value={location}
                onChangeText={setLocation}
              />
            </View>

            {/* Date Picker */}
            <View style={[styles.inputWrapper, { height: '12%' }]}>
              <Text style={styles.labelText}>When ?</Text>
              <TouchableOpacity onPress={() => setDatePickerVisible(true)} style={styles.datePicker}>
                <DateIcon style={{ transform: [{ scale: 1 }] }} />
                <Text style={styles.dateText}>{selectedDate.toDateString()}</Text>
              </TouchableOpacity>
            </View>

            {/* Time Pickers */}
            <View style={styles.timePickerWrapper}>
              <TouchableOpacity onPress={() => setStartTimePickerVisible(true)} style={styles.timePicker}>
                <Text style={styles.labelText}>Start Time</Text>
                <View style={styles.timePickerInput}>
                  <TimeIcon style={{ transform: [{ scale: 1 }] }} />
                  <Text style={styles.timeText}>{selectedStartTime.toLocaleTimeString()}</Text>
                  <DropdownIcon style={{ transform: [{ scale: 1 }] }} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setEndTimePickerVisible(true)} style={styles.timePicker}>
                <Text style={styles.labelText}>End Time</Text>
                <View style={styles.timePickerInput}>
                  <TimeIcon style={{ transform: [{ scale: 1 }] }} />
                  <Text style={styles.timeText}>{selectedEndTime.toLocaleTimeString()}</Text>
                  <DropdownIcon style={{ transform: [{ scale: 1 }] }} />
                </View>
              </TouchableOpacity>
            </View>

            {/* Create Group Button */}
            <View style={styles.createGroupButtonWrapper}>
              <TouchableOpacity onPress={handleCreateGroup} style={styles.createGroupButton} disabled={loading}>
              {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.createGroupButtonText}>Create Group</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Date Picker Modals */}
            <DatePicker
              modal
              open={isDatePickerVisible}
              date={selectedDate}
              mode="date"
              minimumDate={new Date()}
              maximumDate={new Date(new Date().setMonth(new Date().getMonth() + 1))}
              onConfirm={date => {
                setDatePickerVisible(false);
                setSelectedDate(date);
              }}
              onCancel={() => {
                setDatePickerVisible(false);
              }}
            />
            <DatePicker
              modal
              open={isStartTimePickerVisible}
              date={selectedStartTime}
              mode="time"
              onConfirm={time => {
                setStartTimePickerVisible(false);
                setSelectedStartTime(time);
              }}
              onCancel={() => {
                setStartTimePickerVisible(false);
              }}
            />
            <DatePicker
              modal
              open={isEndTimePickerVisible}
              date={selectedEndTime}
              mode="time"
              onConfirm={time => {
                setEndTimePickerVisible(false);
                setSelectedEndTime(time);
              }}
              onCancel={() => {
                setEndTimePickerVisible(false);
              }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingBottom: hp('1%'),
  },
  header: {
    height: '12%',
    width: '100%',
    justifyContent: 'space-between',
    marginLeft: '8%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  backButton: {
    width: '10%',
  },
  titleWrapper: {
    width: '85%',
  },
  title: {
    fontFamily: FontFamily.nunitoSemiBold,
    fontSize: 25,
  },
  inputWrapper: {
    width: '90%',
    marginVertical: hp('0.8%'),
  },
  labelText: {
    color: '#1E232C',
    fontFamily: FontFamily.nunitoSemiBold,
    fontSize: hp('2.1%'),
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderRadius: 10,
    color: 'black',
    borderColor: '#D0E5E5',
    borderWidth: 1,
    paddingHorizontal: 10,
    fontFamily: FontFamily.nunitoRegular,
    fontSize: hp('1.8%'),
    backgroundColor: 'white',
  },
  inputDesc: {
    height: "80%",
    borderRadius: 10,
    color: 'black',
    borderColor: '#D0E5E5',
    borderWidth: 1,
    paddingHorizontal: 10,
    fontFamily: FontFamily.nunitoRegular,
    fontSize: 16,
    backgroundColor: 'white',
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 10,
    borderColor: '#D0E5E5',
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  dateText: {
    fontFamily: FontFamily.nunitoSemiBold,
    fontSize: hp('1.8%'),
    marginLeft: hp('2%'),
    color: 'black',
  },
  timePickerWrapper: {
    height: '10%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  timePicker: {
    width: '45%',
  },
  timePickerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: 40,
    borderRadius: 10,
    borderColor: '#D0E5E5',
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  timeText: {
    fontFamily: FontFamily.nunitoRegular,
    fontSize: hp('1.7%'),
    marginLeft: '2%',
    color: 'black',
  },
  createGroupButtonWrapper: {
    height: '10%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createGroupButton: {
    height: '70%',
    width: '90%',
    borderRadius: 50,
    backgroundColor: Color.cyan1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createGroupButtonText: {
    color: 'white',
    fontFamily: FontFamily.nunitoRegular,
    fontSize: hp('2%'),
  },
});

export default CreateGroup;
