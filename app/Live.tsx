import React from 'react';
import { View, StyleSheet } from 'react-native';
import TopBar from '../components/LiveTop';
import Backcamera from '../components/Backcamera';
import MessageInput from '../components/Message';

export default function Live() {
  return (
    <View style={styles.container}>
      <Backcamera />
      <TopBar />
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
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
