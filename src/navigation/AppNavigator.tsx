import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator'; // Import TabNavigator
import DetailExample from '../screens/Detail/DetailExample';
import DrawerNavigator from './DrawerNavigator';
import StartScreen from '../screens/TabScreen/StartScreen';
import DetailExample2 from '../screens/Detail/DetailExample2';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="StartScreen">
        <Stack.Screen name="StartScreen" component={StartScreen} />
        <Stack.Screen
          name="Main"
          component={DrawerNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen name="DetailExample" component={DetailExample} />
        <Stack.Screen name="DetailExample2" component={DetailExample2} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
