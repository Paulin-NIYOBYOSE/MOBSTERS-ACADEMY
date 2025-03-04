"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"

export default function SignupPage() {
  const router = useRouter()
  const { signup } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setError("All fields are required.")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const result = await signup(name, email, password)

      if (result.success) {
        router.push("/dashboard")
      } else {
        setError(result.error || "Signup failed")
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
        <h2 className="text-3xl font-bold text-center text-white mb-6">Create an Account</h2>

        {error && (
          <div className="flex items-center text-red-500 bg-red-900/30 p-3 mb-4 rounded-md">
            <AlertCircle className="mr-2" size={20} /> {error}
          </div>
        )}

        <div className="space-y-5">
          <Input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-white border border-[#00DC82] focus:ring-2 focus:ring-[#00DC82] rounded-md px-4 py-2"
            disabled={isLoading}
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-white border border-[#00DC82] focus:ring-2 focus:ring-[#00DC82] rounded-md px-4 py-2"
            disabled={isLoading}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full text-white border border-[#00DC82] focus:ring-2 focus:ring-[#00DC82] rounded-md px-4 py-2"
            disabled={isLoading}
          />
        </div>

        <Button
          onClick={handleSignup}
          className="w-full text-[#002419] font-semibold mt-6 rounded-lg hover:bg-[#00b56e]"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </Button>

        <p className="text-gray-400 text-center mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-[#00DC82] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

