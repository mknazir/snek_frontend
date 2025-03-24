import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import { FontFamily, Color } from "../../GlobalStyle";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width, height } = Dimensions.get('window');

// define your styles
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        width: width,
        height: height,
    },
    logoContainer: {
        height: '20%',
        justifyContent: 'center',
        alignItems: 'center',
        width: '60%',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    inputContainer: {
        height: '18%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    inputWrapper: {
        width: '90%',
    },
    labelText: {
        color: '#1E232C',
        fontFamily: FontFamily.nunitoRegular,
        fontSize: 20,
        marginBottom: 5,
    },
    input: {
        height: 50,
        borderRadius: 10,
        borderColor: '#D0E5E5',
        borderWidth: 1,
        paddingHorizontal: 10,
        fontFamily: FontFamily.nunitoRegular,
        fontSize: 16,
        backgroundColor: 'white',
        color: '#1E232C'
    },

    // AppSubmit.js
    appSubmitContainer: {
        flex: 1,
        backgroundColor: 'white',
        width: width,
        height: height,
    },
    backButtonContainer: {
        height: '10%',
        justifyContent: 'center',
        marginLeft: '8%',
    },
    backIcon: {
        transform: [{ scale: 1.4 }],
    },
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    appSubmitLogoContainer: {
        height: '20%',
        width: '60%',
        margin: '3%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: '1%',
        paddingHorizontal: '3%',
    },
    appSubmitLabelText: {
        color: '#4E4559',
        fontFamily: FontFamily.nunitoBold,
        fontSize: 30,
        textAlign: 'center',
    },
    paraContainer: {
        width: '60%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paraText: {
        color: '#717171',
        fontFamily: FontFamily.nunitoSemiBold,
        fontSize: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        height: '20%',
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',
    },
    homeButton: {
        height: '45%',
        width: '95%',
        borderRadius: 50,
        backgroundColor: Color.cyan1,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 1,
    },
    buttonText: {
        color: 'white',
        fontFamily: FontFamily.nunitoRegular,
        fontSize: 20,
    },

    //Hobby.js
    hobbyContainercontainer: {
        flex: 1,
        backgroundColor: 'white',
        width: width,
        height: height,
        paddingHorizontal: '5%',
    },
    header: {
        height: '10%',
        width: '100%',
        justifyContent: 'center',
        paddingLeft: '5%',
    },
    hobbyLabelText: {
        color: '#4E4559',
        fontFamily: FontFamily.nunitoBold,
        fontSize: 30,
        textAlign: 'center',
        marginVertical: '4%',
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20, // Ensures button is not blocked
    },
    loadingIndicator: {
        marginTop: 50,
    },
    categoryContainer: {
        marginBottom: 20,
    },
    categoryTitle: {
        fontSize: 20,
        fontFamily: FontFamily.nunitoBold,
        color: '#00999E',
        marginBottom: 10,
        textAlign: 'left',
    },
    hobbyRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    hobbyContainer: {
        width: '48%',
        height: 60,
        borderColor: '#00999E',
        borderWidth: 1,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
    },
    hobbyText: {
        fontFamily: FontFamily.nunitoRegular,
        fontSize: 16,
        textAlign: 'center',
    },
    hobbyButtonContainer: {
        height: 80, // Adjusted for better spacing
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButton: {
        height: 50,
        width: '50%',
        borderRadius: 30,
        backgroundColor: Color.cyan2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonTextSave: {
        color: 'white',
        fontFamily: FontFamily.nunitoBold,
        fontSize: 18,
    },


    // PersonalDetails.js
    personalDetailsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        width: width,
        height: height,
    },
    topView: {
        height: '15%',
        width: '100%',
        justifyContent: 'space-between',
        marginLeft: '8%',
        alignItems: 'center',
        flexDirection: 'row',
    },
    personalDetailsLabelText: {
        color: '#4E4559',
        fontFamily: FontFamily.nunitoBold,
        fontSize: hp(2),
    },
    personalDetailsImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 50,
    },
    //dropdown UI
    dropdown: {
        height: 50,
        width: '100%',
        borderRadius: 10,
        borderColor: Color.cyan1,
        borderWidth: 1,
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 16,
        color: '#121212',
        fontFamily: FontFamily.nunitoRegular,
        paddingLeft: '5%',
    },
    selectedTextStyle: {
        fontSize: 16,
        color: 'black',
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
        color: 'black',
    },
    cameraIconButton: {
        width: 50,
        height: 50,
        borderRadius: 30,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        zIndex: 2,
        bottom: 0,
        right: '41%',
    },

    collegeUploadIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '80%',
        width: '90%',
        borderColor: Color.cyan1,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: 10,
    },
    requiredText: {
        fontSize: hp(2),
        fontFamily: FontFamily.nunitoSemiBold,
        color: '#121212',
        paddingBottom: 10,
    },
    uploadButtonsContainer: {
        width: '100%',
        height: '10%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: '5%',
        marginTop: '5%',
    },
    uploadButton: {
        borderColor: Color.cyan1,
        borderWidth: 1,
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadedImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    cameraButton: {
        width: 30,
        height: 30,
        borderRadius: 30,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        zIndex: 2,
        bottom: '10%',
        right: '41%',
    },
    uploadedCollegeIdImage: {
        width: 50,
        height: 50,
        borderRadius: 5,
        resizeMode: 'contain',
    },
    fileNameText: {
        fontSize: 14,
        fontFamily: FontFamily.nunitoRegular,
        color: '#121212',
        marginTop: 5,
    },
    uploadSelfieText: {
        fontSize: 20,
        fontFamily: FontFamily.nunitoSemiBold,
        color: '#121212'
    },
    uploadColledeIdView: {
        height: '20%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stateDropdownView: {
        width: '90%',
        height: '40%',
        justifyContent: 'space-between',
    },
    stateDropdownContainer: {
        width: '100%',
        height: '20%',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    collegeDropdown: {
        width: '90%',
        height: '40%',
        justifyContent: 'space-between',
    },
    collegeInputText: {
        paddingLeft: 10,
        height: 50,
        marginTop: 10,
        fontFamily: FontFamily.nunitoRegular,
        color: 'black',
    },
    sumbitFormView: {
        height: '15%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sumitFormButton: {
        height: '40%',
        width: '90%',
        borderRadius: 50,
        backgroundColor: Color.cyan1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitLoadingText: {
        color: 'white',
        fontFamily: FontFamily.nunitoRegular,
        fontSize: hp(2),
    },

    // SubmitForm.js
    signUpFormContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        width: width,
        height: height,
    },
    signUpLogoContainer: {
        height: '20%',
        justifyContent: 'center',
        alignItems: 'center',
        width: '60%',
    },
    signUpImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    signUpInputContainer: {
        height: 400,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    signupPlaceholderStyle: {
        fontSize: 16,
        fontFamily: FontFamily.nunitoRegular,
        color: '#1E232C',
    },
    signUpSelectedTextStyle: {
        fontSize: 16,
        color: '#1E232C',
        fontFamily: FontFamily.nunitoRegular,
    },
    signUpInputSearchStyle: {
        height: 40,
        fontSize: 16,
        fontFamily: FontFamily.nunitoRegular,
    },
    pinCodeText: {
        color: 'black'
    },
    pinCodeContainer: {
        borderColor: 'grey'
    },
});