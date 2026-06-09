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

    // If backend returns 403 with needsProfileCompletion, return it as-is
    // so client interceptor can handle it
    if (res.status === 403 && data?.needsProfileCompletion) {
      return NextResponse.json(data, { status: 403 });
    }

    if (!res.ok) {
      // For any other non-200 response, return unauthorized
      return NextResponse.json(
        {
          isLoggedIn: false,
          userRole: null,
          message: data?.message ?? "Unable to verify authentication.",
        },
        { status: 200 },
      );
    }

    // Success case - return the user data with isLoggedIn flag
    return NextResponse.json(
      {
        ...data,
        isLoggedIn: true,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { isLoggedIn: false, userRole: null },
      { status: 200 },
    );
  }
}
