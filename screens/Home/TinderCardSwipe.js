import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Animated, PanResponder } from 'react-native';
import TinderCard from './TinderCard';
import { BASE_URL } from '../../Components/constant/Url';
import { useAuth } from '../../Context/AuthContext';
import { ToastAndroid } from 'react-native';
import Empty from '../../Components/Empty';

const TinderCardSwipe = ({ data, handleRefresh }) => {
  const { userDetails } = useAuth();
  const [cards, setCards] = useState(data);
  const swipe = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    setCards(data);
  }, [data]);

  useEffect(() => {
    if (!cards?.length) {
      setTimeout(() => setCards(data), 500);
    }
  }, [cards, data]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      const { dx, dy } = gestureState;
      return Math.abs(dx) > 5 || Math.abs(dy) > 5;
    },
    onPanResponderMove: Animated.event([null, { dx: swipe.x, dy: swipe.y }], { useNativeDriver: false }),
    onPanResponderRelease: (_, { dx }) => {
      const swipeThreshold = 120;
      if (Math.abs(dx) > swipeThreshold) {
        triggerSwipe(dx > 0 ? 500 : -500);
      } else {
        Animated.spring(swipe, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
          bounciness: 10
        }).start();
      }
    },
  });

  const triggerSwipe = (directionX) => {
    Animated.timing(swipe, {
      toValue: { x: directionX, y: 0 },
      useNativeDriver: true,
      duration: 300,
    }).start(() => {
      const direction = directionX > 0 ? 'right' : 'left';
      handleSwipe(direction);
      removeCard();
    });
  };

  const handleSwipe = (direction) => {
    if (!cards.length) return;

    const currentCard = cards[0];
    fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userDetails._id,
        targetUserId: currentCard._id, // Send only the `targetUserId`
        action: direction,
      }),
    })
      .then(response => response.json())
      .catch(error => {
        ToastAndroid.showWithGravityAndOffset(
          error.message || "Something Went Wrong",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      });
  };


  const removeCard = useCallback(() => {
    setCards(prevCards => {
      const newCards = prevCards.slice(1);

      // If there are no more cards left, call handleRefresh
      if (newCards.length === 0) {
        setTimeout(() => handleRefresh(), 500);
      }

      return newCards;
    });

    swipe.setValue({ x: 0, y: 0 }); // Reset swipe position
  }, []);

  if (cards.length === 0) {
    return <Empty
      imgSource={require('../../assets/Images/no-profile.png')}
      title={'Enough profile swiped'}
      desc={'Revisit After Few Hours'}
    />;
  }

  return (
    <View style={{ flex: 1 }}>
      {cards.map((item, index) => {
        const isFirst = index === 0;
        const dragHandlers = isFirst ? panResponder.panHandlers : {};
        return (
          <TinderCard
            key={index}
            item={item}
            isFirst={isFirst}
            swipe={swipe}
            triggerSwipe={triggerSwipe}
            {...dragHandlers}
          />
        );
      }).reverse()}
    </View>
  );
};

export default TinderCardSwipe;
