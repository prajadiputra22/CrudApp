import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../firebase/config"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useAuth } from "./AuthContext"

type LoginProps = {
  navigation: NativeStackNavigationProp<any>
}

const Login: React.FC<LoginProps> = ({ navigation }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const { handleLogin, isAuthenticated, checkAuthStatus } = useAuth()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      navigation.replace("Main")
    }
  }, [isAuthenticated, navigation])

  const handleLoginPress = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email dan password tidak boleh kosong")
      return
    }

    setLoading(true)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log(userCredential)
      if (userCredential.user) {
        const user = {
          id: userCredential.user.uid,
          email: userCredential.user.email || "",
          // Add any other user properties you want to store
        }
        await handleLogin(user)
      }
    } catch (error: any) {
      let errorMessage = "Terjadi kesalahan saat login"

      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Format email tidak valid"
          break
        case "auth/user-disabled":
          errorMessage = "Akun ini telah dinonaktifkan"
          break
        case "auth/user-not-found":
          errorMessage = "Email tidak terdaftar"
          break
        case "auth/wrong-password":
          errorMessage = "Password salah"
          break
        case "auth/network-request-failed":
          errorMessage = "Koneksi gagal. Periksa koneksi internet Anda"
          break
      }

      Alert.alert("Login Error", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLoginPress}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Loading..." : "Login"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Register")} disabled={loading}>
        <Text style={styles.linkText}>Belum punya akun? Register</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#545b62",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "#fff",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#b291f5",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
    backgroundColor: "#9f83d5",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  linkText: {
    color: "#b291f5",
    marginTop: 15,
  },
})

export default Login

