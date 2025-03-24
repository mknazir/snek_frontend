import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Color, FontFamily } from '../../GlobalStyle';
import { RefreshIcon, FilterIcon } from '../../assets/HomeIcons';
import TinderCardSwipe from './TinderCardSwipe';
import SwipeFilter from '../../Components/Modals/SwipeFilter';
import { useAuth } from '../../Context/AuthContext';
import { BASE_URL } from '../../Components/constant/Url';
import { useSwipe } from '../../Context/SwipeContext';
import { useFocusEffect } from '@react-navigation/native';

const Home = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userData, setUserData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState(null); // State for city filter
  const [collegeName, setCollegeName] = useState(null); // State for college name filter

  const { userDetails, isLoading, fetchUserDetails } = useAuth();// Access userDetails and loading state
  const { selectedCity, setSelectedCity, selectedCollegeName, setSelectedCollegeName } = useSwipe();


  // Toggle modal visibility
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  // Fetch data from the API
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/feed/${userDetails?._id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const json = await response.json();

      setUserData(json.feed);
      setFilteredData(json.feed);
    } catch (err) {
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (city, collegeName) => {
    const filtered = userData.filter((user) => {
      const matchesCity = city ? user.city === city : true;
      const matchesCollege = collegeName ? user.collegeName === collegeName : true;
      return matchesCity && matchesCollege;
    });
    setFilteredData(filtered);
  };

  const resetFilters = () => {
    setSelectedCity(null);
    setSelectedCollegeName(null);
    setFilteredData(userData);
  };

  // Fetch user details when the screen is focused
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await fetchUserDetails(userDetails?._id);  // Ensures the latest status is fetched
        if (userDetails?._id) {
          fetchUserData(); // Fetch user data only if userDetails are available
        }
      };

      fetchData();
    }, [])
  );

  // Fetch user details and data when the component mounts
  useEffect(() => {
    const initialize = async () => {
      if (!userDetails) {
        await fetchUserDetails();
      }
      if (userDetails?._id) {
        fetchUserData();
      }
    };
    initialize();
  }, []); // Run only once

  // Refetch data when `userDetails` changes
  useEffect(() => {
    if (userDetails?._id) {
      fetchUserData();
    }
  }, [userDetails]);


  useEffect(() => {
    applyFilters(selectedCity, selectedCollegeName);
  }, [selectedCity, selectedCollegeName]);

  // Fetch data and refresh userDetails on refresh button click
  const handleRefresh = async () => {
    await fetchUserDetails(userDetails?._id); // Refresh user details
    fetchUserData();
  };

  // Show loader while loading
  if (isLoading || loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Color.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleRefresh}>
          <RefreshIcon style={{ transform: [{ scale: 1 }] }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleModal}>
          <FilterIcon style={{ transform: [{ scale: 1 }] }} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {userDetails?.status === 'Verified' ? (
          <TinderCardSwipe data={filteredData} handleRefresh={handleRefresh} />
        ) : (
          <View style={styles.errorMessageContainer}>
            <Text style={styles.errorMessage}>
              You have no permission to swipe cards
            </Text>
          </View>
        )}
      </View>

      {/* Modal for filtering */}
      <SwipeFilter
        visible={isModalVisible}
        onClose={toggleModal}
        city={city}
        collegeName={collegeName}
        onApply={applyFilters}
        onClear={resetFilters}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    width: '95%',
    height: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    height: '95%',
  },
  errorMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMessage: {
    fontSize: 18,
    color: 'red',
    fontFamily: FontFamily.nunitoSemiBold,
  },
});

export default Home;
