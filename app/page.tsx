"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
      const token = sessionStorage.getItem("token");

      if (!token) {
          router.push("/login");
      } else {
          router.push("/");
      }

  }, [router]);

  return (
    <main className="sm:ml-14 p-4">
      <h1>Welcome to the Home Page</h1>
    </main>
  );
}
