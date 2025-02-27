"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#002419] text-white text-center">
      <h1 className="text-6xl font-bold text-[#00DC82] mb-4">404</h1>
      <p className="text-xl text-gray-300 mb-2">
        Sorry about that! It looks like this page doesn’t exist.
      </p>
      <button
        onClick={() => router.push("/")}
        className="mt-6 px-6 py-3 bg-[#00DC82] text-[#002419] font-semibold rounded-lg hover:bg-[#00b56e] transition-all"
      >
        Go Home
      </button>
    </div>
  );
}
