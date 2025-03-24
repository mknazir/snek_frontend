import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Color, FontFamily } from '../../GlobalStyle';
import { BackIcon } from '../../assets/ProfileIcons'; // Adjust imports based on your icons
import { useNavigation } from "@react-navigation/native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '../../Components/constant/Url';
import { useAuth } from '../../Context/AuthContext';
import { useChat } from '../../Context/ChatContext';

const Report = ({ route }) => {
  const navigation = useNavigation();
  const { userDetails } = useAuth();
  const { fetchBlockedUsers } = useChat();

  const { receiverId } = route.params;

  // Array of reasons for reporting
  const reportReasons = ["Spam", "Harassment", "Inappropriate", "Fake", "Other"];

  // State to store the selected reason
  const [selectedReason, setSelectedReason] = useState(null);
  const [otherReason, setOtherReason] = useState('');

  const handleReasonSelect = (reason) => {
    setSelectedReason(reason); // Update selected reason
  };

  const handleReportSubmit = async () => {
    const data = {
      blockerId: userDetails?._id,
      blockedId: receiverId,
      reason: selectedReason === "Other" ? otherReason : selectedReason,
    };
    try {
      if (!selectedReason) {
        throw new Error("Please select a reason for reporting.");
      }
      const res = await fetch(`${BASE_URL}/block`, {
        body: JSON.stringify(data),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await res.json();

      if (res.ok) {
        Alert.alert("Success", "User has been successfully blocked.");
      } else {
        throw new Error(result.message || 'Failed to block user');
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to block user.");
    } finally {
      fetchBlockedUsers();
      navigation.navigate('Chat')
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.navigate('Chat')} style={styles.backButton}>
                <BackIcon style={{ transform: [{ scale: 1.2 }] }} />
              </TouchableOpacity>
              <Text style={styles.labelText}>Report</Text>
            </View>

            {/* Map through report reasons and display them */}
            {reportReasons.map((reason, index) => (
              <TouchableOpacity
                key={index}
                style={styles.settingItems}
                onPress={() => handleReasonSelect(reason)}
              >
                <View style={styles.settingItemsLeft}>
                  <View
                    style={[
                      styles.settingsIconItems,
                      selectedReason === reason && { backgroundColor: '#66B2B2' }, // Change background if selected
                    ]}
                  />
                  <Text style={[styles.labelText]}>{reason}</Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* Conditionally show the text input only when "Other" is selected */}
            {selectedReason === "Other" && (
              <View style={[styles.inputWrapper, { height: '22%', marginLeft: hp('2%') }]}>
                <Text style={[styles.labelText, { marginBottom: '1%' }]}>Any Specific Reason</Text>
                <TextInput
                  style={styles.inputDesc}
                  placeholder="reason..."
                  placeholderTextColor="#6A707C"
                  multiline={true}
                  textAlignVertical="top"
                  value={otherReason}
                  onChangeText={setOtherReason}
                />
              </View>
            )}


            {/* Create Group Button */}
            <View style={styles.createGroupButtonWrapper}>
              <TouchableOpacity style={styles.createGroupButton} onPress={handleReportSubmit}>
                <Text style={styles.createGroupButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>

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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
  },
  header: {
    height: 100,
    width: '100%',
    marginLeft: hp('1.8%'),
    alignItems: 'center',
    flexDirection: 'row',
  },
  backButton: {
    width: '10%',
  },
  labelText: {
    color: '#4E4559',
    fontFamily: FontFamily.nunitoSemiBold,
    fontSize: hp(2),
    marginLeft: hp('1%'),
  },
  settingItems: {
    height: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '2%',
    marginTop: '2%',
  },
  settingItemsLeft: {
    width: '65%',
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
  },
  settingsIconItems: {
    height: '70%',
    width: '12%',
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#66B2B2',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Default background color
  },
  inputWrapper: {
    width: '90%',
    marginVertical: hp('0.8%'),
  },
  inputDesc: {
    height: "80%",
    borderRadius: 10,
    borderColor: '#D0E5E5',
    borderWidth: 1,
    paddingHorizontal: 10,
    fontFamily: FontFamily.nunitoRegular,
    fontSize: 16,
    backgroundColor: 'white',
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

export default Report;
