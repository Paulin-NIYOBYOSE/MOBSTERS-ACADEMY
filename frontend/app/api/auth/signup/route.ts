import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { encrypt } from "@/lib/auth"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // In a real app, you would:
    // 1. Check if user already exists
    // 2. Hash the password
    // 3. Store user in database

    // For demo purposes, we'll create a mock user
    const user = {
      id: crypto.randomUUID(),
      name,
      email,
    }

    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
    }

    // Create session
    const session = {
      user: userWithoutPassword,
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

    return NextResponse.json({ user: userWithoutPassword, success: true }, { status: 201 })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

