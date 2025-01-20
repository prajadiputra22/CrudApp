import React, { useState, useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import SplashScreen from "../screens/Splash"
import DetailScreen from "../screens/Detail"
import DrawerNavigator from "../navigation/Drawer"
import Login from "../screens/authentication/Login"
import Register from "../screens/authentication/Register"
import { AuthProvider, useAuth } from "../screens/authentication/AuthContext"

const Stack = createNativeStackNavigator()

const AppContent = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true)
  const { isAuthenticated, checkAuthStatus } = useAuth()

  useEffect(() => {
    const initApp = async () => {
      await checkAuthStatus()
      const splashTimeout = setTimeout(() => {
        setIsSplashVisible(false)
      }, 2500)

      return () => clearTimeout(splashTimeout)
    }

    initApp()
  }, [checkAuthStatus])

  if (isSplashVisible) {
    return <SplashScreen onFinish={() => setIsSplashVisible(false)} />
  }

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? "Main" : "Login"}
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={DrawerNavigator} options={{ headerShown: false }} />
          <Stack.Screen
            name="Detail"
            component={DetailScreen}
            options={{
              headerShown: true,
              headerStyle: {
                backgroundColor: "#b291f5",
              },
              headerTintColor: "#fff",
            }}
          />
        </>
      )}
    </Stack.Navigator>
  )
}

const AppNavigation = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </AuthProvider>
  )
}

export default AppNavigation

