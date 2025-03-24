import React, { useCallback, useRef, useState } from 'react';
import { View, Animated, TouchableOpacity, StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import TinderChoice from './TinderChoice';
import Entypo from 'react-native-vector-icons/Entypo';
import { HeartIcon } from '../../assets/HomeIcons';
import { FontFamily } from '../../GlobalStyle';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const TinderCard = ({ item, isFirst, swipe, triggerSwipe, ...rest }) => {
  const images = (item.additionalImages || [])
    .filter(img => img && typeof img.url === 'string' && img.url.trim() !== '');

  const [currentIndex, setCurrentIndex] = useState(0);
  const opacity = useRef(new Animated.Value(1)).current;

  /**
   * Changes the current image index based on the given direction.
   * Cycles through the images array if the index goes out of bounds.
   * 
   * @param {number} direction - The direction to change the image index. 1 for forward, -1 for backward.
   */
  const handleImageChange = (direction) => {
    setCurrentIndex(prevIndex => (prevIndex + direction + images.length) % images.length);
  };

  const likeOpacity = swipe.x.interpolate({
    inputRange: [10, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = swipe.x.interpolate({
    inputRange: [-100, -10],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const tinderSelection = useCallback(() => (
    <>
      <Animated.View style={[styles.choiceContainerRight, {
        opacity: nopeOpacity,
      }
      ]}>
        <TinderChoice type={'Nope'} />
      </Animated.View>
      <Animated.View style={[styles.choiceContainerLeft, {
        opacity: likeOpacity,
      }]}>
        <TinderChoice type={'Like'} />
      </Animated.View>
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.gradientOverlay}
      >
        <View style={styles.infoContainer}>
          <Text style={styles.nameText} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
          <Text style={styles.collegeText} numberOfLines={1} ellipsizeMode="tail">{item.collegeName}</Text>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => triggerSwipe(-500)} style={styles.buttonContainer}>
            <Entypo name="cross" size={40} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => triggerSwipe(500)} style={styles.buttonContainer}>
            <HeartIcon size={50} color="red" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </>
  ), [triggerSwipe, isFirst, swipe.x]);

  return (
    <Animated.View style={[styles.cardContainer, isFirst && {
      transform: [...swipe.getTranslateTransform(), {
        rotate: swipe.x.interpolate({
          inputRange: [-100, 0, 100],
          outputRange: ['-8deg', '0deg', '8deg'],
        })
      }]
    }]}
      {...rest}
    >
      <View style={styles.indicatorContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicatorDot,
              currentIndex === index ? styles.activeDot : {},
              { width: `${100 / images.length}%` },
            ]}
          />
        ))}
      </View>
      <View style={styles.touchableContainer}>
        <TouchableOpacity style={styles.touchableHalf} onPress={() => handleImageChange(-1)} />
        <TouchableOpacity style={styles.touchableHalf} onPress={() => handleImageChange(1)} />
      </View>

      {images.length > 0 && images[currentIndex]?.url && (
        <Animated.Image
          source={{ uri: images[currentIndex]?.url }}
          style={[styles.cardImage, { opacity: opacity }]}
        />
      )}

      {isFirst && tinderSelection()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '95%',
    height: '100%',
    alignSelf: 'center',
    position: 'absolute',
    borderRadius: 10,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  gradientOverlay: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    position: 'absolute',
    justifyContent: 'flex-end',
  },
  choiceContainerRight: {
    position: 'absolute',
    top: 60,
    right: 20,
    transform: [{ rotate: '30deg' }],
  },
  choiceContainerLeft: {
    position: 'absolute',
    top: 60,
    left: 20,
    transform: [{ rotate: '-30deg' }],
  },
  infoContainer: {
    alignItems: 'center',
  },
  nameText: {
    fontSize: hp(3),
    fontFamily: FontFamily.nunitoSemiBold,
    color: 'white',
    fontWeight: 'bold',
    paddingHorizontal: 40,
  },
  collegeText: {
    fontSize: hp(2.2),
    fontFamily: FontFamily.nunitoSemiBold,
    color: 'white',
    fontWeight: 'medium',
    paddingHorizontal: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  buttonContainer: {
    backgroundColor: "#f9f9f9",
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    height: 50,
    width: 50,
  },
  touchableContainer: {
    position: 'absolute',
    width: '100%',
    height: '90%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    zIndex: 100,
  },
  touchableHalf: {
    width: '50%',
    height: '100%',
    borderRadius: 10,
  },
  indicatorContainer: {
    position: 'absolute',
    top: "2%",
    width: '90%',
    height: "0.75%",
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100
  },
  indicatorDot: {
    height: "100%",
    backgroundColor: '#808080',
    marginHorizontal: 1,
    borderRadius: 5,
  },
  activeDot: {
    backgroundColor: 'white',
  },

});

export default TinderCard;
