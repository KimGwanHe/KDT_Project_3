import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Alert } from 'react-native';
import TopBar from '../components/LiveTop';
import MessageInput from '../components/Message';
import Camera from '../components/camera';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Live() {
  const [facing, setFacing] = useState('back');
  const [nickname, setNickname] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchNickname = async () => {
      const storedNickname = await AsyncStorage.getItem('nickname');
      setNickname(storedNickname || '');
    };

    fetchNickname();
  }, []);

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const startLiveStream = () => {
    if (!nickname) {
      Alert.alert('오류', '닉네임 정보가 없습니다.');
      return;
    }

    fetch('http://192.168.1.182:8000/start-live', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nickname }),
    })
    .then(response => {
      if (response.ok) {
        Alert.alert('라이브 시작', `${nickname}님의 라이브가 시작되었습니다.`);
        router.push('main'); // 라이브 시작 후 메인 화면으로 이동
      } else {
        response.json().then(data => Alert.alert('오류', data.detail));
      }
    })
    .catch(error => console.error('라이브 스트리밍 오류:', error));
  };

  return (
    <View style={styles.container}>
      <Camera facing={facing} />
      <Button title="라이브 시작" onPress={startLiveStream} />
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
