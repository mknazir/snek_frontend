import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { BackIcon } from '../../../assets/AuthIcons';
import { Color } from '../../../GlobalStyle';
import { useNavigation } from '@react-navigation/native';
import { useSignupContext } from '../../../Context/SignupContext';
import { styles } from "../Styles";

const Hobby = () => {
  const navigation = useNavigation();
  const [selectedHobbies, setSelectedHobbies] = useState({});
  const [hobbies, setHobbies] = useState({});
  const [loading, setLoading] = useState(true);
  const { updateSignupData, signupData, fetchHobbies } = useSignupContext();

  useEffect(() => {
    fetchHobbies({ setHobbies, setLoading });
  }, []);

  const handleHobbySelect = (category, _id) => {
    setSelectedHobbies(prev => {
      const updatedCategoryHobbies = prev[category] || [];
      return {
        ...prev,
        [category]: updatedCategoryHobbies.includes(_id)
          ? updatedCategoryHobbies.filter(hobbyId => hobbyId !== _id)
          : [...updatedCategoryHobbies, _id],
      };
    });
  };

  const isSaveEnabled = () => {
    return Object.keys(hobbies).every(category => (selectedHobbies[category] || []).length > 3);
  };

  const handleSave = () => {
    if (!isSaveEnabled()) {
      ToastAndroid.showWithGravityAndOffset(
        'Please select at least one hobby from each category',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }

    const selectedHobbyIds = Object.values(selectedHobbies).flat();
    updateSignupData('hobbies', selectedHobbyIds);
    updateSignupData('preferences', { ...signupData.preferences, hobbies: selectedHobbyIds });

    navigation.navigate('PersonalDetails');
  };

  return (
    <View style={styles.hobbyContainercontainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('SignupForm')}>
          <BackIcon style={styles.backIcon} />
        </TouchableOpacity>
      </View>

      <Text style={styles.hobbyLabelText}>Your Hobbies</Text>

      {/* Scrollable List of Hobbies */}
      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {loading ? (
          <ActivityIndicator size="large" color={Color.cyan2} style={styles.loadingIndicator} />
        ) : (
          Object.entries(hobbies).map(([category, hobbyList]) => (
            <View key={category} style={styles.categoryContainer}>
              <Text style={styles.categoryTitle}>{category}</Text>
              <View style={styles.hobbyRow}>
                {hobbyList.map(hobby => (
                  <TouchableOpacity
                    key={hobby._id}
                    onPress={() => handleHobbySelect(category, hobby._id)}
                    style={[
                      styles.hobbyContainer,
                      {
                        backgroundColor: selectedHobbies[category]?.includes(hobby._id)
                          ? '#00999E'
                          : 'white',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.hobbyText,
                        {
                          color: selectedHobbies[category]?.includes(hobby._id) ? 'white' : '#00999E',
                        },
                      ]}
                    >
                      {hobby.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Save Button */}
      <View style={styles.hobbyButtonContainer}>
        <TouchableOpacity
          onPress={handleSave}
          style={[
            styles.saveButton,
            { opacity: isSaveEnabled() ? 1 : 0.5 },
          ]}
          disabled={!isSaveEnabled()}
        >
          <Text style={styles.buttonTextSave}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Hobby;
