import React from 'react';
import { createDrawerNavigator, DrawerItemList, DrawerContentComponentProps } from '@react-navigation/drawer';
import { View, Image, StyleSheet } from 'react-native';
import BottomTabNavigator from './TabNavigator';
import AddAnime from '../screens/AddAnime';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props: DrawerContentComponentProps) => (
  <View style={styles.drawerContent}>
    <Image source={require('../asset/logo.png')} style={styles.logo} />
    <DrawerItemList {...props} />
  </View>
);

const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{
      headerStyle: {
        backgroundColor: '#b291f5',
      },
      headerTintColor: '#fff',
      drawerActiveBackgroundColor: '#545b62',
      drawerActiveTintColor: '#fff',
      headerTitleAlign: 'center',
    }}
  >
    <Drawer.Screen 
      name="Home" 
      component={BottomTabNavigator}
      options={{
        headerTitle: () => (
          <Image source={require('../asset/logo.png')} style={styles.headerLogo} />
        ),
      }}
    />
    <Drawer.Screen name="Add Anime" component={AddAnime} />
  </Drawer.Navigator>
);

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
  headerLogo: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
  },
});

export default DrawerNavigator;
