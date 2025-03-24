import React from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { BackIcon } from '../../../assets/AuthIcons';
import { useNavigation } from '@react-navigation/native';
import { useSignupContext } from '../../../Context/SignupContext';
import { styles } from '../Styles';

const AppSubmit = () => {
  const navigation = useNavigation();
  const { submitFinalSignup } = useSignupContext();
  const [loading, setLoading] = React.useState(false);

  const handleFinalSubmit = () => {
    submitFinalSignup()
    navigation.navigate("Login");
  };

  return (
    <View style={styles.appSubmitContainer}>
      {/* Back Button */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('PersonalDetails')}>
          <BackIcon style={styles.backIcon} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/Images/PassChange.png')}
            style={styles.image}
          />
        </View>

        {/* Text Section */}
        <View style={styles.textContainer}>
          <Text style={styles.labelText}>Submit Your Application</Text>
          <View style={styles.paraContainer}>
            <Text style={styles.paraText}>Pending Verification result within 2 hrs</Text>
            <Text style={[styles.paraText, { paddingTop: 10 }]}>Login With Your Email and Password</Text>
          </View>
        </View>

        {/* Home Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleFinalSubmit}
            style={styles.homeButton}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AppSubmit;