import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import TopBar from '../components/LiveTop';
import MessageInput from '../components/Message';
import Camera from '../components/camera';

export default function Live() {
  const [facing, setFacing] = useState('back');

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={styles.container}>
      <Camera facing={facing} />
      <TopBar onCameraToggle={toggleCameraFacing} />
      <View style={styles.messageContainer}>
        <MessageInput />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  messageContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    opacity: 0.8,
    height: 130,
    zIndex: 1000,
  },
});
