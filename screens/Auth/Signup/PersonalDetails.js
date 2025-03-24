import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, ToastAndroid, TextInput } from 'react-native';
import { BackIcon, CameraIcon, UploadIcon } from '../../../assets/AuthIcons';
import { Color } from '../../../GlobalStyle';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { useSignupContext } from '../../../Context/SignupContext';
import { BASE_URL } from '../../../Components/constant/Url';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImageView from "react-native-image-viewing";
import collegesData from '../../../data/updated_colleges.json';
import { styles } from '../Styles';

const PersonalDetails = () => {
  const navigation = useNavigation();
  const [city, setCity] = useState(null);
  const [collegeName, setCollegeName] = useState(null);
  const [cities, setCities] = useState([]);
  const [collegesList, setCollegesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { updateSignupData, signupData, submitSignup } = useSignupContext();
  const [showCustomCollegeInput, setShowCustomCollegeInput] = useState(false);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [isCollegeIdImageViewVisible, setCollegeIdImageViewVisible] = useState(false);
  const [isProfileImageViewVisible, setProfileImageViewVisible] = useState(false);
  const [isAdditionalImageViewVisible, setAdditionalImageViewVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  useEffect(() => {
    const extractStates = () => {
      const uniqueStates = [...new Set(collegesData.map((college) => college['State']))];
      const stateOptions = uniqueStates.map((state) => ({ label: state, value: state }));
      setCities(stateOptions);
    };

    const extractColleges = () => {
      const colleges = collegesData.map((college) => ({
        label: college['Name of the College/Institution'],
        value: college['Name of the College/Institution'],
        state: college['State'],
      }));
      setCollegesList(colleges);
    };

    extractStates();
    extractColleges();
  }, []);



  const handleStateSelect = (item) => {
    setCity(item.value);
    updateSignupData('city', item.value);
    setShowCustomCollegeInput(false); // Reset custom input visibility
    const filtered = collegesList.filter((college) => college.state === item.value);
    setFilteredColleges([...filtered, { label: 'Other', value: 'Other' }]);
  };

  const handleCustomCollegeInput = (text) => {
    setCollegeName(text);
    updateSignupData('collegeName', text);
  };

  const handleCollegeSelect = (item) => {
    if (item.value === 'Other') {
      setShowCustomCollegeInput(true);
      setCollegeName(''); // Clear the college name when "Other" is selected
    } else {
      setShowCustomCollegeInput(false);
      setCollegeName(item.value);
      updateSignupData('collegeName', item.value);
    }
  };


  const submitForm = async () => {
    const missingFields = [];

    // Check for each required field and add to the list if missing
    if (!city) missingFields.push("City");
    if (!collegeName) missingFields.push("College Name");
    if (!profileImage) missingFields.push("Profile Image");
    if (!collegeIdImage) missingFields.push("College ID");

    const hasAtLeastOneAdditionalImage = uploadedImages.some(image => image !== null);
    if (!hasAtLeastOneAdditionalImage) missingFields.push("At least one Additional Image");

    if (missingFields.length > 0) {
      ToastAndroid.showWithGravityAndOffset(`Please provide: ${missingFields.join(", ")}`, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50,);
      return;
    }

    try {
      updateSignupData('city', city);
      updateSignupData('collegeName', collegeName);
      updateSignupData('profileImage', profileImage);
      updateSignupData('collegeIdString', collegeIdImage);

      // Transform `uploadedImages` into the required format
      const formattedAdditionalImages = uploadedImages
        .filter(image => image !== null && /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(image))
        .map((url, index) => ({ index, url })); // Add `index` and format correctly

      // Ensure the array is correctly formatted
      if (formattedAdditionalImages.some(image => !image.url)) {
        ToastAndroid.showWithGravityAndOffset("All additional images must have valid URLs", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50,);
        return;
      }

      updateSignupData("additionalImages", formattedAdditionalImages);

      const response = await submitSignup();
      if (response.error) {
        ToastAndroid.showWithGravityAndOffset(response.error, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50,);
      }
      if (response.success) {
        ToastAndroid.showWithGravityAndOffset('Signup Successful!', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50,);
        navigation.navigate('AppSubmit');
      }
    } catch (error) {
      ToastAndroid.showWithGravityAndOffset(error.message, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50,);
    } finally {
      setLoading(false); // Hide loader after processing
    }
  };


  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([null, null, null, null]);
  const [uploadingStates, setUploadingStates] = useState([false, false, false, false]);

  const handleResponseProfileImageWithCamera = async file => {
    if (!file) {
      ToastAndroid.showWithGravityAndOffset('No image selected', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50,);
      return;
    }

    const formData = new FormData();
    formData.append('photo', {
      uri: file.uri,
      type: file.type,
      name: file.fileName,
    });

    try {
      setIsLoading(true);

      const res = await fetch(`${BASE_URL}/admin/profileimages/upload`, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const resData = await res.json();

      if (res.ok) {
        const imageUrl = resData;
        setProfileImage(imageUrl); // Update the profile image state
        updateSignupData('profileImage', imageUrl); // Update the context data
        ToastAndroid.showWithGravityAndOffset('Profile image uploaded successfully', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50,);
      } else {
        ToastAndroid.showWithGravityAndOffset(resData.error || 'Upload failed', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50,);
      }
    } catch (error) {
      ToastAndroid.showWithGravityAndOffset(error.message, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50,);
    } finally {
      setIsLoading(false);
    }
  };

  const openLibraryForAdditionalImage = index => {
    const options = { mediaType: 'photo', includeBase64: false };
    launchImageLibrary(options, response => handleResponseAdditionalImage(response, index));
  };

  const handleResponseAdditionalImage = async (response, index) => {
    if (response.didCancel) {
      ToastAndroid.showWithGravityAndOffset('User Cancelled', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50,);
    } else if (response.error) {
      ToastAndroid.showWithGravityAndOffset(response.error, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50,);
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
          if (index === -1) {
            setIsLoading(true);
          } else {
            const newLoadingStates = [...uploadingStates];
            newLoadingStates[index] = true;
            setUploadingStates(newLoadingStates);
          }

          const res = await fetch(
            `${BASE_URL}/admin/profileimages/upload`,
            {
              method: 'POST',
              body: formData,
              headers: { 'Content-Type': 'multipart/form-data' },
            },
          );
          const resData = await res.json();

          if (res.ok) {
            const imageUrl = resData;
            const newImages = [...uploadedImages];
            newImages[index] = imageUrl;
            setUploadedImages(newImages);

            // Ensure each image is properly indexed
            const formattedAdditionalImages = newImages
              .filter(image => image !== null)
              .map((url, i) => ({ index: i, url }));
            updateSignupData('additionalImages', formattedAdditionalImages);
          } else {
            ToastAndroid.showWithGravityAndOffset(resData.error, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50,);
          }
        } catch (error) {
          ToastAndroid.showWithGravityAndOffset(error.message, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50,);
        } finally {
          if (index === -1) {
            setIsLoading(false);
          } else {
            const newLoadingStates = [...uploadingStates];
            newLoadingStates[index] = false;
            setUploadingStates(newLoadingStates);
          }
        }
      }
    }
  };

  const [collegeIdLoading, setCollegeIdLoading] = useState(false);
  const [collegeIdImage, setCollegeIdImage] = useState(null);
  const [collegeIdFileName, setCollegeIdFileName] = useState('');

  const handleResponseCollegeId = async response => {
    if (response.didCancel) {
      ToastAndroid.showWithGravityAndOffset('User Cancelled', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50,);
    } else if (response.error) {
      ToastAndroid.showWithGravityAndOffset(response.error, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50,);
    } else {
      const file = response.assets?.[0];
      if (file) {
        const formData = new FormData();
        formData.append('photo', { uri: file.uri, type: file.type, name: file.fileName });

        try {
          setCollegeIdLoading(true);
          const res = await fetch(`${BASE_URL}/admin/collegeId/upload`,
            {
              method: 'POST',
              body: formData,
              headers: { 'Content-Type': 'multipart/form-data' },
            },
          );
          const resData = await res.json();

          if (res.ok) {
            const imageUrl = resData.imageUrl || resData.collegeIdLink;
            const fileName = file.fileName || resData.fileName || 'Unknown File';

            if (imageUrl) {
              setCollegeIdImage(imageUrl);
              setCollegeIdFileName(fileName);
              updateSignupData('collegeIdImage', imageUrl);
              updateSignupData('collegeIdString', fileName);
              ToastAndroid.showWithGravityAndOffset('Upload successful!', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50,);
            } else {
              ToastAndroid.showWithGravityAndOffset('Image URL not found in response', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50,);
            }
          } else {
            ToastAndroid.showWithGravityAndOffset(resData.error || 'Upload failed', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50,);
          }
        } catch (error) {
          ToastAndroid.showWithGravityAndOffset(error.message, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50,);
        } finally {
          setCollegeIdLoading(false);
        }
      }
    }
  };

  const openCollegeIdPicker = () => {
    const options = { mediaType: 'photo', includeBase64: false, maxHeight: 2000, maxWidth: 2000 };
    launchImageLibrary(options, handleResponseCollegeId);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.personalDetailsContainer}>
          <View style={styles.topView}>
            <TouchableOpacity onPress={() => navigation.navigate('Hobby')} style={{ width: '10%' }}>
              <BackIcon style={{ transform: [{ scale: 1 }] }} />
            </TouchableOpacity>

            <View style={{ width: '75%', paddingTop: 12 }}>
              <Text style={[styles.personalDetailsLabelText, { paddingTop: '5%' }]}> Personal Details </Text>
            </View>
          </View>

          <View style={{ width: '100%', height: '15%', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: '22%', height: '70%', borderRadius: 50, position: 'relative' }}>
              {isLoading ? (<ActivityIndicator size="large" color={Color.cyan1} />) :
                (
                  <>
                    <Image
                      source={{
                        uri: profileImage
                          ? profileImage
                          : "https://res.cloudinary.com/ds6fycdkk/image/upload/v1727985542/profile_quupi3.jpg", // Placeholder image
                      }}
                      style={styles.personalDetailsImage}
                    />
                    {profileImage && (
                      <MaterialIcons
                        name="zoom-out-map"
                        size={24}
                        color={Color.cyan1}
                        style={{ position: 'absolute', top: '5%', right: '2%' }}
                        onPress={() => setProfileImageViewVisible(true)}
                      />
                    )}
                    <ImageView
                      images={[
                        {
                          uri: profileImage
                            ? profileImage
                            : "https://res.cloudinary.com/ds6fycdkk/image/upload/v1727985542/profile_quupi3.jpg", // Placeholder image
                        },
                      ]}
                      imageIndex={0}
                      visible={isProfileImageViewVisible}
                      onRequestClose={() => setProfileImageViewVisible(false)}
                    />
                  </>
                )}
            </View>

            <TouchableOpacity
              onPress={() => {
                const options = {
                  mediaType: 'photo',
                  includeBase64: false,
                  maxHeight: 2000,
                  maxWidth: 2000,
                };
                launchCamera(options, response => {
                  if (response.didCancel) {
                    ToastAndroid.showWithGravityAndOffset('Camera operation cancelled', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50,);
                  } else if (response.errorCode) {
                    ToastAndroid.showWithGravityAndOffset(response.errorMessage, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50,);
                  } else {
                    const file = response.assets?.[0];
                    if (file) {
                      const formData = new FormData();
                      formData.append('photo', {
                        uri: file.uri,
                        type: file.type,
                        name: file.fileName,
                      });

                      handleResponseProfileImageWithCamera(file); // Use your function to handle the image
                    }
                  }
                });
              }}
              style={styles.cameraButton}>
              <CameraIcon style={{ transform: [{ scale: 1.5 }] }} />
            </TouchableOpacity>

          </View>

          <View style={{ height: 'auto' }}>
            <Text style={styles.uploadSelfieText}> {' '} Upload Selfie{' '} </Text>
          </View>

          <View style={styles.uploadButtonsContainer}>
            {uploadedImages.map((image, index) => (
              <View key={index} style={{ position: 'relative', height: '90%', width: '20%', }}>
                <TouchableOpacity style={styles.uploadButton} onPress={() => openLibraryForAdditionalImage(index)}>
                  {uploadingStates[index] ? (
                    <ActivityIndicator size="small" color={Color.cyan1} />
                  ) : image ? (
                    <Image source={{ uri: image }} style={styles.uploadedImage} />
                  ) : (
                    <UploadIcon style={{ transform: [{ scale: 1 }] }} />
                  )}
                </TouchableOpacity>
                {image && (
                  <MaterialIcons
                    name="zoom-out-map"
                    size={24}
                    color={Color.cyan1}
                    style={{ position: 'absolute', top: 5, right: 5 }}
                    onPress={() => {
                      setCurrentImageIndex(index);
                      setAdditionalImageViewVisible(true);
                    }}
                  />
                )}
              </View>
            ))}
          </View>
          <ImageView
            images={uploadedImages.filter(image => image !== null).map(image => ({ uri: image }))}
            imageIndex={currentImageIndex}
            visible={isAdditionalImageViewVisible}
            onRequestClose={() => setAdditionalImageViewVisible(false)}
          />

          <View style={{ width: '100%', marginLeft: '9%' }}>
            <Text style={[styles.requiredText, { paddingTop: 5 }]}> {' '} College ID*{' '} </Text>
          </View>

          <View style={styles.uploadColledeIdView}>
            <TouchableOpacity style={styles.collegeUploadIcon} onPress={openCollegeIdPicker}>
              {collegeIdLoading ? (<ActivityIndicator size="large" color={Color.cyan1} />) :
                collegeIdImage ? (
                  <View style={{ alignItems: 'center' }}>
                    <Image source={{ uri: collegeIdImage }} style={styles.uploadedCollegeIdImage} />
                    <MaterialIcons
                      name="zoom-out-map"
                      size={24}
                      color={Color.cyan1}
                      style={{ position: 'absolute', top: 5, right: 5 }}
                      onPress={() => setCollegeIdImageViewVisible(true)}
                    />
                    <Text style={styles.fileNameText}>{collegeIdFileName}</Text>
                  </View>
                ) : (
                  <>
                    <UploadIcon style={{ transform: [{ scale: 1.2 }] }} />
                    <Text style={[styles.requiredText, { marginTop: hp(1) }]}> {' '} Upload Image{' '} </Text>
                  </>
                )}
            </TouchableOpacity>
            <ImageView
              images={[{ uri: collegeIdImage }]}
              imageIndex={0}
              visible={isCollegeIdImageViewVisible}
              onRequestClose={() => setCollegeIdImageViewVisible(false)}
            />
          </View>

          <View style={styles.stateDropdownContainer}>
            <View style={styles.stateDropdownView}>
              <Text style={styles.requiredText}> State* </Text>
              {loading ? (<ActivityIndicator size="large" color={Color.cyan1} />) :
                (
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
                    onChange={handleStateSelect}
                    renderItem={item => (
                      <View style={{ padding: 10 }}>
                        <Text style={[styles.selectedTextStyle]}>
                          {' '}
                          {item.label}{' '}
                        </Text>
                      </View>
                    )}
                  />
                )}
            </View>

            <View style={styles.collegeDropdown}>
              <Text style={styles.requiredText}> College Name* </Text>
              {loading ? (<ActivityIndicator size="large" color={Color.cyan1} />) :
                (
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
                    renderItem={item => (
                      <View style={{ padding: 10 }}>
                        <Text style={[styles.selectedTextStyle]}> {' '} {item.label}{' '} </Text>
                      </View>
                    )}
                  />
                )}
            </View>
            {showCustomCollegeInput && (
              <View style={{ width: '90%' }}>
                <TextInput style={[styles.dropdown, styles.collegeInputText]}
                  placeholder="Enter your college name"
                  placeholderTextColor="#888"
                  onChangeText={handleCustomCollegeInput}
                  value={collegeName}
                />
              </View>
            )}
          </View>

          <View style={styles.sumbitFormView}>
            <TouchableOpacity onPress={submitForm} style={styles.sumitFormButton} disabled={loading}>
              <Text style={styles.submitLoadingText}> {loading ? "Loading..." : "Sign Up"} </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PersonalDetails;