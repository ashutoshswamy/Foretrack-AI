"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function syncSessionCookie(firebaseUser: User) {
  const idToken = await firebaseUser.getIdToken();
  await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      // Firebase's client session persists indefinitely across reloads,
      // but the httpOnly session cookie the API routes check expires
      // after 5 days. Re-sync it here so a stale/missing cookie doesn't
      // leave the client thinking it's signed in while every API call 401s.
      if (firebaseUser) {
        try {
          await syncSessionCookie(firebaseUser);
        } catch (err) {
          console.error("Failed to sync session cookie:", err);
        }
      }
      setUser(firebaseUser);
      setLoading(false);
    });
  }, []);

  async function signInWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider);
    await syncSessionCookie(result.user);
  }

  async function signOut() {
    try {
      await fetch("/api/auth/session", { method: "DELETE" });
    } catch (err) {
      console.error("Failed to clear session cookie:", err);
    }
    await firebaseSignOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
