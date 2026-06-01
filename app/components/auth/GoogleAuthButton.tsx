"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { useGoogleAuth } from "@/app/api/features/auth/auth.queries";
import { AuthResponse } from "@/app/api/features/auth/types";
import { useAuth } from "@/app/components/context/AuthContext";

const getRedirectPath = (role?: string) => {
  if (role === "landlord") {
    return "/landlord/dashboard";
  }

  if (role === "tenant") {
    return "/tenant/dashboard";
  }

  return "/";
};

export default function GoogleAuthButton({
  mode,
}: {
  mode: "login" | "signup";
}) {
  const router = useRouter();
  const { login } = useAuth();
  const { mutate: authenticateWithGoogle, isPending } = useGoogleAuth();
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const handleAppAuthSuccess = (response: AuthResponse) => {
    const accessToken = response.accessToken ?? response.token;
    const role = response.user?.role ?? response.role;

    if (!accessToken) {
      toast.error("Google authentication succeeded but no token was returned.");
      return;
    }

    if (role) {
      login(accessToken, role, true);
      router.push(getRedirectPath(role));
      return;
    }

    Cookies.set("ACCESS_TOKEN", accessToken, {
      expires: 7,
      path: "/",
      secure: window.location.protocol === "https:",
      sameSite: "strict",
    });
    toast.info(
      "Google account connected. Complete your profile before using rental actions.",
    );
    router.push("/");
  };

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential;

    if (!idToken) {
      toast.error("Google did not return a valid credential.");
      return;
    }

    authenticateWithGoogle(
      { idToken },
      {
        onSuccess: (response) => {
          toast.success(
            mode === "signup"
              ? "Google signup successful"
              : "Google login successful",
          );
          handleAppAuthSuccess(response);
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || "Google authentication failed",
          );
        },
      },
    );
  };

  if (!clientId) {
    return (
      <button
        type="button"
        disabled
        className="w-full flex items-center justify-center gap-2 bg-[#ECF5ED] py-3 rounded-2xl text-xs font-bold text-gray-400 cursor-not-allowed"
        title="Set NEXT_PUBLIC_GOOGLE_CLIENT_ID to enable Google auth"
      >
        Google unavailable
      </button>
    );
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => toast.error("Google sign-in was cancelled or failed.")}
          text={mode === "signup" ? "signup_with" : "continue_with"}
          shape="pill"
          theme="outline"
          size="large"
          width="320"
        />
      </div>
      {isPending && (
        <p className="text-center text-xs text-gray-400">
          Finishing Google sign-in...
        </p>
      )}
    </div>
  );
}
