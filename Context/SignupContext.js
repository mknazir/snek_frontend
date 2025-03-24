import React, { createContext, useContext, useState } from 'react';
import { ToastAndroid } from 'react-native';
const SignupContext = createContext();
import { BASE_URL } from '../Components/constant/Url';

export const SignupProvider = ({ children }) => {
  const initialSignupData = {
    name: '',
    password: '',
    email: '',
    phone: '',
    gender: '',
    collegeName: '',
    profileImage: '',
    additionalImages: [null, null, null, null],
    collegeIdImage: '',
    collegeIdString: '',
    hobbies: [],
    city: '',
    preferences: {
      gender: ['Male', 'Female', 'Other'],
      college: 'Same College',
      hobbies: [],
    },
  };

  const [signupData, setSignupData] = useState(initialSignupData);

  const updateSignupData = (field, value) => {
    setSignupData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Function to fetch colleges
  const fetchColleges = async ({ setCollegesList }) => {
    try {
      const response = await fetch('http://universities.hipolabs.com/search?name=&country=India');
      const result = await response.json();
      const colleges = result.map(collegeData => ({
        label: collegeData.name,
        value: collegeData.name,
      }));
      setCollegesList(colleges);
    } catch (error) {
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    }
  };

  // Function to fetch cities
  const fetchCities = async ({ setCities, setLoading }) => {
    setLoading(true);
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: 'India' }),
      });

      const result = await response.json();
      const citiesList = result.data.map(city => ({
        label: city,
        value: city,
      }));
      setCities(citiesList);
    } catch (error) {
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchHobbies = async ({ setHobbies, setLoading }) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/admin/get/hobbies`);
      const result = await response.json();
  
      // console.log('API Response:', result); // Debugging line
  
      if (response.ok && result.data) {
        setHobbies(result.data);  
      } else {
        console.log('No hobbies found:', result);
        ToastAndroid.showWithGravityAndOffset(
          'No hobbies found.',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
      }
    } catch (error) {
      // console.log('Fetch Hobbies Error:', error);
      ToastAndroid.showWithGravityAndOffset(
        'Error fetching hobbies. Please try again.',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    } finally {
      setLoading(false);
    }
  };
  
  
  

  const submitSignup = async () => {
    try {
      const genderMapping = {
        '1': 'Male',
        '2': 'Female',
        '3': 'Others',
      };

      const preparedSignupData = {
        ...signupData,
        gender: genderMapping[signupData.gender] || signupData.gender, // Map gender value or use the existing label
      };
      const response = await fetch(`${BASE_URL}/user/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preparedSignupData),
      });
      const result = await response.json();

      if (response.ok) {
        return { success: true, user: result.user || result.message };
      } else {
        return { success: false, error: result.error || "An unknown error occurred" };
      }
    } catch (error) {
      return { success: false, error: error.message || "Network error occurred" };
    }
  };

  const submitFinalSignup = () => {
    setSignupData(initialSignupData);
  };


  return (
    <SignupContext.Provider
      value={{
        signupData,
        updateSignupData,
        fetchColleges,
        fetchCities,
        fetchHobbies,
        submitSignup,
        submitFinalSignup,
      }}>
      {children}
    </SignupContext.Provider>
  );
};

export const useSignupContext = () => useContext(SignupContext);
