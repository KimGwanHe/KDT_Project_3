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
    const emailRef = useRef("");
    const nameRef = useRef("")
    const passwordRef = useRef("")
    const [loading, setloading] = useState(false);

    const onSubmit = async() => {
      if(!emailRef.current || !passwordRef.current){
        Alert.alert('회원가입','모든 칸을 채워주세요!');
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
          <Text style={styles.welcometText}>간편회원가입</Text>
      </View>
        {/* form */}
        <View style={styles.form}>
          <Text style={{fontSize: hp(3.3),color: theme.colors.text}}>
          계정을 만들기 위해 세부 정보를 입력해 주세요
          </Text>
          <Input
            icon={<Icon name="user" size={26} strokeWidth={1.6}/>}
            placeholder='닉네임을 입력해주세요'
            onChangeText={value=>nameRef.current = value}
            />
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
  forgotPassword: {
    textAlign: 'right',
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text
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