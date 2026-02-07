import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider, getFCMToken } from '@/lib/firebase';
import { apiService } from '@/services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  fcmToken: string | null;
  userProfile: {
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
    emailVerified: boolean;
    role?: string;
    photo_url?: string | null;
  } | null;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
    emailVerified: boolean;
    role?: string;
    photo_url?: string | null;
  } | null>(null);

  // Keep backend in sync when auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      // Update user profile when user changes
      if (currentUser) {
      // Fetch user role, photo_url, and display_name from backend
      let userRole = 'user'; // default
      let photoUrl = null;
      let displayName = null;
      
      try {
        const idToken = await currentUser.getIdToken();
        const response = await apiService.request<{ role: string; photo_url?: string; display_name?: string }>('/api/v1/auth/me', {
          headers: {
            'Authorization': `Bearer ${idToken}`
          }
        });
        userRole = response.role || 'user';
        photoUrl = response.photo_url || null;
        displayName = response.display_name || null;
      } catch (e) {
        console.log('Could not fetch user data:', e);
      }
      
      setUserProfile({
        displayName: displayName || currentUser.displayName,
        email: currentUser.email,
        photoURL: currentUser.photoURL,
        emailVerified: currentUser.emailVerified,
        role: userRole,
        photo_url: photoUrl,
      });

        try {
          const idToken = await currentUser.getIdToken();
          const token = await getFCMToken();
          if (token) setFcmToken(token);
          
          // Determine provider - map Firebase provider IDs to our simplified values
          const firebaseProvider = currentUser.providerData?.[0]?.providerId || 'password';
          const provider = firebaseProvider === 'password' ? 'email' : 
                          firebaseProvider === 'google.com' ? 'google' : 
                          'email'; // default to email
          
          // Upsert user and optionally FCM token
          // IMPORTANT: Don't send display_name here to avoid overwriting the database value
          // Display name should only be set during signup or via the profile update endpoint
          await apiService.upsertMe(idToken, token || undefined, 'en', undefined, provider);
          
          // Send/refresh FCM token with Authorization header
          if (token) {
            await apiService.updateUserFCMToken(idToken, token, 'en');
          }
        } catch (e) {
          // non-fatal
          console.error('Failed syncing auth state to backend:', e);
        }
      } else {
        setFcmToken(null);
        setUserProfile(null);
      }
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: fullName });
      
      // Update user profile immediately (new users are always 'user' role)
      setUserProfile({
        displayName: fullName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        emailVerified: result.user.emailVerified,
        role: 'user',
      });
      
      // Upsert immediately after signup
      const idToken = await result.user.getIdToken();
      
      // Try to get FCM token, but don't fail if it doesn't work
      let token = null;
      try {
        token = await getFCMToken();
        if (token) setFcmToken(token);
      } catch (fcmError) {
        console.warn('FCM token not available:', fcmError);
      }
      
      // Send provider='email' for email signups
      await apiService.upsertMe(idToken, token || undefined, 'en', fullName, 'email');
      if (token) await apiService.updateUserFCMToken(idToken, token, 'en');
    } catch (error: any) {
      console.error("Firebase signup error:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Fetch user role, photo_url, and display_name from backend
    let userRole = 'user';
    let photoUrl = null;
    let displayName = null;
    let isNewUser = false;
    try {
      const idToken = await result.user.getIdToken();
      const response = await apiService.request<{ role: string; photo_url?: string; display_name?: string }>('/api/v1/auth/me', {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      userRole = response.role || 'user';
      photoUrl = response.photo_url || null;
      displayName = response.display_name || null;
      // If no display_name in DB, this is a new user
      isNewUser = !displayName;
    } catch (e) {
      console.log('Could not fetch user role, defaulting to "user"');
      isNewUser = true; // Assume new user if fetch fails
    }
    
    // Update user profile immediately
    setUserProfile({
      displayName: displayName || result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL,
      emailVerified: result.user.emailVerified,
      role: userRole,
      photo_url: photoUrl,
    });
    
    const idToken = await result.user.getIdToken();
    const token = await getFCMToken();
    if (token) setFcmToken(token);
    
    // Only send display_name for new Google users to avoid overwriting customized names
    const displayNameToSend = isNewUser ? (result.user.displayName || undefined) : undefined;
    await apiService.upsertMe(idToken, token || undefined, 'en', displayNameToSend, 'google');
    if (token) await apiService.updateUserFCMToken(idToken, token, 'en');
  };

  const logout = async () => {
    await signOut(auth);
    setFcmToken(null);
    setUserProfile(null);
  };

  const refreshUserProfile = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      const idToken = await currentUser.getIdToken();
      const response = await apiService.request<{ role: string; photo_url?: string; display_name?: string }>('/api/v1/auth/me', {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      
      setUserProfile({
        displayName: response.display_name || currentUser.displayName,
        email: currentUser.email,
        photoURL: currentUser.photoURL,
        emailVerified: currentUser.emailVerified,
        role: response.role || 'user',
        photo_url: response.photo_url || null,
      });
    } catch (e) {
      console.error('Failed to refresh user profile:', e);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    fcmToken,
    userProfile,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 