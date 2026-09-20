"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function AccountMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  if (!user) return null;

  async function handleSignOut() {
    setOpen(false);
    try {
      await signOut();
    } catch (err) {
      console.error("Sign-out error:", err);
    } finally {
      router.push("/");
    }
  }

  const initial = (user.displayName || user.email || "U").charAt(0).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 rounded-full overflow-hidden border border-[#2a2a32] flex items-center justify-center bg-[#c9a96e] text-[#0c0c0e] text-sm font-semibold shrink-0"
        aria-label="Account menu"
      >
        {user.photoURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
        ) : (
          initial
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-[#2a2a32] bg-[#16161a] shadow-xl z-50 overflow-hidden">
          <div className="px-3 py-2.5 border-b border-[#2a2a32]">
            <p className="text-sm text-[#ededef] font-medium truncate">
              {user.displayName || "User"}
            </p>
            <p className="text-xs text-[#5a5a66] truncate">{user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-[#8b8b96] hover:text-[#ededef] hover:bg-[#1e1e24] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
