import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

// Local import
import { BACKEND_URL } from "../config";

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/auth/verify?token=${token}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setStatus("error");
        } else if (data.success) {
          setStatus("success");
        }
      } catch (error) {
        console.error("Error while sending token: \n", error);
      }
    })();
  }, [token]);

  if (status === "verifying") {
    return (
      <p className="mt-44 text-orange-500 text-2xl text-center font-medium">
        Verifying...
      </p>
    );
  }
  if (status === "success") {
    return (
      <h1 className="mt-44 text-blue-500 text-2xl text-center font-medium">
        Email verfired !!! Close the tab, and return to sign in page
      </h1>
    );
  }
  if (status === "error") {
    return (
      <p className="text-red-500 text-4xl md:text-2xl text-center font-medium -mt-44">
        Verification failed. The link may be expired.
      </p>
    );
  }
  return (
    <p className="text-red-500 text-4xl md:text-2xl text-center font-medium -mt-44">
      ABc
    </p>
  );
}
