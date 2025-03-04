import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // ✅ Correct way to clear the session cookie
  (await
        // ✅ Correct way to clear the session cookie
        cookies()).delete("session");

  // ✅ Return a simple success response
  return NextResponse.json({ success: true }, { status: 200 });
}
