"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Both fields are required.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const result = await login(email, password)

      if (result.success) {
        router.push("/dashboard")
      } else {
        setError(result.error || "Login failed")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#002419]">
      <div className="w-full max-w-md bg-[#003626] p-8 rounded-xl shadow-2xl border border-[#00DC82]">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Login to Your Account</h2>

        {error && (
          <div className="flex items-center text-red-500 bg-red-900/30 p-3 mb-4 rounded-md">
            <AlertCircle className="mr-2" size={20} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#002f1e] text-white border border-[#00DC82] focus:ring-2 focus:ring-[#00DC82] rounded-md px-4 py-2"
            disabled={isLoading}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#002f1e] text-white border border-[#00DC82] focus:ring-2 focus:ring-[#00DC82] rounded-md px-4 py-2"
            disabled={isLoading}
          />
          <Button
            type="submit"
            className="w-full bg-[#00DC82] text-[#002419] font-semibold mt-6 rounded-lg hover:bg-[#00b56e]"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-gray-400 text-center mt-4">
          Don't have an account?{" "}
          <Link href="/signup" className="text-[#00DC82] hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}

