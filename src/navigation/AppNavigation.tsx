import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/Splash';
import DetailScreen from '../screens/Detail';
import DrawerNavigator from '../navigation/Drawer';

const Stack = createNativeStackNavigator();

const App = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const splashTimeout = setTimeout(() => {
      setIsSplashVisible(false);
    }, 2500);

    return () => clearTimeout(splashTimeout);
  }, []);

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

export default App;