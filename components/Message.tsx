import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function MessageInput() {
  return (
    <View style={styles.messageContainer}>
      <Text style={styles.messageText}>안녕하세요~ ^^{'\n'}오 하늘이 예쁘네요~!!!ㅋ</Text>
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
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  messageText: {
    fontSize: 16,
    marginBottom: 10,
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    color: 'white',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 40,
  },
  sendButton: {
    backgroundColor: 'rgba(135, 206, 250, 0.5)',
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
  },
});
