import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Link, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BottomTab() {
  const navigation = useNavigation();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://192.168.162.32:8000/user/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        Alert.alert('로그아웃', '성공적으로 로그아웃되었습니다.');
        await AsyncStorage.removeItem('token'); // 토큰 삭제
        router.push('login'); // 로그인 페이지로 이동
      } else {
        Alert.alert('로그아웃 실패', '로그아웃을 완료할 수 없습니다.');
      }
    } catch (error) {
      console.error('Logout Error:', error);
      Alert.alert('로그아웃 오류', '서버와 연결할 수 없습니다.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // 저장된 토큰 가져오기
      console.log('Retrieved Token:', token);
  
      if (!token) {
        Alert.alert('회원 탈퇴 오류', '회원을 찾을 수 없습니다.');
        return;
      }
  
      const response = await fetch('http://192.168.162.32:8000/user/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
      });

      const data = await response.json();

      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if (response.ok) {
        Alert.alert('회원 탈퇴', '계정이 성공적으로 삭제되었습니다.');
        router.push('signUp'); // 홈 페이지로 이동
        await AsyncStorage.removeItem('token'); // 토큰 삭제
      } else {
        Alert.alert('회원 탈퇴 실패', data.detail  || '회원 탈퇴를 완료할 수 없습니다.');
      }
    } catch (error) {
      console.error('Delete Account Error:', error);
      Alert.alert('회원 탈퇴 오류', '서버와 연결할 수 없습니다.');
    }
  };

  const handleAddPress = async () => {
    try {
      // AsyncStorage에서 clientId 값을 가져옴
      const clientId = await AsyncStorage.getItem('nickname');

      // clientId를 포함하여 Live 화면으로 이동
      console.log('Live', { host: clientId })
      await AsyncStorage.setItem('host', clientId);
      navigation.navigate('Live');
    } catch (error) {
      console.error('Failed to retrieve clientId from AsyncStorage', error);
    }
  };

  const handleUserPress = () => {
    Alert.alert(
      "사용자 선택",
      "원하는 기능을 선택하시오.",
      [
        { text: "로그아웃", onPress: handleLogout },
        { text: "회원탈퇴", onPress: handleDeleteAccount },
        { text: "취소", style: "cancel" }
      ]
    );
  };

  const handleHomePress = () => {
    navigation.replace('index');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleHomePress}>
        <FontAwesome name="home" size={28} color="black" />
      </TouchableOpacity>
      <Link href="/Live" asChild>
        <TouchableOpacity style={styles.addButton}>
          <Image source={require('../assets/images/BottomTab+.png')} style={styles.addButtonImage} />
        </TouchableOpacity>
      </Link>
      <TouchableOpacity onPress={handleUserPress}>
        <FontAwesome name="user" size={28} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#FFE600',
  },
  addButton: {
    backgroundColor: 'black',
    borderRadius: 35,
    padding: 10,
    marginTop: -40,
  },
  addButtonImage: {
    width: 50,
    height: 50,
  },
});
