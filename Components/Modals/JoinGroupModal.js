import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ToastAndroid } from 'react-native';
import { FontFamily } from '../../GlobalStyle';
import axios from 'axios';
import { BASE_URL } from '../constant/Url';

const JoinGroupModal = ({ isVisible, toggleModal, groupId, userId, onSuccess }) => {
    const handleJoinGroup = async () => {
        try {
          const response = await axios.post(`${BASE_URL}/group/join/${userId}/${groupId}`);
          ToastAndroid.show('Successfully joined the group!', ToastAndroid.SHORT);
          onSuccess(response.data);  
          toggleModal();
        } catch (error) {
          ToastAndroid.show(
            error.response?.data?.error || 'Failed to join group. Please try again.',
            ToastAndroid.SHORT
          );
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
          <Text style={styles.heading}>Are you sure you want to join the group?</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.joinButton}
              onPress={handleJoinGroup}
            >
              <Text style={styles.joinButtonText}>Join</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleModal}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
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
    marginBottom: 20,
    color: 'black',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
  },
  joinButton: {
    backgroundColor: '#66B2B2',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  cancelButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
    alignItems: 'center',
    width: '100%',
  },
  joinButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: FontFamily.nunitoSemiBold,
  },
  cancelButtonText: {
    color: 'black',
    fontSize: 16,
    fontFamily: FontFamily.nunitoSemiBold,
  },
});

export default JoinGroupModal;
