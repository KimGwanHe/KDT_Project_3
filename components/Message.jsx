import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Keyboard, Animated, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function MessageInput({ messages, onSendMessage }) {
  const [message, setMessage] = useState("");
  const [keyboardOffset] = useState(new Animated.Value(0));
  const [displayMessages, setDisplayMessages] = useState([]);

  useEffect(() => {
    // 최신 5개의 메시지로 업데이트
    setDisplayMessages(messages.slice(-5));
  }, [messages]);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      // iOS 전용 키보드 이벤트 핸들러
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
    }
  }, [keyboardOffset]);

  const handleSend = () => {
    if (message.trim().length > 0) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <Animated.View style={[styles.messageContainer, { transform: [{ translateY: keyboardOffset }] }]}>
      <View style={styles.messageContainer}>
        <FlatList
          data={displayMessages}
          extraData={displayMessages} // 강제 업데이트를 위해 추가
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
            placeholder="메시지 입력..."
            style={styles.textInput}
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
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
