"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PiggyBank, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function SignInPage() {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (err) {
      console.error("Sign-in error:", err);
      setError("Failed to sign in. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c0c0e] p-4 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,169,110,0.06),transparent_60%)]" />
      <div className="grid-pattern absolute inset-0 opacity-30" />
      <div className="flex flex-col items-center relative z-10 w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-[#c9a96e] flex items-center justify-center">
            <PiggyBank className="w-5 h-5 text-[#0c0c0e]" />
          </div>
          <span className="text-xl font-semibold text-[#ededef] tracking-tight">
            Foretrack AI
          </span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#ededef] mb-2 text-center tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-[#5a5a66] mb-8">
          Sign in to continue to your dashboard
        </p>

        <div className="w-full bg-[#16161a] border border-[#2a2a32] rounded-xl shadow-2xl shadow-black/50 p-6">
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg font-semibold text-sm bg-[#ededef] text-[#0c0c0e] hover:bg-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Continue with Google
          </button>
          {error && (
            <p className="text-xs text-[#f87171] mt-3 text-center">{error}</p>
          )}
        </div>

        <p className="text-xs text-[#5a5a66] mt-6 text-center">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-[#c9a96e] hover:text-[#d4b87e] font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
