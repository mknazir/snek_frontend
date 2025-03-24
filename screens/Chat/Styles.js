import { StyleSheet, Platform } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FontFamily } from '../../GlobalStyle';

const android = Platform.OS === 'android';

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        height: '100%',
        paddingTop: android ? hp(3) : 0,
    },
    matchesTitleContainer: {
        paddingHorizontal: 16,
    },
    matchesTitle: {
        color: 'black',
        fontFamily: FontFamily.nunitoSemiBold,
        fontSize: hp(2),
    },
    searchBar: {
        marginHorizontal: 16,
        marginTop: hp(1),
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#E6F7F7',
        paddingHorizontal: 12,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchInput: {
        flex: 1,
        fontSize: hp(2),
        marginBottom: 4,
        paddingLeft: 4,
        letterSpacing: 1,
        fontFamily: FontFamily.nunitoSemiBold,
        color: 'grey'
    },
    chatListContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    chatTitleContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#d1d5db',
        paddingVertical: 16,
    },
    chatItem: {
        width: '100%',
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#d1d5db',
    },
    avatarContainer: {
        position: 'relative',
        justifyContent: 'center',
        width: hp(7),
        height: hp(7),
    },
    avatar: {
        width: '90%',
        height: '90%',
        borderRadius: hp(7) / 2,
    },
    chatInfoContainer: {
        height: hp(6),
    },
    chatInfoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chatInfoNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chatName: {
        fontSize: hp(2),
        fontFamily: FontFamily.nunitoSemiBold,
        color: 'black',
    },
    chatAge: {
        fontWeight: 'bold',
        fontSize: hp(2),
        fontFamily: FontFamily.nunitoSemiBold,
        color: 'black',
        marginRight: 4,
    },
    onlineIndicatorContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeSent: {
        fontSize: hp(1.5),
        fontFamily: FontFamily.nunitoSemiBold,
        color: 'black',
    },
    lastMessageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    lastMessage: {
        fontSize: hp(1.5),
        color: 'grey',
        fontFamily: FontFamily.nunitoRegular,
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'green',
    }
});
