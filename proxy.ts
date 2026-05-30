import { NextResponse, type NextRequest } from "next/server";

type DashboardRole = "landlord" | "tenant" | "admin";

const protectedRoutes: Array<{
  prefix: string;
  loginPath: string;
  requiredRole: DashboardRole;
}> = [
  {
    prefix: "/landlord",
    loginPath: "/login",
    requiredRole: "landlord",
  },
  {
    prefix: "/tenant",
    loginPath: "/login",
    requiredRole: "tenant",
  },
  {
    prefix: "/super-admin",
    loginPath: "/super-admin/login",
    requiredRole: "admin",
  },
];

const publicSuperAdminPaths = new Set([
  "/super-admin/login",
  "/super-admin/signup",
]);

const decodeTokenPayload = (token: string): Record<string, unknown> => {
  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return {};
    }

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      "=",
    );
    const decodedPayload = atob(paddedPayload);

    return JSON.parse(decodedPayload) as Record<string, unknown>;
  } catch {
    return {};
  }
};

const getRoleFromRequest = (request: NextRequest): DashboardRole | null => {
  const cookieRole = request.cookies.get("USER_ROLE")?.value;

  if (cookieRole === "landlord" || cookieRole === "tenant") {
    return cookieRole;
  }

  const token = request.cookies.get("ACCESS_TOKEN")?.value;

  if (!token) {
    return null;
  }

  const payload = decodeTokenPayload(token);
  const tokenRole = payload.role;

  if (tokenRole === "landlord" || tokenRole === "tenant") {
    return tokenRole;
  }

  if (
    tokenRole === "admin" ||
    tokenRole === "super-admin" ||
    tokenRole === "super_admin" ||
    payload.is_superadmin === true
  ) {
    return "admin";
  }

  return null;
};

const redirectToLogin = (request: NextRequest, loginPath: string) => {
  const url = request.nextUrl.clone();
  const loginUrl = new URL(loginPath, request.url);

  loginUrl.searchParams.set("redirectTo", `${url.pathname}${url.search}`);

  return NextResponse.redirect(loginUrl);
};

const redirectForRole = (request: NextRequest, role: DashboardRole) => {
  const redirectPath =
    role === "admin"
      ? "/super-admin/dashboard"
      : role === "landlord"
        ? "/landlord/dashboard"
        : "/tenant/dashboard";

  return NextResponse.redirect(new URL(redirectPath, request.url));
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const matchedRoute = protectedRoutes.find((route) =>
    pathname.startsWith(route.prefix),
  );

  if (!matchedRoute || publicSuperAdminPaths.has(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("ACCESS_TOKEN")?.value;

  if (!token) {
    return redirectToLogin(request, matchedRoute.loginPath);
  }

  const role = getRoleFromRequest(request);

  if (!role) {
    return matchedRoute.requiredRole === "admin"
      ? NextResponse.next()
      : redirectToLogin(request, matchedRoute.loginPath);
  }

  if (role !== matchedRoute.requiredRole) {
    return redirectForRole(request, role);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/landlord/:path*", "/tenant/:path*", "/super-admin/:path*"],
};
