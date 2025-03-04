import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";

export async function GET() {
  try {
    const sessionCookie = (await cookies()).get("session");

    if (!sessionCookie?.value) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const decryptedSession = decrypt(sessionCookie.value);
    const session = JSON.parse(decryptedSession);

    // ✅ If session is expired, delete the cookie and return 401
    if (!session.user || new Date(session.expires) < new Date()) {
      (await cookies()).delete("session");
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user: session.user });
  } catch (error) {
    console.error("Session validation error:", error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
