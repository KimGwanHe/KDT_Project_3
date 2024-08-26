// Livelist.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export default function LiveStreamCard({ servername, onconnect }) {
  return (
    <TouchableOpacity style={styles.card} onPress={()=>onconnect(servername)}>
      {/* 전체 카드가 클릭 가능하도록 설정 */}
      <Image source={require('../assets/images/Liveimage.png')} style={styles.liveImage} />
      <Text style={styles.streamerName}>{servername} 님</Text>
      <Image source={require('../assets/images/play.png')} style={styles.playButton} />
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
  },
  liveImage: {
    width: 30,
    height: 15,
    marginBottom: 30,
  },
  streamerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 15,
  },
  playButton: {
    width: 40,
    height: 40,
    marginLeft: 150,
  },
});
