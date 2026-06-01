import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ACCESS_TOKEN")?.value;

  if (!token) {
    return NextResponse.json(
      { isLoggedIn: false, userRole: null },
      { status: 200 },
    );
  }

  try {
    const res = await fetch("https://idu-group-backend.onrender.com/auth/me", {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        {
          isLoggedIn: false,
          userRole: null,
          message: data?.message ?? "Unable to verify authentication.",
        },
        { status: 200 },
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { isLoggedIn: false, userRole: null },
      { status: 200 },
    );
  }
}
