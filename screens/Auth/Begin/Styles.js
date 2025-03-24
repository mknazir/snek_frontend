import {StyleSheet, Dimensions} from 'react-native';
import {FontFamily} from '../../../GlobalStyle';

// Get the dimensions of the screen
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: width,
    height: height,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  //dropdown UI
  dropdown: {
    height: 50,
    // borderBottomColor: 'gray',
    // borderBottomWidth: 0.5,
    width: '70%',
  },

  placeholderStyle: {
    fontSize: 16,
    fontFamily: FontFamily.nunitoRegular,
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: FontFamily.nunitoRegular,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    fontFamily: FontFamily.nunitoRegular,
  },
});

export default styles;