import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function LiveStreamCard({ nickname, onJoin }) {
  return (
    <TouchableOpacity onPress={onJoin} style={styles.card}>
      <Image source={require('../assets/images/Liveimage.png')} style={styles.liveImage} />
      <Text style={styles.streamerName}>{nickname} 님</Text>
      <TouchableOpacity style={styles.playButton} onPress={onJoin}>
        <Image source={require('../assets/images/play.png')} style={styles.playImage} />
      </TouchableOpacity>
    </TouchableOpacity>
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
    padding: 10,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playImage: {
    width: 35,
    height: 35,
  },
});
