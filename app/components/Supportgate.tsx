"use client";

import { usePathname } from "next/navigation";
import Support from "./Support";

const HIDDEN_PATHS = ["/login", "/signup"];

export default function SupportGate() {
  const pathname = usePathname();
  const isHidden = HIDDEN_PATHS.some(
    (path) => pathname === path || pathname?.startsWith(`${path}/`),
  );

  if (isHidden) return null;

  return <Support />;
}
