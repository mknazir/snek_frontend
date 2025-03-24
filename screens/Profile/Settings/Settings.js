import { View, Text,StyleSheet, ScrollView,TouchableOpacity } from 'react-native'
import React,{useState} from 'react'
import { Color, FontFamily } from '../../../GlobalStyle';
import { BackIcon,ReferIcon,LogoutIcon,PrivacyIcon,DeactivateIcon,BellIcon,BlockUserIcon,HelpSupportIcon,ProfileIcon, TermsIcon } from '../../../assets/ProfileIcons';
import { EyeIcon } from '../../../assets/AuthIcons';
import LogoutModal from '../../../Components/Modals/LogoutModal';
import ReferModal from '../../../Components/Modals/ReferModal';
import BlockAcc from './BlockAcc';
import DeactivateModal from '../../../Components/Modals/DeactivateModal';
import { useNavigation } from "@react-navigation/native";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useAuth } from '../../../Context/AuthContext';
 

const Settings = () => {
    const navigation = useNavigation();
    const [isLogoutVisible, setLogoutVisible] = useState(false); 
    const [isReferVisible, setReferVisible] = useState(false); 
    const [isDeactivateVisible, setIsDeactivateVisible] = useState(false); 
    const { userDetails, fetchUserDetails } = useAuth();

 
    const [isMoon, setIsMoon] = useState(true);  

        // Toggle Moon Functionality
        const toggleMoon = () => {
            setIsMoon(!isMoon);
        };
 

    const handleBlockUsers=()=>{
        navigation.navigate("BlockedUsers");
    }

    const toggleLogout = () => {
        setLogoutVisible(!isLogoutVisible);  
    };
    const toggleRefer = () => {
        setReferVisible(!isReferVisible);  
    };
    const toggleDeactivate = () => {
        setIsDeactivateVisible(!isDeactivateVisible);  
    };

 
  const [isOn, setIsOn] = useState(true);
 
  const handleToggle = () => {
    setIsOn((prevState) => !prevState);
  };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <View style={{ height: 100, width: '100%', justifyContent: 'space-between', marginLeft: '8%',alignItems:'center',flexDirection:'row'}}>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={{width:'10%',}}>
                    <BackIcon style={{ transform: [{ scale: 1.4 }] }} />
                </TouchableOpacity>

                <View style={{width:'75%',}}>
                <Text style={styles.labelText}>Settings</Text>
                </View>
            </View>
            
            <View style={styles.settingItems}>
                <View style={styles.settingItemsLeft}>
                    <View style={styles.settingsIconItems}>
                    <BellIcon style={{ transform: [{ scale: 1.1 }] }}/>
                    </View>
                    <Text style={[styles.labelText]}>Notifications</Text>
                </View>

                <TouchableOpacity
                        style={{
                            width: '18%',
                            height: '45%',
                            borderRadius: 25,
                            backgroundColor: isMoon ? Color.cyan2 : '#FF5C5C',
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: '1%',
                            justifyContent: isMoon ? 'flex-end' : 'flex-start',
                        }}
                        onPress={toggleMoon}
                    >
                        <View
                            style={{
                                width: '45%',
                                height: '90%',
                                backgroundColor: 'white',
                                borderRadius: 50,
                                alignItems:'center',
                                justifyContent:'center',
                            }}
                        >
                        {isMoon? <Text style={{color:'black',fontFamily: FontFamily.nunitoSemiBold,fontSize:hp(1)}}>ON</Text> : <Text style={{color:'black',fontFamily: FontFamily.nunitoSemiBold,fontSize:hp(1)}}>OFF</Text> }           
                        </View>
                </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.settingItems} onPress={handleBlockUsers}>
                <View style={styles.settingItemsLeft}>
                    <View style={styles.settingsIconItems}>
                    <BlockUserIcon style={{ transform: [{ scale: 1.1 }] }}/>
                    </View>
                    <Text style={[styles.labelText]}>Blocked User</Text>
                </View>
            </TouchableOpacity>

            {/* <TouchableOpacity style={styles.settingItems} onPress={()=>{navigation.navigate('Admin')}}> */}
            <TouchableOpacity style={styles.settingItems} onPress={()=>{navigation.navigate('HelpSupport')}}>
                <View style={styles.settingItemsLeft}>
                    <View style={styles.settingsIconItems}>
                    <HelpSupportIcon style={{ transform: [{ scale: 1.1 }] }}/>
                    </View>
                    <Text style={[styles.labelText]}>Help and Support</Text>
                </View>
             </TouchableOpacity>

            <TouchableOpacity style={styles.settingItems} onPress={()=>{navigation.navigate('PrivacyPolicy')}}>
                <View style={styles.settingItemsLeft}>
                    <View style={styles.settingsIconItems}>
                        <PrivacyIcon style={{ transform: [{ scale: 1.1 }] }}/>
                    </View>
                    <Text style={[styles.labelText]}>Privary Policy</Text>
                </View>
             </TouchableOpacity>

            <TouchableOpacity style={styles.settingItems} onPress={()=>{navigation.navigate('TermsCondition')}}>
                <View style={styles.settingItemsLeft}>
                    <View style={styles.settingsIconItems}>
                        <TermsIcon style={{ transform: [{ scale: 1.1 }] }}/>
                    </View>
                    <Text style={[styles.labelText]}>Term and Condition</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItems} onPress={toggleDeactivate}>
                <View style={styles.settingItemsLeft}>
                    <View style={styles.settingsIconItems}>
                        <DeactivateIcon style={{ transform: [{ scale: 1.1 }] }}/>
                    </View>
                    <Text style={[styles.labelText]}>Deactivate Profile</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItems} onPress={toggleRefer}>

            <View style={styles.settingItemsLeft}>
                <View style={styles.settingsIconItems}>
                    <ReferIcon style={{ transform: [{ scale: 1.1 }] }}/>
                </View>
                <Text style={[styles.labelText]}>Refer</Text>
            </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItems} onPress={toggleLogout}>
                <View style={styles.settingItemsLeft}>
                    <View style={styles.settingsIconItems}>
                        <LogoutIcon style={{ transform: [{ scale: 1.1 }] }}/>
                    </View>
                    <Text style={[styles.labelText,{color:'#ff0000'}]}>Logout</Text>
                </View>
            </TouchableOpacity>


            <LogoutModal isVisible={isLogoutVisible} toggleModal={toggleLogout} /> 
            <ReferModal  isVisible={isReferVisible} toggleModal={toggleRefer} />
            <DeactivateModal isVisible={isDeactivateVisible} toggleModal={toggleDeactivate}/>

 
            </View>
        </ScrollView>
    );
};

// define your styles
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
        fontSize: hp(2) ,
        marginLeft:'5%'
    },
    settingItems:{
        height:70,
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal:'2%',
        marginTop:'2%'
    },
    settingItemsLeft:{
        width:'65%',
        flexDirection:'row',
        height:'100%',
        alignItems:'center',
    },
   settingsIconItems:{
    height:'90%',
    width:'26%',
    borderRadius:50,
    borderWidth:1,
    borderColor:'#66B2B2',
    justifyContent:'center',
    alignItems:'center',
   },
});

export default Settings