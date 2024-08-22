import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function MessageInput() {
  return (
    <View style={styles.messageContainer}>
      <View style={styles.messageBubble}>
        <Text style={styles.messageText}>오 하늘이 예쁘네요~!!!ㅋ</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput placeholder="메시지 입력..." style={styles.textInput} />
        <TouchableOpacity style={styles.sendButton}>
          <FontAwesome name="paper-plane" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    padding: 15,
    opacity: 0.8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  messageBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 5,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    lineHeight: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    fontWeight: 'bold',
  },
  sendButton: {
    backgroundColor: 'rgba(135, 206, 250, 0.8)',
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
  },
});
