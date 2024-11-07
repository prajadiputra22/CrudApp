import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Image, StyleSheet } from 'react-native';
import HomeScreen from './src/screens/Home'; // Pastikan import sudah benar
import AddAnime from './src/screens/AddAnime';
import SplashScreen from './src/screens/Splash';
import DetailScreen from './src/screens/Detail';
import { DrawerItemList, DrawerContentComponentProps } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const App = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const splashTimeout = setTimeout(() => {
      setIsSplashVisible(false);
    }, 2500);

    return () => clearTimeout(splashTimeout);
  }, []);

  // Custom Drawer content with logo
  const CustomDrawerContent = (props: DrawerContentComponentProps) => (
    <View style={styles.drawerContent}>
      <Image source={require('./src/asset/logo.png')} style={styles.logo} />
      <DrawerItemList {...props} />
    </View>
  );

  const DrawerNavigator = () => (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#b291f5',
        },
        headerStyle: {
          backgroundColor: '#b291f5',
        },
        headerTintColor: '#fff',
        drawerActiveBackgroundColor: '#545b62',
        drawerActiveTintColor: '#fff',
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Add Anime" component={AddAnime} />
    </Drawer.Navigator>
  );

  return (
    <NavigationContainer>
      {isSplashVisible ? (
        <SplashScreen onFinish={() => setIsSplashVisible(false)} />
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Main"
            component={DrawerNavigator}
            options={{ headerShown: false }} 
          />
          <Stack.Screen
            name="Detail"
            component={DetailScreen}
            options={{
              headerStyle: {
                backgroundColor: '#b291f5',
              },
              headerTintColor: '#fff',
            }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: '#b291f5',
    paddingTop: 30,
  },
  logo: {
    width: 300,
    height: 50,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
});

export default App;
