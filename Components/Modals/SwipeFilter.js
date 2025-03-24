import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ToastAndroid } from 'react-native';
import { Color, FontFamily } from '../../GlobalStyle';
import { CrossIcon } from '../../assets/HomeIcons';
import { Dropdown } from 'react-native-element-dropdown';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSwipe } from '../../Context/SwipeContext';
import collegesData from '../../data/updated_colleges.json';

const SwipeFilter = ({ visible, onClose, state, collegeName, onApply, onClear }) => {
  const [states, setStates] = useState([]);
  const [collegesList, setCollegesList] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [loading, setLoading] = useState(false);

  // Local states for dropdown selections
  const [localState, setLocalState] = useState(null);
  const [localCollegeName, setLocalCollegeName] = useState(null);

  const { selectedCity: selectedState, setSelectedCity: setSelectedState, selectedCollegeName, setSelectedCollegeName } = useSwipe();

  useEffect(() => {
    if (visible) {
      extractStatesAndColleges();
    }
  }, [visible]);

  const extractStatesAndColleges = () => {
    setLoading(true);
    try {
      const uniqueStates = [...new Set(collegesData.map(college => college['State']))];
      const stateOptions = uniqueStates.map(state => ({ label: state, value: state }));
      setStates(stateOptions);

      const colleges = collegesData.map(college => ({
        label: college['Name of the College/Institution'],
        value: college['Name of the College/Institution'],
        state: college['State'],
      }));
      setCollegesList(colleges);
    } catch (error) {
      ToastAndroid.showWithGravityAndOffset(
        'Error loading college data.',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStateSelect = (item) => {
    setLocalState(item.value);
    const filtered = collegesList.filter((college) => college.state === item.value);
    setFilteredColleges(filtered);
    setLocalCollegeName(null); // Reset college selection when state changes
  };

  const handleApply = () => {
    // Update the context with the selected values
    setSelectedState(localState);
    setSelectedCollegeName(localCollegeName);
    onApply(localState, localCollegeName); // Pass to parent if needed
    onClose();
  };

  const handleClearFilters = () => {
    setLocalState(null);
    setLocalCollegeName(null);
    setFilteredColleges([]);
    onClear();
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <CrossIcon />
            </TouchableOpacity>
            <Text style={styles.label}>Filter</Text>
          </View>

          <View style={styles.dropdownContainer}>
            <Text style={styles.requiredText}>State*</Text>
            {loading ? (
              <ActivityIndicator size="large" color={Color.cyan1} />
            ) : (
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={states}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select State"
                searchPlaceholder="Search..."
                value={localState}
                onChange={handleStateSelect}
                renderItem={(item) => (
                  <View style={{ padding: 10 }}>
                    <Text style={styles.selectedTextStyle} numberOfLines={1} ellipsizeMode="tail">{item.label}</Text>
                  </View>
                )}
              />
            )}
          </View>

          <View style={styles.dropdownContainer}>
            <Text style={styles.requiredText}>College Name*</Text>
            {loading ? (
              <ActivityIndicator size="large" color={Color.cyan1} />
            ) : (
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={filteredColleges.length > 0 ? filteredColleges : collegesList}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select College"
                searchPlaceholder="Search..."
                value={localCollegeName}
                onChange={(item) => setLocalCollegeName(item.value)}
                renderItem={(item) => (
                  <View style={{ padding: 10 }}>
                    <Text style={styles.selectedTextStyle} numberOfLines={1} ellipsizeMode="tail">{item.label}</Text>
                  </View>
                )}
              />
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Styles
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
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '5%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  label: {
    fontSize: 20,
    fontFamily: FontFamily.nunitoSemiBold,
    color: 'black',
    textAlign: 'center',
    width: '100%',
  },
  dropdownContainer: {
    width: '90%',
    marginBottom: '5%',
  },
  requiredText: {
    fontSize: hp(1.8),
    fontFamily: FontFamily.nunitoSemiBold,
    color: '#121212',
    paddingBottom: 10,
  },
  dropdown: {
    height: 50,
    width: '100%',
    borderRadius: 10,
    borderColor: Color.cyan1,
    borderWidth: 1,
  },
  placeholderStyle: {
    fontSize: 16,
    fontFamily: FontFamily.nunitoRegular,
    paddingLeft: '5%',
    color: 'black',
  },
  selectedTextStyle: {
    width: '100%',
    fontSize: 16,
    fontFamily: FontFamily.nunitoRegular,
    color: 'black',
    paddingHorizontal: '5%',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    fontFamily: FontFamily.nunitoRegular,
    color: 'black',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '5%',
    gap: '5%',
  },
  applyButton: {
    backgroundColor: Color.cyan1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '49%',
    borderRadius: 10,
    paddingVertical: '5%',
  },
  applyButtonText: {
    fontFamily: FontFamily.nunitoRegular,
    fontSize: hp(2),
    color: 'white',
  },
  clearButton: {
    backgroundColor: '#E7E7E7',
    alignItems: 'center',
    justifyContent: 'center',
    width: '49%',
    borderRadius: 10,
    paddingVertical: '5%',
  },
  clearButtonText: {
    fontFamily: FontFamily.nunitoRegular,
    fontSize: hp(2),
    color: 'black',
  },
});

export default SwipeFilter;
