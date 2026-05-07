import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"

// In production, these would be in a database with hashed passwords
const mockUsers = [
  {
    id: "1",
    email: "admin@portfolio.dev",
    // In production: hashed with bcrypt
    passwordHash: "$2a$12$admin123hashedpassword",
    password: "admin123", // Only for demo - remove in production
    name: "Sebastian Morales",
    role: "admin"
  },
  {
    id: "2",
    email: "editor@portfolio.dev",
    passwordHash: "$2a$12$editor123hashedpassword",
    password: "editor123",
    name: "Editor User",
    role: "editor"
  }
]

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "portfolio-secret-key-change-in-production-32chars"
)

const COOKIE_NAME = "portfolio-auth-token"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      )
    }

    // Find user
    const user = mockUsers.find(u => u.email === email)
    
    if (!user) {
      // Security: same error for invalid email and password
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      )
    }

    // In production, use bcrypt.compare(password, user.passwordHash)
    const isValidPassword = user.password === password

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(JWT_SECRET)

    // Set HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/"
    })

    // Return user data (without sensitive info)
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
