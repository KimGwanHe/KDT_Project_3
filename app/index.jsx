import React from 'react';
import { SafeAreaView, ScrollView, Image, StyleSheet, Platform, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import Header from '../components/Header';
import LiveStreamCard from '../components/Livelist';
import BottomTab from '../components/BottomTab';
import Logo from '../components/Logo';

export default function App() {
  const router  = useRouter();

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
        <LiveStreamCard streamerName="FOX" />
        <LiveStreamCard streamerName="DOG" />
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