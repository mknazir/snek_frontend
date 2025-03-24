import { useState, useEffect } from 'react';
import { BottomNavigation } from 'react-native-paper';
import Home from '../screens/Home/Home';
import { ProfileIcon } from '../assets/ProfileIcons';
import { ChatIcon, ChatIconFocus } from '../assets/ChatIcons';
import { HomeIcon, HomeIconFocus } from '../assets/HomeIcons';
import { GroupIcon, GroupIconFocus } from '../assets/GroupIcons';
import ChatStackScreen from './ChatStackScreen ';
import ProfileStack from './ProfileStack';
import GroupStack from './GroupStack';
import { setBottomNavigationRef } from './NavigationService';

const HomeRoute = () => <Home />;
const ChatRoute = () => <ChatStackScreen />;
const GroupRoute = () => <GroupStack />;
const ProfileRoute = () => <ProfileStack />;

const AuthenticatedStack = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const [roomId,setRoomId] = useState(null);

  const [routes] = useState([
    {
      key: 'home',
      title: 'Home',
      icon: ({ focused }) => focused ? <HomeIconFocus /> : <HomeIcon />,
    },
    {
      key: 'chat',
      title: 'Chat',
      icon: ({ focused }) => focused ? <ChatIconFocus /> : <ChatIcon />,
    },
    {
      key: 'group',
      title: 'Group',
      icon: ({ focused }) => focused ? <GroupIconFocus /> : <GroupIcon />,
    },
    {
      key: 'profile',
      title: 'Profile',
      icon: ({ focused }) => focused ? <ProfileIcon /> : <ProfileIcon />,
    },
  ]);

  useEffect(() => {
    setBottomNavigationRef(setIndex, routes, roomId);
  }, [roomId]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    chat: ChatRoute,
    group: GroupRoute,
    profile: ProfileRoute
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      renderIcon={({ route, focused }) => route.icon({ focused })}
      barStyle={{ backgroundColor: '#F0F7F7' }}
      key={index}
    />
  );
};

export default AuthenticatedStack;