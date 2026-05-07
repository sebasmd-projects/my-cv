import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const COOKIE_NAME = "portfolio-auth-token"

export async function POST() {
  try {
    const cookieStore = await cookies()
    
    // Clear the auth cookie
    cookieStore.set(COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/"
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      { error: "Error al cerrar sesión" },
      { status: 500 }
    )
  }
}
