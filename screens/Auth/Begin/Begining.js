import React, { useState, useRef, useEffect } from 'react';
import { View, Image, Text, Animated, TouchableOpacity } from 'react-native';
import styles from './Styles';
import { Color, FontFamily } from '../../../GlobalStyle';
import { EllipseIcon, EllipseIconFocus, LanguageIcon } from '../../../assets/AuthIcons';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';

const Begining = () => {
  const [value, setValue] = useState(null);
  const data = [
    { label: 'English', value: '1' },
    // {label: 'Hindi', value: '2'},
    // {label: 'Bengali', value: '3'},
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const navigation = useNavigation();

  const datingAppInfo = [
    {
      title: 'Find Your Perfect Match Effortlessly!',
      details:
        'Swipe, chat, and connect with like-minded people who get you. Whether it’s love, friendship, or just good vibes—you’re in the right place.',
      imgsrc: require('../../../assets/Images/img1.png'),
    },
    {
      title: 'Join the Buzz Start the Adda!',
      details:
        'Engage in real, unfiltered conversations with people who share your interests. From deep debates to casual banter—this is your space to talk, laugh, and vibe.',
      imgsrc: require('../../../assets/Images/img2.png'),
    },
    {
      title: 'Your Campus Your Community',
      details:
        'Stay in the loop, make friends, and never miss out on the fun. Your campus, your squad, your way!',
      imgsrc: require('../../../assets/Images/img3.png'),
    },
    {
      title: 'Your Campus Your Community',
      details:
        'Stay in the loop, make friends, and never miss out on the fun. Your campus, your squad, your way!',
      imgsrc: require('../../../assets/Images/img4.png'),
    },
  ];

  const slideIn = () => {
    Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }).start();
  };

  useEffect(() => {
    slideIn();
  }, [currentIndex]);

  const handleContinue = () => {
    if (currentIndex < datingAppInfo.length - 1) {
      setCurrentIndex(currentIndex + 1);
      slideAnim.setValue(300);
    } else {
      navigation.navigate('Options');
    }
  };

  const handleEllipsePress = index => {
    setCurrentIndex(index);
    slideAnim.setValue(300);
  };

  const renderEllipses = () => {
    return datingAppInfo.map((_, index) => {
      if (index === currentIndex) {
        return (
          <TouchableOpacity key={index} onPress={() => handleEllipsePress(index)}>
            <EllipseIconFocus style={{ transform: [{ scale: 1.8 }] }} />
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity key={index} onPress={() => handleEllipsePress(index)}>
            <EllipseIcon style={{ transform: [{ scale: 1.8 }] }} />
          </TouchableOpacity>
        );
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={{ height: '40%', justifyContent: 'center', alignItems: 'center', width: '60%' }}>
        <Image source={datingAppInfo[currentIndex].imgsrc} style={styles.image} />
      </View>

      <Animated.View style={{ alignItems: 'center', width: '90%', height: '15%', justifyContent: 'center', transform: [{ translateX: slideAnim }] }}>
        <Text style={{ color: Color.cyan1, fontFamily: FontFamily.nunitoSemiBold, fontSize: 20, textAlign: 'center' }}> {datingAppInfo[currentIndex].title} </Text>
        <Text style={{ color: '#8B9898', fontFamily: FontFamily.nunitoRegular, fontSize: 15, marginTop: 15, textAlign: 'center', marginBottom: 25 }}>
          {datingAppInfo[currentIndex].details}
        </Text>
      </Animated.View>

      <View style={{ flexDirection: 'row', width: '25%', justifyContent: 'space-between', height: '5%', alignItems: 'center' }}>
        {renderEllipses()}
      </View>

      {/* <View style={{ height: '5%', width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
        <View style={{ width: '40%', height: '100%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
            <LanguageIcon style={{transform: [{scale: 1.2}]}} />  
            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Language"
                value={value}
                onChange={item => {
                setValue(item.value);
                }}
                renderItem={item => (
                <View style={{padding: 10}}>
                    <Text style={[styles.selectedTextStyle]}>{item.label}</Text>
                </View>
                )}
            />
        </View>
      </View> */}

      <View style={{ height: '20%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity
          onPress={handleContinue}
          style={{ height: '30%', width: '80%', borderRadius: 50, backgroundColor: Color.cyan1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: 'white', fontFamily: FontFamily.nunitoRegular, fontSize: 20 }}> Continue </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Begining;