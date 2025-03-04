// app/dashboard/layout.tsx
"use client" 

import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#002419]">
        <div className="text-[#00DC82] text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in the useEffect
  }

  return <>{children}</>
}
