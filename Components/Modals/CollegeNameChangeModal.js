import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  Image,
  TextInput,
} from 'react-native';
import { Color, FontFamily } from '../../GlobalStyle';
import { launchImageLibrary } from 'react-native-image-picker';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { UploadIcon } from '../../assets/AuthIcons';
import { Dropdown } from 'react-native-element-dropdown';
import { useAuth } from '../../Context/AuthContext';
import { BASE_URL } from '../constant/Url';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImageView  from "react-native-image-viewing";
import collegesData from '../../data/updated_colleges.json';



const CollegeNameChangeModal = ({ isVisible, onClose,  existingCity,existingCollegeName,existingCollegeIdImage, }) => {
  const [city, setCity] = useState(existingCity || null);
  const [collegeName, setCollegeName] = useState(existingCollegeName || null);
  const [collegeIdImage, setCollegeIdImage] = useState(existingCollegeIdImage || null);
  const [collegeIdFileName, setCollegeIdFileName] = useState('');
  const [collegeIdLoading, setCollegeIdLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [collegesList, setCollegesList] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [showCustomCollegeInput, setShowCustomCollegeInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageViewVisible, setImageViewVisible] = useState(false);

  const { userDetails } = useAuth();

  useEffect(() => {
    const extractStates = () => {
      const uniqueStates = [...new Set(collegesData.map((college) => college['State']))];
      const stateOptions = uniqueStates.map((state) => ({ label: state, value: state }));
      setCities(stateOptions); // Setting states instead of districts
    };
  
    const extractColleges = () => {
      const colleges = collegesData.map((college) => ({
        label: college['Name of the College/Institution'],
        value: college['Name of the College/Institution'],
        state: college['State'], // Changed from District to State
      }));
      setCollegesList(colleges);
    };
  
    extractStates();
    extractColleges();
  }, []);
  
  useEffect(() => {
    if (existingCity) {
      setCity(existingCity);
      filterCollegesByState(existingCity); // Ensure the state is selected first
    }
  }, [existingCity, collegesList]);
  
  useEffect(() => {
    if (existingCollegeName) {
      const collegeExists = collegesList.some(college => college.value === existingCollegeName);
      if (collegeExists) {
        setCollegeName(existingCollegeName);
      }
    }
  }, [collegesList, existingCollegeName, filteredColleges]);
  

  const filterCollegesByState = (selectedState) => {
    const filtered = collegesList.filter((college) => college.state === selectedState);
    
    if (existingCollegeName && !filtered.some(college => college.value === existingCollegeName)) {
      filtered.push({ label: existingCollegeName, value: existingCollegeName });
    }
  
    setFilteredColleges([...filtered, { label: 'Other', value: 'Other' }]);
  };
  
  
  const handleCitySelect = (item) => {
    setCity(item.value);
    setShowCustomCollegeInput(false);
    filterCollegesByState(item.value); // Now filtering colleges by State
  };
  const handleCollegeSelect = (item) => {
    if (item.value === 'Other') {
      setShowCustomCollegeInput(true);
      setCollegeName('');
    } else {
      setShowCustomCollegeInput(false);
      setCollegeName(item.value);
    }
  };

  const handleCustomCollegeInput = (text) => {
    setCollegeName(text);
  };
 

  const handleResponseCollegeId = async (response) => {
    if (response.didCancel) {
      ToastAndroid.showWithGravityAndOffset(
        'User Cancelled',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } else if (response.error) {
      ToastAndroid.showWithGravityAndOffset(
        response.error,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } else {
      const file = response.assets?.[0];
      if (file) {
        const formData = new FormData();
        formData.append('photo', {
          uri: file.uri,
          type: file.type,
          name: file.fileName,
        });

        try {
          setCollegeIdLoading(true);
          const res = await fetch(
            `${BASE_URL}/admin/collegeId/upload`,
            {
              method: 'POST',
              body: formData,
              headers: { 'Content-Type': 'multipart/form-data' },
            }
          );
          const resData = await res.json();

          if (res.ok) {
            const imageUrl = resData.imageUrl || resData.collegeIdLink;
            const fileName =
              file.fileName || resData.fileName || 'Unknown File';

            if (imageUrl) {
              setCollegeIdImage(imageUrl);
              setCollegeIdFileName(fileName);
              ToastAndroid.showWithGravityAndOffset(
                'Upload successful!',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
              );
            } else {
              ToastAndroid.showWithGravityAndOffset(
                'Image URL not found in response',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
              );
            }
          } else {
            ToastAndroid.showWithGravityAndOffset(
              resData.error || 'Upload failed',
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50
            );
          }
        } catch (error) {
          ToastAndroid.showWithGravityAndOffset(
            error.message,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
          );
        } finally {
          setCollegeIdLoading(false);
        }
      }
    }
  };

  const openCollegeIdPicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };
    launchImageLibrary(options, handleResponseCollegeId);
  };

  const extractImageId = (url) => {
    if (!url) return null;
    const match = url.match(/\/([\w-]+)\.jpg$/); // Extract the part before .jpg
    return match ? match[1] : null;
  };
  

  const handleSubmit = async () => {
    const newImageId = extractImageId(collegeIdImage);
    const existingImageId = extractImageId(existingCollegeIdImage);
  
    // Case 1: If no field has been updated
    if (
      collegeName === existingCollegeName &&
      newImageId === existingImageId
    ) {
      ToastAndroid.showWithGravityAndOffset(
        'Please update at least one field before submitting.',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }
  
    // Case 2: If only the college name is updated but not the image
    if (collegeName !== existingCollegeName && newImageId === existingImageId) {
      ToastAndroid.showWithGravityAndOffset(
        'Please upload a new College ID Image before submitting.',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }
  
    // Case 3: If only the image is updated but not the college name
    if (collegeName === existingCollegeName && newImageId !== existingImageId) {
      ToastAndroid.showWithGravityAndOffset(
        'Please update the College Name before submitting.',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }


    try {
      setIsLoading(true);
      const response = await fetch(
        `${BASE_URL}/update/college-detals`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userDetails._id,
            city,
            collegeName,
            collegeIdImage,
          }),
        }
      );
      const resData = await response.json();

      if (response.ok) {
        ToastAndroid.showWithGravityAndOffset(
          'College details updated successfully',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );

        setCity(null);
        setCollegeName(null);
        setCollegeIdImage(null);
        setCollegeIdFileName('');

          // Close the modal after success
          onClose();
      } else {
        throw new Error(resData.error || 'Failed to update details');
      }
    } catch (error) {
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Change College Name</Text>

          <View
            style={{
              width: '100%',
              height: 200,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                width: '90%',
                height: '40%',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.requiredText}> State* </Text>
              {loading ? (
                <ActivityIndicator size="large" color={Color.cyan1} />
              ) : (
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={cities}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Select State"
                  searchPlaceholder="Search..."
                  value={city}
                  onChange={handleCitySelect}
                  renderItem={(item) => (
                    <View style={{ padding: 10 }}>
                      <Text style={[styles.selectedTextStyle]}>
                        {item.label}
                      </Text>
                    </View>
                  )}
                />
              )}
            </View>

            <View
              style={{
                width: '90%',
                height: '50%',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.requiredText}> College Name* </Text>
              {loading ? (
                <ActivityIndicator size="large" color={Color.cyan1} />
              ) : (
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={filteredColleges}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="College Name"
                  searchPlaceholder="Search..."
                  value={collegeName}
                  onChange={handleCollegeSelect}
                  renderItem={(item) => (
                    <View style={{ padding: 10 }}>
                      <Text style={[styles.selectedTextStyle]}>
                        {item.label}
                      </Text>
                    </View>
                  )}
                />
              )}
              {showCustomCollegeInput && (
                <View style={{ width: '100%', height: '20%' }}>
                  <TextInput
                    style={{
                      ...styles.dropdown,
                      paddingLeft: 10,
                      height: 50,
                      marginTop: 10,
                    }}
                    placeholder="Enter your college name"
                    placeholderTextColor="#888"
                    onChangeText={handleCustomCollegeInput}
                    value={collegeName}
                  />
                </View>
              )}
            </View>
          </View>

          <View
            style={{
              height: 200,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 50,
            }}>
            <View style={styles.collegeUploadIcon}>
  {collegeIdLoading ? (
    <ActivityIndicator size="large" color={Color.cyan1} />
  ) : (
    <>
      {/* Display Image */}
      {collegeIdImage && (
        <Image source={{ uri: collegeIdImage }} style={styles.uploadedCollegeIdImage} />
      )}

      {collegeIdFileName&&(
        <Text style={styles.fileNameText}>{collegeIdFileName}</Text>
      )}

      {/* Upload Icon */}
      <TouchableOpacity
        onPress={openCollegeIdPicker}
        style={styles.uploadIcon}
      >
        <UploadIcon style={{ transform: [{ scale: 1.2 }] }} />
      </TouchableOpacity>

      {/* Zoom Icon */}
      {collegeIdImage && (
        <TouchableOpacity
          onPress={() => setImageViewVisible(true)}
          style={styles.zoomIcon}
        >
          <MaterialIcons name="zoom-out-map" size={25} color="white" />
        </TouchableOpacity>
      )}

      {/* Display Placeholder Text if no image */}
      {!collegeIdImage && (
        <Text style={[styles.requiredText, { marginTop: hp(1) }]}>Upload Image</Text>
      )}
    </>
  )}
</View>

          </View>

          <ImageView
            images={[{ uri: collegeIdImage }]} // Show only the uploaded image
            imageIndex={0}
            visible={isImageViewVisible}
            onRequestClose={() => setImageViewVisible(false)}
            renderFooter={(image) => (
              <View style={{ padding: 10, alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 16 }}>
                  College ID Preview
                </Text>
              </View>
            )}
          />

          <View
            style={{
              flexDirection: 'row',
              width: '90%',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={handleSubmit}>
              <Text style={styles.closeButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: hp('1.8%'),
    marginBottom: 20,
    color: 'black',
    fontFamily: FontFamily.nunitoBold,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#66B2B2',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: hp('1.5%'),
    textAlign: 'center',
    fontFamily: FontFamily.nunitoLight,
  },
  collegeUploadIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '80%',
    width: '90%',
    borderColor: Color.cyan1,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 10,
    position: 'relative', // Allows absolute positioning for children
    overflow: 'hidden', // Ensures the image stays within the container
  },
  uploadedCollegeIdImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    resizeMode: 'contain',
  },
  uploadIcon: {
    position: 'absolute',
    bottom: 10, // Position near the bottom of the container
    right: 10, // Align to the right side
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent background
    borderRadius: 15,
    padding: 5,
  },
  zoomIcon: {
    position: 'absolute',
    top: 10, // Position near the top of the container
    right: 10, // Align to the right side
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    borderRadius: 15,
    padding: 5,
  },
  fileNameText: {
    fontSize: 14,
    fontFamily: FontFamily.nunitoRegular,
    color: '#121212',
    marginTop: 5,
  },
  requiredText: {
    fontSize: hp('1.8%'),
    fontFamily: FontFamily.nunitoSemiBold,
    color: '#121212',
    paddingBottom: 10,
  },
  dropdown: {
    height: 50,
    width: '100%',
    borderRadius: 10,
    borderColor: Color.cyan1,
    borderWidth: 1,
    fontFamily: FontFamily.nunitoRegular,
    fontSize: 15,
    color: 'black'
  },
  placeholderStyle: {
    fontSize: 16,
    fontFamily: FontFamily.nunitoRegular,
    paddingLeft: '5%',
    color: 'black'
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: FontFamily.nunitoRegular,
    color: 'black'
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    fontFamily: FontFamily.nunitoRegular,
    color: 'black'
  },
});

export default CollegeNameChangeModal;
