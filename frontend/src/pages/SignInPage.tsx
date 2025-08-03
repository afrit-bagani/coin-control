import { useContext, useEffect, useRef, useState } from "react";
import { Link, useFetcher, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";

// local import
import { BACKEND_URL } from "../config";
import { Context } from "../context/ContextProvider";

export const signInAction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);
  try {
    const res = await fetch(`${BACKEND_URL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      toast.error(data.message);
      throw new Error(data.error);
    }
    localStorage.setItem("user", JSON.stringify(data.data.user));
    toast.success(data.message);
    return { user: data.data.user };
  } catch (error) {
    console.error("Error while logging user: \n", error);
  }
};

export default function SignInPage() {
  const { setUser } = useContext(Context);

  const fetcher = useFetcher();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const navigate = useNavigate();

  function togglePasswordVisibility() {
    setShowPassword((prev) => !prev);
  }

  const isSubmitting = fetcher.state === "submitting";
  const result = fetcher.data;

  // Prefill email and password from sessionStorage
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    const storedPassword = sessionStorage.getItem("password");
    if (emailRef.current) emailRef.current.value = storedEmail || "";
    if (passwordRef.current) passwordRef.current.value = storedPassword || "";

    // do some work before two paint cycle
    requestAnimationFrame(() => {
      sessionStorage.removeItem("email");
      sessionStorage.removeItem("password");
    });
  }, []);

  // Navigate user to home page
  useEffect(() => {
    if (result) {
      setUser(result.user);
      navigate("/home", { replace: true });
    }
  }, [result]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="min-w-md p-8 space-y-6 bg-white rounded-2xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-orange-600 text-2xl md:text-4xl font-bold ">
            Sign In
          </h1>
          <p className="text-sm md:text-lg text-gray-700 mt-1">
            Welcome Back, Please Login Into Your Account
          </p>
        </div>
        <fetcher.Form method="post" action="/signin" className="space-y-4">
          {/* Email */}
          <div className="text-sm text-gray-800 font-medium">
            <label htmlFor="email">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              ref={emailRef}
              placeholder="Enter your email"
              required
              title="Email"
              className="mt-1 w-full px-3 py-2 border border-gray-400 rounded-lg shadow-sm focus:bg-orange-50 focus:outline-none focus:border-orange-500"
            />
          </div>
          {/* Password */}
          <div className="text-sm text-gray-800 font-medium">
            <label htmlFor="password">
              Password<span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                ref={passwordRef}
                placeholder="Enter your password"
                required
                title="Password"
                onChange={(e) => setPasswordValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-lg shadow-sm focus:bg-orange-50 focus:outline-none focus:border-orange-500"
              />
              {passwordValue.length > 0 && (
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  aria-label="Toggle Password Visibilty"
                  className="absolute inset-y-0 right-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            title="Sign Up Button"
            className="w-full rounded-2xl font-semibold px-3- py-2 bg-orange-200 hover:bg-orange-300 text-orange-600 border border-orange-500 shadow-sm disabled:opacity-65"
          >
            {!isSubmitting ? "Sign In" : " Signing In..."}
          </button>
        </fetcher.Form>
        <div className="text-sm text-gray-600 text-center">
          <Link to="/signup">
            Do not have an account?{" "}
            <span className="text-blue-700 font-medium underline">Sign Up</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
