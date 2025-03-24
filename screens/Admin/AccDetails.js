import React from 'react';
import { View, Text, StyleSheet, Button, FlatList, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { BASE_URL } from '../../Components/constant/Url';

const AccDetails = ({ route }) => {
  const { user } = route.params;

  const handleVerifyUser = async () => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/admin/verify-user/${user._id}`,
        { status: 'Verified' }
      );
      Alert.alert('Success', 'User has been verified');
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'An error occurred';
      Alert.alert('Error', errorMessage);
    }
  };


  const renderImage = ({ item, index }) => {
    const isCollegeId = index === 0;
    const imageType = isCollegeId ? 'College ID' : 'Profile Image';

    if (item && item !== '') {
      return (
        <View style={styles.imageContainer}>
          <Image source={{ uri: item }} style={styles.image} />
          <Text style={styles.imageLabel}>{imageType}</Text>
        </View>
      );
    }

    return (
      <View style={styles.imageContainer}>
        <View style={styles.altImage}>
          <Text style={styles.altText}>{imageType}</Text>
        </View>
        <Text style={styles.imageLabel}>{imageType}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="account-circle" size={100} color="#007bff" />
      </View>
      <Text style={styles.label}>Name: {user.name}</Text>
      <Text style={styles.label}>Email: {user.email}</Text>
      <Text style={styles.label}>Phone: {user.phone}</Text>
      <Text style={styles.label}>ID: {user._id}</Text>
      <Text style={styles.label}>Hobbies: {user.hobbies.join(', ')}</Text>
      <Text style={[styles.label, { color: user.status === 'Un-Verified' ? 'red' : 'green' }]}>
        Status: {user.status}
      </Text>
      <Text style={styles.label}>Gender: {user.gender}</Text>
      <Text style={styles.label}>City: {user.city}</Text>

      <FlatList
        data={[user.collegeIdString, user.profileImage]}
        renderItem={renderImage}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.imageList}
      />

      {user.status === 'Un-Verified' ? (
        <Button title="Verify User" onPress={handleVerifyUser} />
      ) : (
        <Button title="Verified" disabled />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
    color: '#333',
  },
  imageList: {
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  imageLabel: {
    marginTop: 5,
    fontSize: 14,
    color: '#555',
  },
  altImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    backgroundColor: '#d3d3d3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  altText: {
    fontSize: 16,
    color: '#666',
  },
});

export default AccDetails;
