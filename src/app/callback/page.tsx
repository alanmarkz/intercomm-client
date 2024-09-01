"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
const Page = () => {
  const router = useRouter();
  useEffect(() => {
    const currentUrl = window.location.href;

    // Create a URLSearchParams object
    const urlParams = new URLSearchParams(currentUrl.split("?")[1]);

    // Extract the token and expires values
    const token = urlParams.get("token");
    const expires = urlParams.get("expires");

    if (token && expires) {
      // Convert expires to a date object
      const expirationDate = new Date(Number(expires) * 1000);

      // Save the token as a cookie
      document.cookie = `authToken=${token}; expires=${expirationDate.toUTCString()}; path=/`;

      router.push("/");
    }
  }, [router]);
};

export default Page;
