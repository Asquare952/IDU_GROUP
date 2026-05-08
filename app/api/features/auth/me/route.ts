import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://idu-group-backend.onrender.com/auth/me", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { isLoggedIn: false, userRole: null },
      { status: 200 },
    );
  }
}
