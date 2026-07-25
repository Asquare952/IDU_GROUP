import type { Metadata } from "next";
import "./globals.css";
import Providers from "./Provider";
import ToastProvider from "./components/ToastProvider";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./components/context/AuthContext";
import GoogleOAuthClientProvider from "./components/auth/GoogleOAuthClientProvider";
import { AdminAuthProvider } from "./providers/AdminAuthProvider";
import { SupportProvider } from "./providers/SupportProvider";
import SupportGate from "./components/Supportgate";

export const metadata: Metadata = {
  title: "RentULO",
  description:
    "Finding house easily and quickly with RentULO - your trusted rental platform. Discover a wide range of rental properties, from cozy apartments to spacious houses, all in one place. With our user-friendly interface and powerful search features, you can easily find your perfect home. Whether you're a tenant looking for a new place or a landlord seeking reliable tenants, RentULO has got you covered. Start your rental journey with us today and experience the convenience of finding your ideal home with RentULO.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <GoogleOAuthClientProvider>
            <AdminAuthProvider>
              <AuthProvider>
                <SupportProvider>
                  <main>{children}</main>
                  <SupportGate />
                </SupportProvider>
              </AuthProvider>
            </AdminAuthProvider>
          </GoogleOAuthClientProvider>
          <ToastProvider />
        </Providers>
      </body>
    </html>
  );
}
