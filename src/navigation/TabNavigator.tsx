import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import HomeScreen from '../screens/Home';
import Search from '../screens/Search';

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4e2a84',
        tabBarInactiveTintColor: '#ddd',
        tabBarStyle: {
          backgroundColor: '#b291f5',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../asset/home.png')}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#4e2a84' : '#ddd',
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../asset/search.png')}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#4e2a84' : '#ddd',
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;
