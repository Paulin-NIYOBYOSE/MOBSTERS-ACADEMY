"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check both context token and localStorage
    const authToken = token || localStorage.getItem('token');
    
    if (!authToken) {
      router.push("/login");
    } else {
      setIsReady(true);
    }
  }, [token, router]);

  if (!isReady) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
}