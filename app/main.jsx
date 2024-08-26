import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, Image, StyleSheet, Platform, View, Text, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

import Header from '../components/Header';
import LiveStreamCard from '../components/Livelist';
import BottomTab from '../components/BottomTab';
import Logo from '../components/Logo';

export default function Main() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [liveStreams, setLiveStreams] = useState([]);

  useEffect(() => {
    // 로그인한 사용자의 닉네임을 가져옵니다.
    const fetchNickname = async () => {
      const storedNickname = await AsyncStorage.getItem('nickname');
      setNickname(storedNickname || '');
    };

    fetchNickname();

    // 서버에서 현재 라이브 스트림 목록을 가져옵니다.
    fetch('http://192.168.1.182:8000/live-streams')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data && data.live_streams) {
          setLiveStreams(data.live_streams);
        } else {
          console.error('Invalid data format:', data);
          setLiveStreams([]);
        }
      })
      .catch(error => {
        console.error('Error fetching live streams:', error);
        setLiveStreams([]);
      });
  }, []);

  const joinLiveStream = (nickname) => {
    router.push({
      pathname: 'LiveStreamView',
      params: { nickname },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 로고를 절대 위치로 고정 */}
      <View style={styles.logoContainer}>
        <Logo />
      </View>
      
      {/* 메인 콘텐츠 */}
      <ScrollView contentContainerStyle={styles.content}>
        <Header />
        <Text style={styles.headerText}>실시간 방송</Text>

        {/* 라이브 스트림 리스트 */}
        {liveStreams.map((stream, index) => (
          <LiveStreamCard 
            key={index} 
            nickname={stream.nickname} 
            onJoin={() => joinLiveStream(stream.nickname)} 
          />
        ))}
      </ScrollView>

      {/* 라이브 시작 버튼 */}
      <TouchableOpacity style={styles.addButton} onPress={() => router.push('Live')}>
      </TouchableOpacity>

      {/* Tab 기능 */}
      <BottomTab />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#707070',
  },
  logoContainer: {
    marginTop: 50,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
    backgroundColor: 'white',
  },
  content: {
    padding: 20,
    marginTop: 50,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FAFF0F',
    marginBottom: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 80, // BottomTab 위에 배치되도록 설정
    right: 20,
    backgroundColor: '#000',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
});