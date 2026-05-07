"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type UserRole = "admin" | "editor" | "viewer"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Permissions by role
const rolePermissions: Record<UserRole, string[]> = {
  admin: ["edit_profile", "edit_skills", "edit_experience", "edit_stats", "edit_education", "manage_users", "view_dashboard"],
  editor: ["edit_profile", "edit_skills", "edit_experience", "edit_stats", "view_dashboard"],
  viewer: ["view_dashboard"]
}

// Simulated JWT functions
function generateToken(user: User): string {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  }
  return btoa(JSON.stringify(payload))
}

function verifyToken(token: string): User | null {
  try {
    const payload = JSON.parse(atob(token))
    if (payload.exp < Date.now()) {
      return null
    }
    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role
    }
  } catch {
    return null
  }
}

// Mock users database
const mockUsers = [
  {
    id: "1",
    email: "admin@portfolio.dev",
    password: "admin123",
    name: "Sebastian Morales",
    role: "admin" as UserRole
  },
  {
    id: "2",
    email: "editor@portfolio.dev",
    password: "editor123",
    name: "Editor User",
    role: "editor" as UserRole
  }
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("portfolio-token")
    if (token) {
      const userData = verifyToken(token)
      if (userData) {
        setUser(userData)
      } else {
        localStorage.removeItem("portfolio-token")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password)
    
    if (!foundUser) {
      return { success: false, error: "Credenciales invalidas" }
    }

    const userData: User = {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
      role: foundUser.role
    }

    const token = generateToken(userData)
    localStorage.setItem("portfolio-token", token)
    setUser(userData)
    
    return { success: true }
  }

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const existingUser = mockUsers.find(u => u.email === email)
    if (existingUser) {
      return { success: false, error: "El email ya esta registrado" }
    }

    // In a real app, this would be saved to the database
    const newUser: User = {
      id: String(mockUsers.length + 1),
      email,
      name,
      role: "viewer"
    }

    mockUsers.push({ ...newUser, password })

    const token = generateToken(newUser)
    localStorage.setItem("portfolio-token", token)
    setUser(newUser)
    
    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem("portfolio-token")
    setUser(null)
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    return rolePermissions[user.role]?.includes(permission) || false
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
