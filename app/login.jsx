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

const Login = () => {
    const router = useRouter();
    const emailRef = useRef("");
    const passwordRef = useRef("")
    const [loading, setloading] = useState(false);

    const onSubmit = async() => {
      if(!emailRef.current || !passwordRef.current){
          Alert.alert('로그인','모든 칸을 채워주세요!');
          return
      }
    }

  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark"/>
        <BackButton router={router}/>
        {/* welcome */}
        <View style={styles.container}>
      <View>
          <Text style={styles.welcometText}>안녕하세요🖐️</Text>
          <Text style={styles.welcometText}>다시 오신 것을 환영합니다!</Text>
      </View>
        {/* form */}
        <View style={styles.form}>
          <Text style={{fontSize: hp(3.3),color: theme.colors.text}}>
          계속하려면 로그인해 주세요.
          </Text>
          <Input
            icon={<Icon name="mail" size={26} strokeWidth={1.6}/>}
            placeholder='이메일을 입력해주세요'
            onChangeText={value=>emailRef.current = value}
            />
          <Input
            icon={<Icon name="lock" size={26} strokeWidth={1.6}/>}
            placeholder='비밀번호를 입력해주세요'
            onChangeText={value=>passwordRef.current = value}
            />
            <Text style={styles.forgotPassword}>
              비밀번호를 잊어버리셨습니까?
            </Text>
            {/* button */}
            <Button title={'로그인'} loading={loading} onPress={onSubmit}/>
        </View>

        {/* footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            계정이 없나요?
          </Text>
          <Pressable onPress={()=>router.push('signUp')}>
            <Text style={[styles.footerText, {color:theme.colors.primaryDark, fontWeight: theme.fonts.semibold}]}>회원가입하기</Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default Login


const styles = StyleSheet.create({
  container: {
      flex: 1,
      gap: 45,
      paddingHorizontal: wp(5),
      paddingVertical: hp(10),
  },
  welcometText: {
    fontSize: hp(6.5),
    height: hp(10),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
  },
  form: {
    gap: 25,
  },
  forgotPassword: {
    textAlign: 'right',
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5
  },
  footerText: {
    textAlign: 'center',
    color: theme.colors.text,
    fontSize: hp(3.3)
  }
})