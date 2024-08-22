import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { StatusBar } from 'expo-status-bar'
import { hp, wp } from '../helpers/common'
import { theme } from '../constants/theme'
import Button from '../components/Button'
import { useRouter } from 'expo-router'

const Welcome = () => {
    const router = useRouter();
  return (
    <ScreenWrapper bg="white">
        <StatusBar style="dark"/>
        <View style={styles.container}>
            {/* title */}     
            <View style={{gap:20, width: '80%', alignItems: 'center' }}>
            <Text style={styles.title}> PIP </Text>
            <Text style={styles.puncline}> 
            어디서나 자유롭게 소통하고{'\n'}
            개인정보가 안전하게 보호되는 방송
          </Text>
          </View>   
          {/* welcome image */}
          <Image style={styles.welcomeImage} resizeMode='contain' source={require('../assets/images/welcome.png')}/>
  
          {/* footer */}   
          <View style={styles.footer}>
            <Button
            title="시작하기"
            buttonStyle={{marginHorizontal: wp(3)}}
            onPress={()=>router.push('login')}
            />
            <View style={styles.bottomTextContainer}>
              <Text style={styles.loginText}>
               이미 계정이 있습니다!
               </Text>
               <Pressable onPress={()=>router.push('login')}>
                <Text style={[styles.loginText, {color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold}]}>
                  로그인
                </Text>
               </Pressable>
            </View>  
          </View>  
        </View>
    </ScreenWrapper>
  )
}

export default Welcome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        marginHorizontal: wp(4),
        paddingVertical: hp(19),
    },
    welcomeImage: {
      height: hp(50),
      width: wp(120),
      alignSelf: 'center',
    },
    title: {
      color: theme.colors.text,
      fontSize: hp(9),
      textAlign: 'center',
      fontWeight: theme.fonts.extraBold,
    },
    punchline: {
      textAlign: "center",
      paddingHorizontal: wp(5),
      fontSize: hp(4),
      color: theme.colors.text,
    },
    footer: {
      gap: 10,
      width: '100%',
    },
    bottomTextContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
    },
    loginText: {
      textAlign: "center",
      color: theme.colors.text,
      fontSize: hp(3.3),
      marginTop: hp(1)
    }
})