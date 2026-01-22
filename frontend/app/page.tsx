"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Home() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGoogleLogin = () => {
    console.log("Backend URL:", BACKEND_URL);
    window.location.href = `${BACKEND_URL}/api/auth/google`;
  };

  const handleLinkedInLogin = () => {
    window.location.href = `${BACKEND_URL}/api/auth/linkedin`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint =
        mode === "login" ? "/api/auth/login" : "/api/auth/register";

      const body =
        mode === "login"
          ? { email, password }
          : { email, password, name, linkedinProfileUrl: linkedinUrl };

      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/dashboard");
      } else {
        setError(data.message || "Authentication failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F3F6F8]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-[#0A66C2] mb-2">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-gray-600">
            {mode === "login"
              ? "Sign in to your account to continue"
              : "Register to start voting"}
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setMode("login");
              setError("");
            }}
            className={`flex-1 py-2 rounded-lg ${
              mode === "login"
                ? "bg-[#0A66C2] text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setMode("signup");
              setError("");
            }}
            className={`flex-1 py-2 rounded-lg ${
              mode === "signup"
                ? "bg-[#0A66C2] text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          {mode === "signup" && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="url"
                placeholder="LinkedIn Profile URL"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          {mode === "login" && (
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-[#0A66C2]"
              >
                Forgot Password?
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0A66C2] text-white rounded-lg"
          >
            {loading ? "Processing..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 border rounded-lg"
          >
            Continue with Google
          </button>

          <button
            onClick={handleLinkedInLogin}
            className="w-full py-3 bg-[#0A66C2] text-white rounded-lg"
          >
            Continue with LinkedIn
          </button>
        </div>
      </div>
    </div>
  );
}
