import React, { createContext, useState, useEffect } from 'react';
import { auth, signInAnonymously, onAuthStateChanged, signOut } from '../firebase/auth';
import { StorageService } from '../services/StorageService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [localAdminUser, setLocalAdminUser] = useState(() => {
    return StorageService.get('manish_admin_user', StorageService.get('hrj_admin_user', null));
  });
  const [loading, setLoading] = useState(true);
  const [adminRole, setAdminRole] = useState(() => {
    return StorageService.get('manish_admin_role', StorageService.get('hrj_admin_role', null));
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Persist admin role changes to local storage
  useEffect(() => {
    if (adminRole) {
      StorageService.set('manish_admin_role', adminRole);
    } else {
      StorageService.remove('manish_admin_role');
      StorageService.remove('hrj_admin_role');
    }
  }, [adminRole]);

  // Persist local admin user profile to local storage
  useEffect(() => {
    if (localAdminUser) {
      StorageService.set('manish_admin_user', localAdminUser);
    } else {
      StorageService.remove('manish_admin_user');
      StorageService.remove('hrj_admin_user');
    }
  }, [localAdminUser]);

  // Login anonymously for regular visitors
  const loginAnonymously = async () => {
    try {
      await signInAnonymously(auth);
    } catch (err) {
      console.warn("Anonymous authentication skipped:", err?.message);
    }
  };

  // Sign out user
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn("Sign-out warning:", err?.message);
    }
    StorageService.remove('manish_admin_role');
    StorageService.remove('manish_admin_user');
    StorageService.remove('hrj_admin_role');
    StorageService.remove('hrj_admin_user');
    setAdminRole(null);
    setLocalAdminUser(null);
  };

  const activeUser = currentUser || localAdminUser;

  return (
    <AuthContext.Provider
      value={{
        currentUser: activeUser,
        localAdminUser,
        setLocalAdminUser,
        loading,
        adminRole,
        setAdminRole,
        loginAnonymously,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export default AuthProvider;
