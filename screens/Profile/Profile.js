import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ToastAndroid, ActivityIndicator, RefreshControl } from 'react-native';
import { Color, FontFamily } from '../../GlobalStyle';
import { CameraIcon, RightArrowIcon, SettingsIcon, EditIcon } from '../../assets/ProfileIcons';
import { useNavigation } from "@react-navigation/native";
import { UploadIcon } from '../../assets/AuthIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import CollegeNameChangeModal from '../../Components/Modals/CollegeNameChangeModal';
import { useAuth } from '../../Context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../Components/constant/Url';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImageView  from "react-native-image-viewing";


const Profile = () => {
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState('https://res.cloudinary.com/ds6fycdkk/image/upload/v1727985542/profile_quupi3.jpg');
  const [imgLoading, setImgLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([null, null, null, null]); // For the 4 upload buttons
  const [uploadingStates, setUploadingStates] = useState([false, false, false, false]); // Loading state for each button
  const [isModalVisible, setModalVisible] = useState(false);
  const { userDetails, isLoading, fetchUserDetails } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [isImageViewVisible, setImageViewVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);// For the image view modal

 
  useEffect(() => {
    if (userDetails?.profileImage) {
      setSelectedImage(userDetails.profileImage);
    }
  }, [userDetails]);

  useEffect(() => {
    if (userDetails?.additionalImages) {
      // Ensure the array always has 4 entries with consistent indexing
      const initializedImages = Array(4).fill({ index: null, url: null });
      userDetails.additionalImages.forEach((image) => {
        if (image?.index >= 0 && image?.index < 4) {
          initializedImages[image?.index] = image;
        }
      });
      setUploadedImages(initializedImages);
    }
  }, [userDetails]);



  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Fetch user details again
      const token = await AsyncStorage.getItem('loginToken');
      const userId = await AsyncStorage.getItem('userId');
      if (userId && token) {
        await fetchUserDetails(userId, token);
      } else {
        ToastAndroid.showWithGravityAndOffset("Unable to refresh. Please log in again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
      }
    } catch (error) {
      ToastAndroid.showWithGravityAndOffset(error.message, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
    } finally {
      setRefreshing(false);
    }
  }, [fetchUserDetails]);


  const openAdditionalImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };
    launchImageLibrary(options, response => handleAdditionalImageResponse(response, -1)); // -1 to indicate this is the profile image
  };

  const handleAdditionalImageResponse = async (response, index) => {
    if (response.didCancel) {
      ToastAndroid.showWithGravityAndOffset('User Cancelled', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
    } else if (response.error) {
      ToastAndroid.showWithGravityAndOffset(response.error, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
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
          // Start loading indicator for specific upload button or profile
          if (index === -1) {
            setImgLoading(true); // Profile image loading
          } else {
            const newLoadingStates = [...uploadingStates];
            newLoadingStates[index] = true; // Start loading for the specific button
            setUploadingStates(newLoadingStates);
          }

          const res = await fetch(`${BASE_URL}/admin/profileimages/upload`,
            {
              method: 'POST',
              body: formData,
              headers: { 'Content-Type': 'multipart/form-data' },
            },
          );
          const resData = await res.json();
          if (res.ok) {
            if (index === -1) {
              setSelectedImage(resData); // Assuming resData contains the image URL
            } else {
              const newImages = [...uploadedImages];
              newImages[index] = resData; // Assuming resData contains the image URL
              setUploadedImages(newImages);
            }
          } else {
            ToastAndroid.showWithGravityAndOffset(resData.error, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
          }
        } catch (error) {
          ToastAndroid.showWithGravityAndOffset(error.message, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        } finally {
          if (index === -1) {
            setImgLoading(false); // Stop profile image loading
          } else {
            const newLoadingStates = [...uploadingStates];
            newLoadingStates[index] = false; // Stop loading for the specific button
            setUploadingStates(newLoadingStates);
          }
        }
      }
    }
  };


  const handleUpload = async (index) => {
    const options = { mediaType: 'photo', includeBase64: false };
    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        ToastAndroid.showWithGravityAndOffset("Upload canceled.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        return;
      }
      if (response.error) {
        ToastAndroid.showWithGravityAndOffset(response.error, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        return;
      }

      const file = response.assets?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("photo", {
        uri: file.uri,
        type: file.type,
        name: file.fileName,
      });

      try {
        // Start loading indicator
        const newLoadingStates = [...uploadingStates];
        newLoadingStates[index] = true;
        setUploadingStates(newLoadingStates);

        // Upload the image
        const uploadResponse = await fetch(
          `${BASE_URL}/admin/profileimages/upload`,
          {
            method: "POST",
            body: formData,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok) {
          ToastAndroid.showWithGravityAndOffset(
            uploadResult.error || "Image upload failed.",
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
          );
          return;
        }

        // Update image in the database using the index
        const updateResponse = await fetch(
          `${BASE_URL}/update/additional-image`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${await AsyncStorage.getItem("loginToken")}`,
            },
            body: JSON.stringify({
              userId: userDetails._id,
              index, // Use the index of the image being updated
              url: uploadResult, // New image URL from upload
            }),
          }
        );

        const updateResult = await updateResponse.json();

        if (updateResponse.ok) {
          // Update local state
          const updatedImages = [...uploadedImages];
          updatedImages[index] = { index, url: uploadResult }; // Keep consistency with backend structure
          setUploadedImages(updatedImages);

          ToastAndroid.showWithGravityAndOffset(
            "Image updated successfully.",
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
          );
        } else {
          ToastAndroid.showWithGravityAndOffset(
            updateResult.error || "Failed to update the image.",
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
          );
        }
      } catch (error) {
        ToastAndroid.showWithGravityAndOffset(
          error.message || "An error occurred.",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      } finally {
        // Stop loading indicator
        const newLoadingStates = [...uploadingStates];
        newLoadingStates[index] = false;
        setUploadingStates(newLoadingStates);
      }
    });
  };


  const openProfileImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };
    launchImageLibrary(options, handleProfileImageUpload);
  };

  const handleProfileImageUpload = async (response) => {
    if (response.didCancel) {
      ToastAndroid.showWithGravityAndOffset('User Cancelled', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
    } else if (response.error) {
      ToastAndroid.showWithGravityAndOffset(response.error, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
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
          setImgLoading(true); // Start loading indicator

          // Upload the image
          const uploadResponse = await fetch(`${BASE_URL}/admin/profileimages/upload`, {
            method: 'POST',
            body: formData,
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          const uploadResult = await uploadResponse.json();

          if (uploadResponse.ok) {
            // Update profile image on the backend
            const updateResponse = await fetch(`${BASE_URL}/update/profile-image`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${await AsyncStorage.getItem('loginToken')}`,
              },
              body: JSON.stringify({
                userId: userDetails._id,
                profileImage: uploadResult, // Assuming the API returns the image URL
              }),
            });

            const updateResult = await updateResponse.json();

            if (updateResponse.ok) {
              setSelectedImage(uploadResult); // Update local state
              await fetchUserDetails(userDetails._id, await AsyncStorage.getItem('loginToken')); // Refresh user details
              ToastAndroid.showWithGravityAndOffset('Profile image updated successfully.', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            } else {
              ToastAndroid.showWithGravityAndOffset(updateResult.error || 'Failed to update profile image.', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            }
          } else {
            ToastAndroid.showWithGravityAndOffset(uploadResult.error || 'Image upload failed.', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
          }
        } catch (error) {
          ToastAndroid.showWithGravityAndOffset(error.message || 'An error occurred.', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        } finally {
          setImgLoading(false); // Stop loading indicator
        }
      }
    }
  };


  const openImageViewer = (index, isProfileImage = false) => {
    if (isProfileImage) {
      setCurrentImageIndex(0); // Profile Image is always first in array
    } else {
      const actualIndex = index + 1; // Shift index to account for the profile image
      setCurrentImageIndex(actualIndex);
    }
    setImageViewVisible(true);
  };
  
  

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color={Color.cyan1} />
      </View>
    );
  }

  if (!userDetails) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
        <Text style={styles.errorText}>Failed to load user details</Text>
      </View>
    );
  }

  const {
    name,
    email,
    phone,
    collegeName,
    additionalImages,
  } = userDetails;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Color.cyan1]} />
      }
    >
      <View style={styles.container}>
        <View style={{ height: '10%', width: '100%', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingHorizontal: '2%' }}>
          <View style={{ width: '85%' }}>
            <Text style={styles.labelText}>Personal Details</Text>
          </View>
        </View>

        <View style={{ width: '100%', height: '15%', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '20%', height: '70%', borderRadius: 50, position: 'relative' }}>
            {imgLoading ? (
              <ActivityIndicator size="large" color={Color.cyan1} />
            ) : (
              <>
                <TouchableOpacity onPress={() => openImageViewer(0, true)}>
                  <Image source={{ uri: selectedImage }} style={styles.image} />
                </TouchableOpacity>
                {/* Zoom Icon Overlay */}
                <TouchableOpacity onPress={() => openImageViewer(0, true)} style={styles.zoomIcon}>
                  <MaterialIcons name="zoom-out-map" size={25} color="white" />
                </TouchableOpacity>
              </>
            )}
          </View>

          <TouchableOpacity onPress={openProfileImagePicker} style={styles.cameraButton}>
            <CameraIcon style={{ transform: [{ scale: 1.5 }] }} />
          </TouchableOpacity>
        </View>

        <View style={styles.uploadButtonsContainer}>
            {uploadedImages.map((image, index) => (
              <View key={index} style={styles.uploadButtonWrapper}>
                {/* Display Image if Uploaded */}
                {image?.url ? (
                  <Image source={{ uri: image.url }} style={styles.uploadedImage} />
                ) : (
                  <View style={styles.uploadPlaceholder} />
                )}

                {/* Upload Icon (Clickable only wh  en no image is uploaded) */}
                {!image?.url && (
                  <TouchableOpacity onPress={() => handleUpload(index)} style={styles.uploadIconOnly}>
                    <UploadIcon style={{ transform: [{ scale: 1.2 }] }} />
                  </TouchableOpacity>
                )}

                {/* Overlay Upload Icon (Always visible when an image exists) */}
                {image?.url && (
                  <TouchableOpacity onPress={() => handleUpload(index)} style={styles.overlayUploadIcon}>
                    <UploadIcon style={{ transform: [{ scale: 1.2 }] }} />
                  </TouchableOpacity>
                )}

                {/* Zoom Icon for Enlarged Image View */}
                {image?.url && (
                  <TouchableOpacity onPress={() => openImageViewer(index, false)} style={styles.zoomIcon}>
                    <MaterialIcons name="zoom-out-map" size={25} color="white" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          <ImageView
            images={[
              { uri: selectedImage },  
              ...uploadedImages
                .filter((img) => img?.url)  
                .map((img) => ({ uri: img.url }))
            ]}
            imageIndex={currentImageIndex}
            visible={isImageViewVisible}
            onRequestClose={() => setImageViewVisible(false)}
            renderFooter={(image) => (
              <View style={{ padding: 10, alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 16 }}>
                  {image?.uri ? `Preview: ${image.uri}` : 'Image Preview'}
                </Text>
              </View>
            )}
          />




        {/* Personal Information */}
        <View style={[styles.inputWrapper,{marginVertical:'1%'}]}>
          <Text style={styles.labelText}>Student Name</Text>
          <View style={styles.input}>
            <Text style={styles.inputText}>{name}</Text>
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.labelText}>Email</Text>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: 50 }}>
            <View style={[styles.input, { width: '100%' }]}>
              <Text style={styles.inputText}>{email}</Text>
            </View>

            {/* <TouchableOpacity style={{ width: '10%', height: '100%', backgroundColor: '#66B2B2', alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
            <EditIcon style={{ transform: [{ scale: 1 }] }} />
          </TouchableOpacity> */}
          </View>

        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.labelText}>Mobile Number</Text>
          <View style={styles.input}>
            <Text style={styles.inputText}>{phone}</Text>
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.labelText}>College Name</Text>

          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: 50 }}>
            <View style={[styles.input, { width: '85%' }]}>
              <Text style={styles.inputText}>{collegeName}</Text>
            </View>

            <TouchableOpacity onPress={() => setModalVisible(true)} style={{ width: '12%', height: '90%', backgroundColor: '#66B2B2', alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
              <EditIcon style={{ transform: [{ scale: 1 }] }} />
            </TouchableOpacity>

          </View>

        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.labelText}>Settings</Text>
          <TouchableOpacity style={styles.input} onPress={() => navigation.navigate('Settings')}>
            <View style={styles.settingsContent}>
              <SettingsIcon style={{ transform: [{ scale: 1.5 }] }} />
              <Text style={styles.inputText}>Settings</Text>
              <RightArrowIcon style={{ transform: [{ scale: 1.5 }] }} />
            </View>
          </TouchableOpacity>
        </View>

        {isModalVisible && (
          <CollegeNameChangeModal
            isVisible={isModalVisible}
            onClose={() => setModalVisible(false)}
            existingCity={userDetails.city}
            existingCollegeName={userDetails.collegeName}
            existingCollegeIdImage={userDetails.collegeIdString}
          />
        )}

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
  },
  labelText: {
    color: '#4E4559',
    fontFamily: FontFamily.nunitoSemiBold,
    fontSize: 18,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 50,
  },
  cameraButton: {
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 2,
    bottom: "10%",
    right: "41%",
  },
  uploadButtonsContainer: {
    width: '100%',
    height: '11%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: '5%',
    marginTop: '5%',
    marginBottom:'5%'
  },
  uploadButton: {
    borderColor: Color.cyan1,
    borderWidth: 1,
    height: '90%',
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonWrapper: {
    position: 'relative',
    width: '22%',
    aspectRatio: 1,
  },
  uploadPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E0E0E0',
    borderColor: Color.cyan1,
    borderWidth: 1,
    borderRadius: 10,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
  uploadIconOnly: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  overlayUploadIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 15,
    padding: 5,
  },
  zoomIcon: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    padding: 5,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  inputWrapper: {
    width: '90%',
    marginVertical: '1%',
  },
  input: {
    height: 50,
    borderRadius: 10,
    borderColor: '#D0E5E5',
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  inputText: {
    fontFamily: FontFamily.nunitoRegular,
    fontSize: 15,
    color: '#1E232C',
  },
  settingsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
});

export default Profile;
