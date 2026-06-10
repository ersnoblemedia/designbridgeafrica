"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase, resilientDB, isSupabaseConfigured } from "../lib/supabase";

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: "Client" | "Designer" | "Admin";
  createdAt: string;
  updatedAt: string;
  savedPortfolios?: string[];
  portfolioUrl?: string;
  location?: string;
  bio?: string;
  accountCompleted?: boolean;
}

interface UserSession {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}

interface AuthContextType {
  user: UserSession | null;
  profile: UserProfile | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserRole: (role: "Client" | "Designer" | "Admin") => Promise<void>;
  updateProfile: (details: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  loginWithGoogle: async () => {},
  logout: async () => {},
  updateUserRole: async () => {},
  updateProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync / create profiles
  const fetchOrCreateProfile = async (sessionUser: UserSession) => {
    try {
      const existingProfile = await resilientDB.single("users", sessionUser.uid, "uid");
      if (existingProfile) {
        setProfile(existingProfile as UserProfile);
      } else {
        const newProfile: UserProfile = {
          uid: sessionUser.uid,
          email: sessionUser.email,
          displayName: sessionUser.displayName || "Bridge Creative",
          photoURL: sessionUser.photoURL || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${sessionUser.uid}`,
          role: "Client",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await resilientDB.upsert("users", newProfile, "uid");
        setProfile(newProfile);
      }
    } catch (err) {
      console.error("Error creating/fetching Supabase profile:", err);
    }
  };

  useEffect(() => {
    let authSubscription: any = null;

    if (isSupabaseConfigured()) {
      // Listen to real Supabase auth state change
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const sUser: UserSession = {
            uid: session.user.id,
            email: session.user.email || "",
            displayName: session.user.user_metadata?.full_name || "Bridge Creative",
            photoURL: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${session.user.id}`,
          };
          setUser(sUser);
          await fetchOrCreateProfile(sUser);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      });
      authSubscription = data.subscription;
    } else {
      // Setup mock / local auth persistence
      try {
        const cachedSession = localStorage.getItem("designbridge_auth_session");
        if (cachedSession) {
          const sUser: UserSession = JSON.parse(cachedSession);
          setUser(sUser);
          fetchOrCreateProfile(sUser);
        }
      } catch (err) {
        console.error("Local session parsing failed:", err);
      }
      setLoading(false);
    }

    return () => {
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: window.location.origin,
          },
        });
        if (error) throw error;
      } catch (err) {
        console.error("Supabase Google Auth failed:", err);
        setLoading(false);
      }
    } else {
      // Simulate OAuth login instantly for flawless UX
      const uids = ["usr_1", "usr_2", "usr_3"];
      const randId = uids[Math.floor(Math.random() * uids.length)];
      const mockUser: UserSession = {
        uid: randId,
        email: "ersnoblemedia@gmail.com",
        displayName: "Adewale Mensah",
        photoURL: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${randId}`,
      };
      
      try {
        localStorage.setItem("designbridge_auth_session", JSON.stringify(mockUser));
        setUser(mockUser);
        await fetchOrCreateProfile(mockUser);
      } catch (e) {
        console.error("Local login save error:", e);
      } finally {
        setLoading(false);
      }
    }
  };

  const logout = async () => {
    setLoading(true);
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error("Supabase SignOut failed:", err);
      }
    } else {
      try {
        localStorage.removeItem("designbridge_auth_session");
        setUser(null);
        setProfile(null);
      } catch (e) {
        console.error(e);
      }
    }
    setLoading(false);
  };

  const updateUserRole = async (role: "Client" | "Designer" | "Admin") => {
    if (!user) return;
    try {
      const updatedProfile = {
        ...profile,
        uid: user.uid,
        email: user.email,
        displayName: profile?.displayName || user.displayName,
        photoURL: profile?.photoURL || user.photoURL,
        role,
        updatedAt: new Date().toISOString()
      };
      await resilientDB.upsert("users", updatedProfile, "uid");
      setProfile(updatedProfile as UserProfile);
    } catch (err) {
      console.error("Error updating user role:", err);
    }
  };

  const updateProfile = async (details: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const updatedProfile = {
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: "Client" as const,
        createdAt: new Date().toISOString(),
        ...profile,
        ...details,
        uid: user.uid,
        email: user.email,
        updatedAt: new Date().toISOString()
      };
      await resilientDB.upsert("users", updatedProfile, "uid");
      
      // Keep direct Firestore in sync under standard collection layout
      try {
        const { doc, setDoc } = await import("firebase/firestore");
        const { db } = await import("../lib/firebase");
        await setDoc(doc(db, "users", user.uid), updatedProfile, { merge: true });
      } catch (fErr) {
        console.warn("Direct Firestore sync skipped or fallback used:", fErr);
      }
      
      setProfile(updatedProfile as UserProfile);
    } catch (err) {
      console.error("Error updating user profile:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, loginWithGoogle, logout, updateUserRole, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
