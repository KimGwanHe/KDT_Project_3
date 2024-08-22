import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function LiveStreamCard({ streamerName }) {
  return (
    <View style={styles.card}>
      <Image source={require('../assets/images/Liveimage.png')} style={styles.liveImage} />
      <Text style={styles.streamerName}>{streamerName} 님</Text>
      <TouchableOpacity style={styles.playButton}>
      <Image source={require('../assets/images/play.png')} style={styles.playImage} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  liveImage: {
    width: 30,
    height: 15,
    marginBottom: 30,
  },
  streamerName: {
    fontSize: 18,
    marginRight: 180,
    marginTop: 20,
  },
  playButton: {
    backgroundColor: 'black',
    padding: 0,
    borderRadius: 30,
  },
  playImage: {
    width: 35,
    height: 35,
  },
});
