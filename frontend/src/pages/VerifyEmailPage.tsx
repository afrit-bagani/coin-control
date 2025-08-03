import { useEffect, useState } from "react";
import { redirect, useSearchParams } from "react-router-dom";

// Local import
import { BACKEND_URL } from "../config";

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    fetch(`${BACKEND_URL}/auth/verify?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus("success");
        }
      })
      .catch((err) => {
        console.error("Error while sending token: \n", err);
        setStatus("error");
      });
  }, [token]);

  if (status === "loading") return <p>Verifying</p>;
  if (status === "success") {
    redirect("/sign-in");
    return (
      <h1 className="mt-44 text-blue-500 text-4xl text-center font-medium">
        Email verfired! You can now sign in.
      </h1>
    );
  }
  return <p>Verification failed. The link may be expired.</p>;
}
