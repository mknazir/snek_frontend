import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import { BackIcon } from '../../../assets/AuthIcons';
import { FontFamily } from '../../../GlobalStyle';
import { useNavigation } from "@react-navigation/native";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const helpSupportData = [
  {
    label: "1. Account Setup and Profile Creation",
    info: "Step-by-step guidance on how to create an account, set up a profile, add photos, and write a bio. Include tips on creating a profile that stands out and ensures a better match experience."
  },
  {
    label: "2. Matching and Messaging Issues",
    info: "Assistance with how the matching algorithm works, how to send messages, and troubleshooting problems if matches or messages aren't showing up properly."
  },
  {
    label: "3. Subscription and Payment Support",
    info: "Clear instructions for users on how to upgrade their subscription plans, manage payments, and what to do in case of billing issues or subscription-related problems."
  },
  {
    label: "4. Privacy and Safety Concerns",
    info: "Resources on how to block or report users, maintain privacy, and tips for safe online dating. Include advice on spotting fake profiles or scammers and how to deal with uncomfortable situations."
  },
  {
    label: "5. Technical Troubleshooting",
    info: "Support for technical issues such as app crashes, login problems, notifications not working, or issues with GPS location services impacting the matching experience."
  }
];

const Help = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={{ height: 100, width: '90%', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => { navigation.navigate("Settings") }} style={{ width: '10%' }}>
            <BackIcon style={{ transform: [{ scale: 1.4 }] }} />
          </TouchableOpacity>

          <View style={{ width: '75%' }}>
            <Text style={[styles.labelText,{fontFamily: FontFamily.nunitoBold,fontSize: hp(2.5)}]}>Help and Support</Text>
          </View>
        </View>

        {helpSupportData.map((item, index) => (
          <View key={index} style={styles.helpItem}>
            <Text style={styles.labelText}>{item.label}</Text>
            <Text style={styles.infoText}>{item.info}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  labelText: {
    color: '#4E4559',
    fontFamily: FontFamily.nunitoSemiBold,
    fontSize: hp(2),
    marginLeft: '5%',
  },
  infoText: {
    color: '#4E4559',
    fontFamily: FontFamily.nunitoRegular,
    fontSize: hp(1.5),
    marginLeft: '5%',
  },
  helpItem: {
    width: '100%',
    padding: '2%',
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
  },
});

export default Help;
