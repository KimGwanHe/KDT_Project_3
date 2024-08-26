import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { theme } from '../constants/theme'
import Icon from '../assets/icons'
import { StatusBar } from 'expo-status-bar'
import BackButton from '../components/BackButton'
import { useRouter } from 'expo-router'
import { hp, wp } from '../helpers/common'
import Input from '../components/Input'
import Button from '../components/Button'

const Signup = () => {
    const router = useRouter();
    const nicknameRef = useRef("");
    const passwordRef = useRef("")
    const [loading, setLoading] = useState(false);
    const [isNicknameAvailable, setIsNicknameAvailable] = useState(null);

    const checkNicknameAvailability = async () => {
      const nickname = nicknameRef.current.trim();
      if (!nickname) {
          Alert.alert('닉네임 확인', '닉네임을 입력해주세요.');
          return;
      }
      try {
        console.log('Sending nickname for availability check:', nickname);
        const response = await fetch('http://192.168.162.32:8000/user/check-nickname', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nickname }), // 올바르게 포맷된 JSON
        });
        // 서버 응답 로그 추가
        const result = await response.json();
        console.log('Server response:', result);
        if (!response.ok) {
          // 서버 오류 처리
          const errorMessage = Array.isArray(result.detail)
            ? result.detail.map(item => item.msg).join(', ')
            : result.detail || '서버에서 문제가 발생했습니다.';
          Alert.alert('닉네임이 중복되었습니다', errorMessage);
          setIsNicknameAvailable(null);
          return;
        }
      // 서버 응답 처리
      if (result.available) {
        setIsNicknameAvailable(true);
        Alert.alert('닉네임 확인', '사용 가능한 닉네임입니다.');
      } else {
        setIsNicknameAvailable(false);
        Alert.alert('닉네임 중복', '이미 사용 중인 닉네임입니다.');
      }
    } catch (error) {
      console.error('Network Error:', error);
      Alert.alert('네트워크 오류', '서버와 연결할 수 없습니다.');
    }
  };

  const onSubmit = async () => {
    const nickname = nicknameRef.current.trim(); // ref에서 값 가져오기
    const password = passwordRef.current.trim(); // ref에서 값 가져오기
    if (!nickname || !password) {
        Alert.alert('회원가입', '모든 칸을 채워주세요!');
        return;
    }
    if (!isNicknameAvailable) {
        Alert.alert('회원가입', '닉네임 중복 확인을 진행해주세요.');
        return;
    }
    setLoading(true);
    try {
        const response = await fetch('http://192.168.162.32:8000/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nickname: nickname,
                password: password,
            }),
        });
        const data = await response.json();
        console.log('Registration response:', data); // 서버 응답 로그
        if (response.ok) {
            Alert.alert('회원가입 성공', `${nickname}님 환영합니다.`);
            router.push('login');
        } else {
            Alert.alert('회원가입 실패', data.detail || '다시 시도해주세요!');
        }
    } catch (error) {
        console.error('Network Error:', error);
        Alert.alert('네트워크 오류', '서버와 연결할 수 없습니다.');
    } finally {
        setLoading(false);
    }
  };


  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark"/>
        <BackButton router={router}/>
        {/* welcome */}
        <View style={styles.container}>
      <View>
          <Text style={styles.welcometText}>간편회원가입</Text>
      </View>
        {/* form */}
        <View style={styles.form}>
          <Text style={{fontSize: hp(3.3),color: theme.colors.text}}>
          계정을 만들기 위해 세부 정보를 입력해 주세요
          </Text>
          <View style={styles.nicknameContainer}>
              <Input
                  icon={<Icon name="user" size={26} strokeWidth={1.6} />}
                  placeholder='닉네임을 입력해주세요'
                  onChangeText={value => {
                    nicknameRef.current = value; // ref 업데이트
                    setIsNicknameAvailable(null); // 닉네임 중복 확인 상태 초기화
                  }}
                  containerStyles={styles.input} // Input 스타일을 적용
              />
              <Button
                   title={`${'\u00A0'}${'\u00A0'}${'\u00A0'}${'\u00A0'}${'\u00A0'}중복${'\u00A0'}${'\u00A0'}${'\u00A0'}${'\u00A0'}${'\u00A0'}\n${'\u00A0'}${'\u00A0'}${'\u00A0'}${'\u00A0'}${'\u00A0'}확인${'\u00A0'}${'\u00A0'}${'\u00A0'}${'\u00A0'}${'\u00A0'}`}
                  onPress={checkNicknameAvailability}
                  style={styles.checkButton}
                  textStyle={styles.checkButtonText}
                  disabled={!nicknameRef.current.trim()}
              />
          </View>
          <Input
            icon={<Icon name="lock" size={26} strokeWidth={1.6}/>}
            placeholder='비밀번호를 입력해주세요'
            secureTextEntry
            onChangeText={value => passwordRef.current = value}
            />
            {/* button */}
            <Button title={'회원가입'} loading={loading} onPress={onSubmit}/>
        </View>

        {/* footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            이미 계정이 있습니다!
          </Text>
          <Pressable onPress={()=>router.push('login')}>
            <Text style={[styles.footerText, {color:theme.colors.primaryDark, fontWeight: theme.fonts.semibold}]}>로그인하기</Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default Signup


const styles = StyleSheet.create({
  container: {
      flex: 1,
      gap: 35,
      paddingHorizontal: wp(5),
      paddingVertical: hp(10),
  },
  welcometText: {
    fontSize: hp(7),
    height: hp(10),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
  },
  form: {
    gap: 20,
  },
  nicknameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  input: {
      flex: 8,
      marginRight: 10,
  },
  checkButton: {
      flex: 2,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
      paddingVertical: hp(1),
      paddingHorizontal: wp(4),
  },
  checkButtonText: {
      fontSize: hp(3.5),
      fontWeight: theme.fonts.bold,
      textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  footerText: {
    textAlign: 'center',
    color: theme.colors.text,
    fontSize: hp(3.3),
  }
})