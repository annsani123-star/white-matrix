"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LinkedInProfilePage() {
  const router = useRouter();
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if user is authenticated and already has LinkedIn URL
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
          credentials: "include",
        });

        if (!response.ok) {
          router.push("/");
          return;
        }

        const data = await response.json();
        
        // If user already has LinkedIn URL, redirect to dashboard
        if (data.linkedinProfileUrl) {
          router.push("/dashboard");
          return;
        }
        
        setCheckingAuth(false);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/");
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic LinkedIn URL validation
    if (!linkedinUrl.trim()) {
      setError("Please enter your LinkedIn profile URL");
      return;
    }

    if (!linkedinUrl.includes("linkedin.com")) {
      setError("Please enter a valid LinkedIn URL");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/update-linkedin-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ linkedinProfileUrl: linkedinUrl }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update LinkedIn URL");
      }

      // Redirect to dashboard after successful update
      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating LinkedIn URL:", error);
      setError(error instanceof Error ? error.message : "Failed to update LinkedIn URL");
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F6F8]">
        <div className="text-[#0A66C2] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F6F8] p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-[#0A66C2] mb-2">
              LinkedIn Profile
            </h1>
            <p className="text-gray-600">
              Please provide your LinkedIn profile URL to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn Profile URL
              </label>
              <input
                type="text"
                id="linkedinUrl"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://www.linkedin.com/in/yourprofile"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent"
                disabled={loading}
              />
              <p className="mt-2 text-sm text-gray-500">
                Example: https://www.linkedin.com/in/john-doe-123456
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-300 rounded-lg p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Continue to Dashboard"}
            </button>
          </form>

          {/* Helper Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              To find your LinkedIn URL, go to your LinkedIn profile and copy the URL from your browser's address bar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
