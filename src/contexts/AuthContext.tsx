import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, telegramId?: string) => Promise<void>;
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

  async function signup(email: string, password: string, telegramId?: string) {
    try {
      console.log("--------->", email, telegramId);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log("---------> email and telegram Id", email, telegramId);
      
      // Save user data to Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        uid: result.user.uid,
        createdAt: new Date().toISOString(),
        ...(telegramId && { telegramId })
      });

      console.log("====================>")

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify({
        uid: result.user.uid,
        email: result.user.email
      }));

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
    });

    return unsubscribe;
  }, []);

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