import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { SignJWT } from "jose"

// In production, this would be a database
const registeredUsers: Array<{
  id: string
  email: string
  passwordHash: string
  password: string
  name: string
  role: string
}> = []

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "portfolio-secret-key-change-in-production-32chars"
)

const COOKIE_NAME = "portfolio-auth-token"

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Password requirements
const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (password.length < 8) {
    return { valid: false, error: "La contraseña debe tener al menos 8 caracteres" }
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "La contraseña debe contener al menos una mayúscula" }
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "La contraseña debe contener al menos una minúscula" }
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: "La contraseña debe contener al menos un número" }
  }
  return { valid: true }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      )
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Formato de email inválido" },
        { status: 400 }
      )
    }

    // Validate name
    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: "El nombre debe tener al menos 2 caracteres" },
        { status: 400 }
      )
    }

    // Validate password
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 }
      )
    }

    // Check if email already exists (check both mock and registered)
    const existingUser = registeredUsers.find(u => u.email === email.toLowerCase())
    if (existingUser || email === "admin@portfolio.dev" || email === "editor@portfolio.dev") {
      return NextResponse.json(
        { error: "Este email ya está registrado" },
        { status: 409 }
      )
    }

    // In production: hash password with bcrypt
    // const passwordHash = await bcrypt.hash(password, 12)
    const passwordHash = `hashed_${password}`

    // Create user
    const newUser = {
      id: `user_${Date.now()}`,
      email: email.toLowerCase(),
      passwordHash,
      password, // Remove in production
      name: name.trim(),
      role: "viewer" // New users are viewers by default
    }

    registeredUsers.push(newUser)

    // Create JWT token
    const token = await new SignJWT({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
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
      maxAge: 60 * 60 * 24,
      path: "/"
    })

    return NextResponse.json({
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    }, { status: 201 })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
