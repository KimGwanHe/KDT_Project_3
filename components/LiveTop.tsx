import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function TopBar() {
  return (
    <View style={styles.topBar}>
      <Image source={require('../assets/images/Liveimage.png')} style={styles.liveIcon} />
      <Text style={styles.liveText}>인원: </Text>
      <View style={styles.topRightIcons}>
        <FontAwesome name="times" size={24} color="gray" style={styles.icon} />
        <FontAwesome name="camera" size={24} color="gray" style={styles.icon} />
        <FontAwesome name="shield" size={24} color="gray" style={styles.icon} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  liveIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  liveText: {
    fontSize: 15,
    color: 'gray',
  },
  topRightIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 15,
  },
});
