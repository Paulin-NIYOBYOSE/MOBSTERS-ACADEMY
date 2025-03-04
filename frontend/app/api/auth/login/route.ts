import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { encrypt } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // In a real app, you would:
    // 1. Fetch user from database
    // 2. Verify password hash

    // For demo purposes, we'll accept any valid-looking credentials
    // IMPORTANT: This is just for demonstration!
    if (password.length < 6) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create mock user
    const user = {
      id: crypto.randomUUID(),
      name: email.split("@")[0], // Use part of email as name
      email,
    }

    // Create session
    const session = {
      user,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
    }

    // Encrypt session and set cookie
    const encryptedSession = encrypt(JSON.stringify(session))
    ;(await cookies()).set("session", encryptedSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

