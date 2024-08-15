import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function BottomTab() {
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <FontAwesome name="home" size={28} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton}>
      <Image source={require('../assets/images/BottomTab+.png')} style={styles.addButtonImage} />
      </TouchableOpacity>
      <TouchableOpacity>
        <FontAwesome name="user" size={28} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#FFE600',
  },
  addButton: {
    backgroundColor: 'black',
    borderRadius: 35,
    padding: 10,
    marginTop: -40,
  },
  addButtonImage: {
    width: 50,
    height: 50,
  },
});
