"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"

export default function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-[#002419] mt-20     ">
      <header className="bg-[#003626] border-b border-[#00DC82] p-4 px-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center text-white cursor-pointer">
              <User className="mr-2" size={20} />
              <span>{user?.name}</span>
            </div>
            {/* <Button
              onClick={logout}
              variant="outline"
              className="border-[#00DC82] text-[#00DC82] hover:bg-[#00DC82] hover:text-[#002419]"
            >
              <LogOut className="mr-2" size={16} />
              Logout
            </Button> */}
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="bg-[#003626] border border-[#00DC82] rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Welcome, {user?.name}!</h2>
          <p className="text-gray-300">You are now logged in to your account. This is your protected dashboard.</p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
           <div>Please choose a plan below and start your forex trading journey with Forex Mobsters, May pips be with you😊</div>
          </div>
        </div>
      </main>
    </div>
  )
}

