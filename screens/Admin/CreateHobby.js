//import libraries
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, ToastAndroid, Modal } from 'react-native';
import AddHobby from '../../Components/Modals/AddHobby';
import { Color, FontFamily } from '../../GlobalStyle';
import { BASE_URL } from '../../Components/constant/Url';
import { Picker } from '@react-native-picker/picker';


const CreateHobby = () => {
    const [hobbies, setHobbies] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedHobby, setSelectedHobby] = useState(null);
    const [newHobbyTitle, setNewHobbyTitle] = useState('');

    useEffect(() => {
        const fetchHobbies = async () => {
            try {
                const response = await fetch(`${BASE_URL}/admin/get/hobbies`);
                const result = await response.json();
    
                if (response.ok && result.data) {
                    // Flatten response: Convert category-wise structure into a flat array
                    const formattedHobbies = Object.keys(result.data).flatMap(category =>
                        result.data[category].map(hobby => ({
                            ...hobby,
                            category, // Keep category info with each hobby
                        }))
                    );
                    setHobbies(formattedHobbies);
                } else {
                    setHobbies([]); // Set empty list if no hobbies found
                    Alert.alert('Error', result.error || 'Failed to fetch hobbies');
                }
            } catch (error) {
                ToastAndroid.showWithGravityAndOffset(
                    'Network error: ' + error.message,
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50
                );
            }
        };
        fetchHobbies();
    }, []);
    
    


    const handleAddHobby = async (title, category) => {
        if (!title.trim() || !category) {
            Alert.alert('Error', 'Both title and category are required');
            return;
        }
    
        try {
            const response = await fetch(`${BASE_URL}/admin/add/hobby`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, category }),
            });
    
            const result = await response.json();
    
            if (response.ok) {
                setHobbies([...hobbies, { _id: result.id, title, category }]); // Ensure `_id` is stored
                ToastAndroid.show('Hobby added successfully', ToastAndroid.SHORT);
                setModalVisible(false);
            } else {
                Alert.alert('Error', result.error || 'Failed to add hobby');
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };
    
    

    const handleDeleteHobby = async (id) => {
        if (!id) {
            Alert.alert('Error', 'Invalid hobby ID');
            return;
        }
    
        try {
            const response = await fetch(`${BASE_URL}/admin/delete/hobby/${id}`, {
                method: 'DELETE',
            });
    
            if (response.ok) {  // .ok is a shorthand for checking status code 200-299
                setHobbies((prevHobbies) => prevHobbies.filter((hobby) => hobby._id !== id));
                ToastAndroid.show('Hobby deleted successfully', ToastAndroid.SHORT);
            } else {
                const result = await response.json();
                Alert.alert('Error', result.error || 'Failed to delete hobby');
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };
    


    const handleEditHobby = async () => {
        if (!selectedHobby?._id) {
            Alert.alert('Error', 'Invalid hobby ID');
            return;
        }
        if (!newHobbyTitle.trim() || !selectedHobby.category) {
            Alert.alert('Error', 'Hobby title and category cannot be empty');
            return;
        }
    
        try {
            const response = await fetch(`${BASE_URL}/admin/update/hobby/${selectedHobby._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newHobbyTitle, category: selectedHobby.category }),
            });
    
            if (response.ok) {
                setHobbies((prevHobbies) =>
                    prevHobbies.map((hobby) =>
                        hobby._id === selectedHobby._id ? { ...hobby, title: newHobbyTitle, category: selectedHobby.category } : hobby
                    )
                );
                ToastAndroid.show('Hobby updated successfully', ToastAndroid.SHORT);
            } else {
                const result = await response.json();
                Alert.alert('Error', result.error || 'Failed to update hobby');
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setEditModalVisible(false);
            setSelectedHobby(null);
            setNewHobbyTitle('');
        }
    };
    
    


    const openEditModal = (hobby) => {
        setSelectedHobby(hobby);
        setNewHobbyTitle(hobby.title);
        setEditModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.createButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.createButtonText}>Create Hobby</Text>
            </TouchableOpacity>
            <FlatList
                data={hobbies}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.listItem}>
                        <View>
                            <Text style={styles.hobbyText}>{item.title}</Text>
                            <Text style={styles.categoryText}>Category: {item.category}</Text>
                        </View>
                        <TouchableOpacity style={styles.editButton} onPress={() => openEditModal(item)}>
                            <Text style={styles.editButtonText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteHobby(item._id)}>
                            <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            <AddHobby
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={handleAddHobby}
            />
            {editModalVisible && (
                <Modal transparent={true} visible={editModalVisible} animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Edit Hobby</Text>
                            
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Hobby Name"
                                value={newHobbyTitle}
                                onChangeText={setNewHobbyTitle}
                            />

                            <Picker
                                selectedValue={selectedHobby?.category || ''}
                                style={styles.picker}
                                onValueChange={(itemValue) => setSelectedHobby({ ...selectedHobby, category: itemValue })}
                            >
                                <Picker.Item label="Select Category" value="" />
                                <Picker.Item label="Travel Hobbies" value="Travel Hobbies" />
                                <Picker.Item label="Sports Hobbies" value="Sports Hobbies" />
                                <Picker.Item label="TV Shows" value="TV Shows" />
                                <Picker.Item label="At Home Hobbies" value="At Home Hobbies" />
                                {/* <Picker.Item label="Travelling" value="Travel" /> */}
                            </Picker>

                            <TouchableOpacity style={styles.button} onPress={handleEditHobby}>
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setEditModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    createButton: {
        padding: 15,
        backgroundColor: Color.cyan1,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: FontFamily.nunitoBold
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'lightgrey',
        borderRadius: 5,
        marginBottom: 10,
    },
    hobbyText: {
        color: 'black',
        fontSize: 16,
        flex: 1,
        fontFamily: FontFamily.nunitoMedium,
    },
    editButton: {
        padding: 10,
        backgroundColor: Color.cyan2,
        borderRadius: 10,
        marginHorizontal: 5,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: FontFamily.nunitoMedium
    },
    deleteButton: {
        padding: 10,
        backgroundColor: '#e74c3c',
        borderRadius: 10,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: FontFamily.nunitoMedium,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '60%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: FontFamily.nunitoBold,
        marginBottom: 15,
        color: 'black'
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
    button: {
        width: '100%',
        padding: 15,
        backgroundColor: '#1abc9c',
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
    categoryText: {
    color: 'gray',
    fontSize: 14,
    fontFamily: FontFamily.nunitoRegular,
},
picker: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff', // Ensure visibility
},

});

//make this component available to the app
export default CreateHobby;
