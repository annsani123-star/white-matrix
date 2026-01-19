"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

/* ----------------------------
   Inner Component (uses useSearchParams)
----------------------------- */
function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/"), 3000);
      } else {
        setError(data.message || "Failed to reset password");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="p-6 bg-white rounded-xl shadow">
          <h2 className="text-xl font-bold text-green-600">
            Password reset successful!
          </h2>
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>

        {error && (
          <div className="mb-3 text-red-600 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm password"
            className="w-full border p-2 rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/" className="text-blue-600 text-sm">
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------
   Page Component (Suspense wrapper)
----------------------------- */
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
