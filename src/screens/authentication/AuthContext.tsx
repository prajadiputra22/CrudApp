import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface User {
  id: string
  email: string
  // Tambahkan properti user lainnya di sini
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  handleLogin: (user: User) => Promise<void>
  handleLogout: () => Promise<void>
  checkAuthStatus: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  handleLogin: async () => {},
  handleLogout: async () => {},
  checkAuthStatus: async () => {},
})

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const checkAuthStatus = async () => {
    try {
      const userJson = await AsyncStorage.getItem("@user")
      const tokenExpirationString = await AsyncStorage.getItem("@tokenExpiration")

      if (userJson && tokenExpirationString) {
        const loadedUser: User = JSON.parse(userJson)
        const tokenExpiration = new Date(tokenExpirationString)

        if (new Date() < tokenExpiration) {
          setUser(loadedUser)
          setIsAuthenticated(true)
        } else {
          // Token sudah kadaluarsa, hapus data
          await AsyncStorage.multiRemove(["@user", "@tokenExpiration"])
          setUser(null)
          setIsAuthenticated(false)
        }
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (e) {
      console.log("Error checking auth status:", e)
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const handleLogin = async (user: User) => {
    const tokenExpiration = new Date(new Date().getTime() + 24 * 60 * 60 * 1000) // Token berlaku 24 jam
    await AsyncStorage.setItem("@user", JSON.stringify(user))
    await AsyncStorage.setItem("@tokenExpiration", tokenExpiration.toISOString())
    setUser(user)
    setIsAuthenticated(true)
  }

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(["@user", "@tokenExpiration"])
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, handleLogin, handleLogout, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}

