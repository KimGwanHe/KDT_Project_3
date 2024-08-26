import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, Image, StyleSheet, Platform, View, Text, TouchableOpacity, Alert, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

import Header from '../components/Header';
import LiveStreamCard from '../components/Livelist';
import BottomTab from '../components/BottomTab';
import Logo from '../components/Logo';

// ------------------------------------------------------------

const getClientId = async () => {
  try {
    const clientId = await AsyncStorage.getItem('nickname');
    if (clientId !== null) {
      console.log('ClientId retrieved:', clientId);
      return clientId;
    } 
  } catch (error) {
    console.error('Failed to retrieve clientId', error);
    return null;
  }
};

// getClientId 함수를 호출하여 값을 가져옵니다.
getClientId();

// ------------------------------------------------------------

export default function Main() {
  const router = useRouter();
  const navigation = useNavigation();
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    // 서버에서 현재 라이브 스트림 목록을 가져옵니다.
    fetch('http://192.168.162.32:8000/connections')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data)
        if (data) {
          setConnections(data);
        } else {
          console.error('Invalid data format:', data);
        }
      })
      .catch(error => {
        console.error('Error fetching live streams:', error);
        // setLiveStreams([]);
      });
  }, []);

  const handleAddPress1 = async (serverName) => {
    try {
      // AsyncStorage에서 clientId 값을 가져옴
      const clientId = await AsyncStorage.getItem('nickname');
  
      // clientId를 포함하여 Live 화면으로 이동
      console.log('Live', { host: clientId })
      await AsyncStorage.setItem('host', serverName);
      navigation.navigate('Live');
    } catch (error) {
      console.error('Failed to retrieve clientId from AsyncStorage', error);
    }
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
      
      {/* 서버 리스트를 LiveStreamCard로 렌더링 */}
      {Object.entries(connections).map(([serverName, addresses]) => (
          <LiveStreamCard 
            key={serverName || index}
            servername={serverName} 
            addresses={addresses} 
            onconnect={handleAddPress1} 
          />
        ))}
        </ScrollView>

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