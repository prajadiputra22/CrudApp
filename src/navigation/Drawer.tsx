import React from "react"
import { createDrawerNavigator, DrawerItemList, type DrawerContentComponentProps } from "@react-navigation/drawer"
import { View, Image, StyleSheet, TouchableOpacity, Text } from "react-native"
import { useNavigation } from "@react-navigation/native"
import BottomTabNavigator from "./TabNavigator"
import AddAnime from "../screens/AddAnime"
import { useAuth } from "../screens/authentication/AuthContext"

const Drawer = createDrawerNavigator()

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const navigation = useNavigation()
  const { handleLogout } = useAuth()

  const onLogoutPress = async () => {
    try {
      await handleLogout()
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  return (
    <View style={styles.drawerContent}>
      <Image source={require("../asset/logo.png")} style={styles.logo} />
      <DrawerItemList {...props} />
      <TouchableOpacity style={styles.logoutButton} onPress={onLogoutPress}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{
      headerStyle: {
        backgroundColor: "#b291f5",
      },
      headerTintColor: "#fff",
      drawerActiveBackgroundColor: "#545b62",
      drawerActiveTintColor: "#fff",
      headerTitleAlign: "center",
    }}
  >
    <Drawer.Screen
      name="MainTabs"
      component={BottomTabNavigator}
      options={{
        title: "Home",
        headerTitle: () => <Image source={require("../asset/logo.png")} style={styles.headerLogo} />,
      }}
    />
    <Drawer.Screen name="Add Anime" component={AddAnime} />
  </Drawer.Navigator>
)

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: "#b291f5",
    paddingTop: 30,
  },
  logo: {
    width: 300,
    height: 50,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 20,
  },
  headerLogo: {
    width: 100,
    height: 40,
    resizeMode: "contain",
  },
  logoutButton: {
    backgroundColor: "#545b62",
    padding: 10,
    margin: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
  },
})

export default DrawerNavigator