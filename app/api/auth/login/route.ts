import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { signJWT } from "@/lib/auth/jwt"

// In production, these would be in a database with hashed passwords
const mockUsers = [
  {
    id: "1",
    email: "admin@portfolio.dev",
    password: "Admin123!",
    name: "Sebastian Morales",
    role: "admin"
  },
  {
    id: "2",
    email: "editor@portfolio.dev",
    password: "Editor123!",
    name: "Editor User",
    role: "editor"
  }
]

const COOKIE_NAME = "portfolio-auth-token"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      )
    }

    const user = mockUsers.find(u => u.email === email)
    
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      )
    }

    const token = await signJWT({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })

    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/"
    })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
