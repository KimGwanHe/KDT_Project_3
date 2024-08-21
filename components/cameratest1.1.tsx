import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Camera, CameraType } from 'expo-camera';


export default function Backcamera() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  // const [facing, setFacing] = useState(CameraType.back);
  const [facing, setFacing] = useState<typeof CameraType[keyof typeof CameraType]>(CameraType.back);


  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissions();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>카메라 사용 권한이 필요합니다.</Text>
        <TouchableOpacity onPress={async () => await Camera.requestCameraPermissions()} style={styles.button}>
          <Text style={styles.buttonText}>권한 허용</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(facing === CameraType.back ? CameraType.front : CameraType.back);
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.buttonText}>카메라 전환</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
});