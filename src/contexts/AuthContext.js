/**
 * Authentication Context
 * Manages user authentication state and member data using Supabase Auth
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabaseConfig';
import { getMemberProfile, createMemberProfile } from '../services/supabaseService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [memberProfile, setMemberProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user session and member profile on mount
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        loadMemberProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session ? 'session exists' : 'no session');
      
      // Handle SIGNED_OUT event explicitly
      if (event === 'SIGNED_OUT' || !session) {
        setUser(null);
        setMemberProfile(null);
        setIsLoading(false);
        return;
      }
      
      // Only set user if we have a valid session
      if (session?.user) {
        setUser(session.user);
        await loadMemberProfile(session.user.id);
      } else {
        setUser(null);
        setMemberProfile(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load member profile from database
  const loadMemberProfile = async (userId) => {
    try {
      const profile = await getMemberProfile(userId);
      setMemberProfile(profile);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading member profile:', error);
      setIsLoading(false);
    }
  };

  // Sign in function
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        await loadMemberProfile(data.user.id);
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      console.error('Error signing in:', error);
      return { success: false, error: error.message || 'An error occurred during login' };
    }
  };

  // Sign up function
  const signUp = async (memberData) => {
    try {
      console.log('Attempting to sign up with Supabase...', { email: memberData.email });
      
      // First, sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: memberData.email,
        password: memberData.password,
        options: {
          data: {
            name: memberData.name,
            phone: memberData.phone || '',
            address: memberData.address || '',
            membership_type: memberData.membershipType,
          },
          emailRedirectTo: window.location.origin,
        },
      });

      console.log('Supabase signUp response:', { authData, authError });

      if (authError) {
        console.error('Supabase auth error:', authError);
        // Return a more user-friendly error message
        let errorMessage = authError.message;
        if (authError.message.includes('email') || authError.message.includes('invalid')) {
          errorMessage = 'Please check your email format and try again.';
        }
        return { success: false, error: errorMessage };
      }

      if (!authData.user) {
        console.error('No user returned from Supabase');
        return { success: false, error: 'Registration failed - no user created' };
      }

      console.log('User created successfully, creating member profile...', authData.user.id);

      // Create member profile in database
      const profileResult = await createMemberProfile({
        id: authData.user.id,
        name: memberData.name,
        phone: memberData.phone,
        address: memberData.address,
        membershipType: memberData.membershipType,
      });

      console.log('Member profile creation result:', profileResult);

      if (!profileResult.success) {
        console.error('Error creating member profile:', profileResult.error);
        // Still proceed if auth user was created
      }

      // Set user state
      setUser(authData.user);
      if (profileResult.data) {
        setMemberProfile(profileResult.data);
      }

      console.log('Sign up completed successfully');

      return { 
        success: true, 
        requiresEmailVerification: authData.user.email_confirmed_at === null 
      };
    } catch (error) {
      console.error('Error signing up:', error);
      return { success: false, error: error.message || 'An error occurred during registration' };
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      // Clear local state first for immediate UI feedback
      setUser(null);
      setMemberProfile(null);
      
      // Get the Supabase project URL to construct the exact storage key
      const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
      let projectRef = null;
      if (supabaseUrl) {
        try {
          // Extract project ref from URL (e.g., https://xxxxx.supabase.co -> xxxxx)
          const match = supabaseUrl.match(/https?:\/\/([^.]+)\.supabase\.co/);
          if (match) {
            projectRef = match[1];
          }
        } catch (e) {
          console.log('Could not extract project ref:', e);
        }
      }
      
      // FIRST: Aggressively clear all Supabase storage BEFORE calling signOut
      // This prevents Supabase from restoring the session
      if (typeof window !== 'undefined') {
        // Clear localStorage - get ALL keys first, then remove
        if (window.localStorage) {
          const allLocalKeys = [];
          // Collect all keys first (important: don't modify while iterating)
          for (let i = 0; i < window.localStorage.length; i++) {
            const key = window.localStorage.key(i);
            if (key) {
              allLocalKeys.push(key);
            }
          }
          console.log('All localStorage keys before cleanup:', allLocalKeys);
          // Now remove Supabase-related keys
          const removedKeys = [];
          allLocalKeys.forEach(key => {
            const keyLower = key.toLowerCase();
            if (key.startsWith('sb-') || 
                keyLower.includes('supabase') || 
                keyLower.includes('auth-token') ||
                keyLower.includes('auth') ||
                (projectRef && key.includes(projectRef))) {
              window.localStorage.removeItem(key);
              removedKeys.push(key);
              console.log('Cleared localStorage:', key);
            }
          });
          console.log('Removed keys:', removedKeys);
          // Log remaining keys to see what's left
          const remainingKeys = [];
          for (let i = 0; i < window.localStorage.length; i++) {
            remainingKeys.push(window.localStorage.key(i));
          }
          console.log('Remaining localStorage keys after cleanup:', remainingKeys);
        }
        
        // Clear sessionStorage - same approach
        if (window.sessionStorage) {
          const allSessionKeys = [];
          for (let i = 0; i < window.sessionStorage.length; i++) {
            const key = window.sessionStorage.key(i);
            if (key) {
              allSessionKeys.push(key);
            }
          }
          allSessionKeys.forEach(key => {
            const keyLower = key.toLowerCase();
            if (key.startsWith('sb-') || 
                keyLower.includes('supabase') || 
                keyLower.includes('auth')) {
              window.sessionStorage.removeItem(key);
              console.log('Cleared sessionStorage:', key);
            }
          });
        }
      }
      
      // NOW call Supabase signOut (storage is already cleared)
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out from Supabase:', error);
      }
      
      // Clear storage AGAIN after signOut to be absolutely sure
      // Supabase might have recreated the session during signOut
      if (typeof window !== 'undefined' && window.localStorage) {
        const allKeysAfterSignOut = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key) allKeysAfterSignOut.push(key);
        }
        console.log('localStorage keys after signOut call:', allKeysAfterSignOut);
        
        allKeysAfterSignOut.forEach(key => {
          const keyLower = key.toLowerCase();
          if (key.startsWith('sb-') || 
              keyLower.includes('supabase') || 
              keyLower.includes('auth')) {
            window.localStorage.removeItem(key);
            console.log('Cleared localStorage again:', key);
          }
        });
      }
      
      // Wait for cleanup to propagate
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Triple-check session is cleared
      const { data: { session: checkSession } } = await supabase.auth.getSession();
      if (checkSession) {
        console.error('CRITICAL: Session still exists after signOut!', checkSession);
        console.error('This means Supabase is restoring the session from somewhere');
        // Force clear storage one more time with even more aggressive matching
        if (typeof window !== 'undefined' && window.localStorage) {
          const allKeys = [];
          for (let i = 0; i < window.localStorage.length; i++) {
            const key = window.localStorage.key(i);
            if (key) allKeys.push(key);
          }
          console.log('Final cleanup - all keys:', allKeys);
          allKeys.forEach(key => {
            const keyLower = key.toLowerCase();
            // Be very aggressive - remove anything that might be related
            if (key.startsWith('sb-') || 
                keyLower.includes('supabase') || 
                keyLower.includes('auth') ||
                keyLower.includes('token') ||
                (projectRef && key.includes(projectRef))) {
              window.localStorage.removeItem(key);
              console.log('Force removed:', key);
            }
          });
      }
      setUser(null);
      setMemberProfile(null);
      } else {
        console.log('✅ Session successfully cleared - logout complete');
      }
      
      console.log('Logout completed - session should be cleared');
      return { success: true };
    } catch (error) {
      console.error('Error in signOut:', error);
      // Ensure state is cleared even on error
      setUser(null);
      setMemberProfile(null);
      // Also clear storage on error
      if (typeof window !== 'undefined' && window.localStorage) {
        const allKeys = Object.keys(window.localStorage);
        allKeys.forEach(key => {
          if (key.startsWith('sb-') || key.toLowerCase().includes('supabase') || key.toLowerCase().includes('auth')) {
            window.localStorage.removeItem(key);
          }
        });
      }
      return { success: false, error: error.message };
    }
  };

  // Legacy function names for backward compatibility
  const login = signIn;
  const logout = signOut;
  const register = signUp;

  // Get combined user data (auth user + member profile)
  const getUserData = () => {
    if (!user) return null;
    
    return {
      id: user.id,
      email: user.email,
      name: memberProfile?.name || user.user_metadata?.name || '',
      phone: memberProfile?.phone || '',
      address: memberProfile?.address || '',
      membershipType: memberProfile?.membership_type || user.user_metadata?.membership_type || '',
    };
  };

  const value = {
    user,
    memberProfile,
    isLoading,
    signIn,
    signUp,
    signOut,
    login, // Legacy support
    logout, // Legacy support
    register, // Legacy support
    isAuthenticated: user !== null, // Reactive boolean that updates when user changes
    getUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
