import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router';

export default function BottomTab() {
  const navigation = useNavigation();

  const handleUserPress = () => {
    Alert.alert(
      "사용자 선택",
      "원하는 기능을 선택하시오.",
      [
        { text: "로그아웃", onPress: () => console.log("Log Out pressed") },
        { text: "회원탈퇴", onPress: () => console.log("Delete Account pressed") },
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
