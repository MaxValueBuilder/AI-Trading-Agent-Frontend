import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

function getTelegramIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('telegramId')) return params.get('telegramId');
  if (params.has('token')) {
    try {
      const payload = JSON.parse(atob(params.get('token').split('.')[1]));
      if (payload.telegramId) return payload.telegramId.toString();
    } catch {}
  }
  return null;
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Extract telegramId from URL on first load
  const telegramId = getTelegramIdFromUrl();

  async function linkTelegramIdToUser(uid: string, telegramId: string) {
    if (!telegramId) return;
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      if (!userData.telegramId || userData.telegramId !== telegramId) {
        await updateDoc(userRef, { telegramId });
      }
    } else {
      await setDoc(userRef, { telegramId }, { merge: true });
    }
  }

  async function signup(email: string, password: string) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Save user data to Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        uid: result.user.uid,
        createdAt: new Date().toISOString(),
        ...(telegramId ? { telegramId } : {})
      });
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify({
        uid: result.user.uid,
        email: result.user.email
      }));
      // Link telegramId if present
      if (telegramId) {
        await linkTelegramIdToUser(result.user.uid, telegramId);
      }
      toast({
        title: "Account created successfully",
        description: "Welcome to Crypto AI Agent!"
      });
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  }

  async function login(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify({
        uid: result.user.uid,
        email: result.user.email
      }));
      // On login, update telegramId if present and changed
      if (telegramId) {
        await linkTelegramIdToUser(result.user.uid, telegramId);
      }
      toast({
        title: "Welcome back!",
        description: "Successfully signed in."
      });
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      toast({
        title: "Signed out",
        description: "You have been successfully signed out."
      });
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      // On login, if telegramId is present, link it
      if (user && telegramId) {
        linkTelegramIdToUser(user.uid, telegramId);
      }
    });
    return unsubscribe;
  }, [telegramId]);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}