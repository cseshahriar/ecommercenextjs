"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/utils/axios";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("No token found");
        return;
      }

      try {
        const response = await api.get("/api/account/verify-email", {
          params: { token },
        });

        console.log(response.data);

        setStatus("Email verified successfully!");
      } catch (error) {
        console.log(error);

        setStatus("Invalid or expired token");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded text-center">
      <h2 className="text-xl font-bold">{status}</h2>
    </div>
  );
}