"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // wait for client-side to access localStorage
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
      router.push("/auth/login"); // or wherever your login is
    }
  }, [router]);

  if (!isClient) return null;

  return <>{children}</>;
}
