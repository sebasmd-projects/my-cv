import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "portfolio-secret-key-change-in-production-32chars"
)

const COOKIE_NAME = "portfolio-auth-token"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)

    if (!token?.value) {
      return NextResponse.json({ user: null })
    }

    try {
      const { payload } = await jwtVerify(token.value, JWT_SECRET)

      return NextResponse.json({
        user: {
          id: payload.id,
          email: payload.email,
          name: payload.name,
          role: payload.role
        }
      })
    } catch {
      // Token is invalid or expired - clear it
      cookieStore.set(COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/"
      })

      return NextResponse.json({ user: null })
    }
  } catch (error) {
    console.error("Session error:", error)
    return NextResponse.json({ user: null })
  }
}
