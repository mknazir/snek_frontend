import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Color, FontFamily } from '../../GlobalStyle';

const AddHobby = ({ visible, onClose, onSubmit }) => {
    const [hobbyName, setHobbyName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const handleSubmit = () => {
        if (!hobbyName.trim() || !selectedCategory) {
            Alert.alert('Error', 'Both hobby name and category are required');
            return;
        }
        onSubmit(hobbyName, selectedCategory);
        setHobbyName('');
        setSelectedCategory('');
    };

    return (
        <Modal transparent={true} visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Add Hobby</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Enter Hobby Name"
                        value={hobbyName}
                        onChangeText={setHobbyName}
                    />

                    <Picker
                        selectedValue={selectedCategory}
                        style={styles.picker}
                        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                    >
                        <Picker.Item label="Select Category" value="" />
                        <Picker.Item label="Travel Hobbies" value="Travel Hobbies" />
                        <Picker.Item label="Sports Hobbies" value="Sports Hobbies" />
                        <Picker.Item label="TV Shows" value="TV Shows" />
                        <Picker.Item label="At Home Hobbies" value="At Home Hobbies" />
                    </Picker>

                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
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
        width: '50%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 15,
        fontFamily: FontFamily.nunitoBold,
        color: 'black',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        fontFamily: FontFamily.nunitoRegular,
    },
    picker: {
        width: '100%',
        height: 50,
        marginBottom: 15,
    },
    button: {
        width: '100%',
        padding: 15,
        backgroundColor: Color.cyan1,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: FontFamily.nunitoMedium,
    },
    cancelButton: {
        padding: 10,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#e74c3c',
        fontSize: 16,
        fontFamily: FontFamily.nunitoMedium,
    },
});

export default AddHobby;
