// SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface SplashScreenProps {
  onFinish: () => void; // Mendeklarasikan prop onFinish
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish(); // Memanggil onFinish setelah 2500ms
    }, 2500);

    return () => clearTimeout(timer); // Membersihkan timer saat komponen dibongkar
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <Image source={require('../asset/infonime.jpg')} style={styles.backgroundImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default SplashScreen;
