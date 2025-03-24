import React, { useEffect,useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal,Image,ToastAndroid,Clipboard  } from 'react-native';
import { FontFamily } from '../../GlobalStyle';
import { CopyIcon } from '../../assets/ProfileIcons';
import Share from 'react-native-share';
import { useAuth } from '../../Context/AuthContext';

const ReferModal = ({ isVisible, toggleModal }) => {
    const { userDetails } = useAuth();
    const [userId, setUserId] = useState('');

    useEffect(() => {
        if (userDetails && userDetails._id) {
            setUserId(userDetails._id);
        }
    }, [userDetails]);


    const inviteLink = `https://discord.gg/referBy:${userId}`;

    const copyToClipboard = () => {
        Clipboard.setString(inviteLink);
        ToastAndroid.show('Copied!', ToastAndroid.SHORT);
    };

    const shareLink = async () => {
        try {
            const shareOptions = {
                title: 'Invite Friends',
                message: `Join our community using this link: ${inviteLink}`,
                url: inviteLink, 
            };
            await Share.open(shareOptions);
            toggleModal();
        } catch (error) {
            ToastAndroid.show('Error sharing link', ToastAndroid.SHORT);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={toggleModal}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                <Image 
                    source={require('../../assets/Images/refer.png')} 
                    style={{    image: {
                        width: '100%',  
                        height: '100%',  
                        resizeMode: 'contain',
                        borderRadius:100,
                    },}}
                        />
                    <Text style={styles.heading}>Invite Friends</Text>
                    <Text style={styles.subHeading}>Lorem Ipsum is not simply text It has roots in piece of classical Lorem Ipsum is not simply text It has roots in piece</Text>
                    
                    
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.yesButton} onPress={copyToClipboard}>
                            <Text style={styles.yesText}>{inviteLink}</Text>
                            <CopyIcon style={{ transform: [{ scale: 1.2 }]}}/>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={shareLink} style={styles.noButton}>
                            <Text style={styles.noText}>Share link</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    heading: {
        fontSize: 20,
        fontFamily: FontFamily.nunitoSemiBold,
        marginBottom: 10,
        color:'black',
    },
    subHeading: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 20,
        fontFamily: FontFamily.nunitoRegular,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    noButton: {
        backgroundColor: '#66B2B2',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginRight: 10,
        borderRadius:20,
        width:'100%',
        alignItems:'center',
        justifyContent:'center',
        marginTop:'2%'
    },
    yesButton: {
        backgroundColor: '#E6F7F7',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        width:'100%',
        alignItems:'center',
        justifyContent:'space-between',
        flexDirection:'row'
    },
    noText: {
        color: 'white',
        fontSize: 16,
        fontFamily: FontFamily.nunitoSemiBold,
    },
    yesText: {
        color: 'black',
        fontSize: 11,
        fontFamily: FontFamily.nunitoSemiBold,
    },
});

export default ReferModal;
