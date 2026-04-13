import { SignIn } from "@clerk/nextjs";
import { PiggyBank } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c0c0e] p-4 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,169,110,0.06),transparent_60%)]" />
      <div className="grid-pattern absolute inset-0 opacity-30" />
      <div className="flex flex-col items-center relative z-10">
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
        <SignIn
          fallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-[#16161a] border border-[#2a2a32] shadow-2xl shadow-black/50",
            },
          }}
        />
      </div>
    </div>
  );
}
