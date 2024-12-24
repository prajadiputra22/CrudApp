import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import HomeScreen from '../screens/Home';
import Search from '../screens/Search';

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  const translateY = useRef(new Animated.Value(0)).current;
  const isTabBarVisible = useRef(true);

  const showTabBar = () => {
    if (!isTabBarVisible.current) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
      isTabBarVisible.current = true;
    }
  };

  const hideTabBar = () => {
    if (isTabBarVisible.current) {
      Animated.timing(translateY, {
        toValue: 100,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();
      isTabBarVisible.current = false;
    }
  };

  const handleTouch = () => {
    showTabBar();
    setTimeout(() => hideTabBar(), 3000);
  };

  useEffect(() => {
    showTabBar();
    const timer = setTimeout(() => hideTabBar(), 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <TouchableWithoutFeedback onPress={handleTouch}>
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#4e2a84',
            tabBarInactiveTintColor: '#ddd',
            tabBarStyle: {
              backgroundColor: '#b291f5',
              transform: [{ translateY }],
              position: 'absolute',
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
                    width: 20,
                    height: 20,
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
                    width: 20,
                    height: 20,
                    tintColor: focused ? '#4e2a84' : '#ddd',
                  }}
                />
              ),
            }}
          />
        </Tab.Navigator>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default BottomTabNavigator;
