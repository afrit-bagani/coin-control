import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

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

  if (status === "loading") {
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
  return (
    <p className="text-red-500 text-4xl md:text-2xl text-center font-medium -mt-44">
      Verification failed. The link may be expired.
    </p>
  );
}
