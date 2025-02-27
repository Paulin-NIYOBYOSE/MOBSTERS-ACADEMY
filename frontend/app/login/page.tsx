"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Both fields are required.");
      return;
    }
    if (password.length < 6) {
      setError("Invalid credentials.");
      return;
    }
    setError("");
    console.log("Logging in with:", email, password);
    router.push("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#002419]">
      <div className="w-full max-w-md bg-[#003626] p-8 rounded-xl shadow-2xl border border-[#00DC82]">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Login to Your Account
        </h2>

        {error && (
          <div className="flex items-center text-red-500 bg-red-900/30 p-3 mb-4 rounded-md">
            <AlertCircle className="mr-2" size={20} /> {error}
          </div>
        )}

        <div className="space-y-5">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#002f1e] text-white border border-[#00DC82] focus:ring-2 focus:ring-[#00DC82] rounded-md px-4 py-2"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#002f1e] text-white border border-[#00DC82] focus:ring-2 focus:ring-[#00DC82] rounded-md px-4 py-2"
          />
        </div>

        <Button onClick={handleLogin} className="w-full bg-[#00DC82] text-[#002419] font-semibold mt-6 rounded-lg hover:bg-[#00b56e]">
          Login
        </Button>

        <p className="text-gray-400 text-center mt-4">
          Don't have an account?{" "}
          <Link href="/signup" className="text-[#00DC82] hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
