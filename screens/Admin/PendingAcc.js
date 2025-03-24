import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../Components/constant/Url';

const PendingAcc = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filter, setFilter] = useState('All');
  const navigation = useNavigation();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [filter, users]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/get-all-users`);
      setUsers(response.data.data);
    } catch (error) {
      ToastAndroid.show(error.message || "Error Fetching Users.", ToastAndroid.SHORT);
    }
  };

  const filterUsers = () => {
    if (filter === 'All') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter((user) => user.status === filter));
    }
  };

  const renderUser = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => navigation.navigate('AccDetails', { user: item })}
    >
      <View style={styles.userInfo}>
        <Text style={styles.userText}>{item.name}</Text>
        <Text style={styles.userSubText}>{item.gender}</Text>
        <Text style={styles.userSubText}>{item.email}</Text>
        <Text style={styles.userSubText}>{item.phone}</Text>
      </View>
      <Icon name="chevron-right" size={24} color="#555" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Button title="All" onPress={() => setFilter('All')} />
        <Button title="Verified" onPress={() => setFilter('Verified')} />
        <Button title="Un-Verified" onPress={() => setFilter('Un-Verified')} />
      </View>
      <FlatList
        data={filteredUsers}
        renderItem={renderUser}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    elevation: 2,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
  },
  userText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userSubText: {
    fontSize: 14,
    color: '#555',
  },
});

export default PendingAcc;
