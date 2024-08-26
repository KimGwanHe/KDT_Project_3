import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, FlatList, Keyboard, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function MessageInput() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const [keyboardOffset] = useState(new Animated.Value(0));

  useEffect(() => {
    const socket = new WebSocket('ws://127.0.0.1:8000/ws/{Client}');

    socket.onopen = () => {
      console.log("채팅방에 들어갔습니다.");
    };

    socket.onmessage = (event) => {
      const newMessage = event.data;
      setMessages(prevMessages => [...prevMessages, newMessage]);
    };

    socket.onclose = () => {
      console.log("채팅방을 나갔습니다.");
    };

    socket.onerror = (error) => {
      console.log("WebSocket 오류:", error);
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event) => {
        Animated.timing(keyboardOffset, {
          duration: 100,
          toValue: -event.endCoordinates.height,
          useNativeDriver: false,
        }).start();
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        Animated.timing(keyboardOffset, {
          duration: 100,
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [keyboardOffset]);

  const sendMessage = () => {
    if (ws && message.trim().length > 0) {
      ws.send(message);
      setMessage("");
    }
  };

  return (
    <Animated.View style={[styles.messageContainer, { transform: [{ translateY: keyboardOffset }] }]}>
      <View style={styles.messageContainer}>
        <FlatList
          data={messages}
          renderItem={({ item }) => (
            <View style={styles.messageBubble}>
              <Text style={styles.messageText}>{item}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          style={styles.messageList}
        />
        <View style={styles.inputContainer}>
          <TextInput 
            placeholder="메시지 입력..." style={styles.textInput} value={message} onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <FontAwesome name="paper-plane" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    flex: 1,
    padding: 15,
    opacity: 0.8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  messageList: {
    flex: 1,
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
    color: 'white',
  },
  sendButton: {
    backgroundColor: 'rgba(135, 206, 250, 0.8)',
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
  },
});
