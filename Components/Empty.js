import { View, Text, StyleSheet, Image } from 'react-native';
import { FontFamily } from '../GlobalStyle';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Empty = ({
    imgSource,
    title,
    desc
}) => {
    return (
        <View style={styles.container}>
            <Image source={imgSource} style={styles.image} />
            <Text style={styles.text1}>{title}</Text>
            <Text style={styles.text2}>{desc}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: hp(20),
        padding: 20,
    },
    text1: {
        fontSize: hp(2.2),
        color: '#18112680',
        marginTop: 20,
        fontFamily: FontFamily.nunitoBold
    },
    text2: {
        fontSize: hp(1.8),
        color: '#18112666',
        marginTop: hp(1),
        fontFamily: FontFamily.nunitoRegular
    },
    image: {
        width: hp(10),
        height: hp(10),
    }
});

export default Empty;
