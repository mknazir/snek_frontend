import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { FontFamily } from "../../GlobalStyle";
import { useChat } from "../../Context/ChatContext";

const Matches = React.memo(() => {
  const { matches } = useChat();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContainer}
      >
        {matches?.length > 0 && (
          matches?.map((match) => (
            <TouchableOpacity key={match?._id} style={styles.matchItem}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: match?.profileImage || 'https://via.placeholder.com/150' }} // Using a generic placeholder if no image
                  style={styles.image}
                  onError={(e) => { // Handling image load errors
                    e.target.source = { uri: 'https://via.placeholder.com/150' }; // Fallback to placeholder image on error
                  }}
                />
              </View>
              <Text style={styles.matchName}>
                {match?.name}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
});

export default Matches;

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  scrollViewContainer: {
    paddingLeft: hp(2),
    paddingRight: hp(2),
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  imageContainer: {
    borderRadius: hp(3),
    overflow: 'hidden',
  },
  image: {
    width: hp(6),
    height: hp(6),
    borderRadius: hp(3),
  },
  matchName: {
    color: "#1F2937",
    fontSize: hp(1.6),
    fontFamily: FontFamily.nunitoRegular,
  },
});
