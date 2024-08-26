import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import TopBar from '../components/LiveTop';
import MessageInput from '../components/Message';
import Camera from '../components/camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Live() {
  const [facing, setFacing] = useState('back');
  const [clientId, setClientId] = useState(null);
  const [host, setHost] = useState(null);
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  useEffect(() => {
    const fetchClientIdAndHost = async () => {
      try {
        const storedClientId = await AsyncStorage.getItem('nickname');
        const storedHost = await AsyncStorage.getItem('host');
        if (storedClientId && storedHost) {
          setClientId(storedClientId);
          setHost(storedHost);
        } else {
          console.error('ClientId or Host is missing');
        }
      } catch (error) {
        console.error('Failed to retrieve clientId or host from AsyncStorage', error);
      }
    };

    fetchClientIdAndHost();
  }, []);

  useEffect(() => {
    let socket;
    if (clientId && host) {
      const wsUrl = `ws://192.168.162.32:8000/ws/${host}/${clientId}`;
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log('WebSocket connection opened');
      };

      socket.onmessage = (event) => {
        const newMessage = event.data;
        setMessages(prevMessages => [...prevMessages, newMessage]);
      };

      socket.onerror = (error) => {
        console.error('WebSocket error: ', error.message);
      };

      socket.onclose = () => {
        console.log('WebSocket connection closed');
      };

      setWs(socket);
    }

    // Clean up WebSocket on component unmount
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [clientId, host]);

  const sendMessage = (message) => {
    if (ws && ws.readyState === WebSocket.OPEN && message.trim().length > 0) {
      ws.send(message);
    } else {
      console.error('WebSocket is not open or message is empty');
    }
  };

  return (
    <View style={styles.container}>
      <Camera facing={facing} />
      <TopBar onCameraToggle={toggleCameraFacing} />
      <View style={styles.messageContainer}>
        <MessageInput messages={messages} onSendMessage={sendMessage} />
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
