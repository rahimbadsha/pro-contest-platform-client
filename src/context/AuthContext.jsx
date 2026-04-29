import { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { axiosPublic } from '../hooks/useAxios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) || null; } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  const register = async (name, email, password, photoUrl = '') => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name, photoURL: photoUrl });
    // Register in DB
    await axiosPublic.post('/auth/register', { name, email, password, photoUrl });
    return cred;
  };

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    // Get JWT from our server
    const { data } = await axiosPublic.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    setDbUser(data.user);
    return cred;
  };

  const loginWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    const { user: fbUser } = cred;

    const saveSession = (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      setDbUser(data.user);
    };

    try {
      // Try login with uid as password (existing Google users)
      const { data } = await axiosPublic.post('/auth/login', {
        email: fbUser.email,
        password: fbUser.uid,
      });
      saveSession(data);
    } catch {
      // New Google user — register then login
      await axiosPublic.post('/auth/register', {
        name: fbUser.displayName || fbUser.email,
        email: fbUser.email,
        password: fbUser.uid,
        photoUrl: fbUser.photoURL || '',
      }).catch(() => {}); // ignore if already exists
      const { data } = await axiosPublic.post('/auth/login', {
        email: fbUser.email,
        password: fbUser.uid,
      });
      saveSession(data);
    }
    return cred;
  };

  const logout = async () => {
    await signOut(auth);
    await axiosPublic.post('/auth/logout').catch(() => {});
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setDbUser(null);
  };

  const refreshDbUser = async () => {
    try {
      const { data } = await axiosPublic.get('/user/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      localStorage.setItem('user', JSON.stringify(data.user));
      setDbUser(data.user);
    } catch {}
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      setUser(fbUser);
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, dbUser, loading, register, login, loginWithGoogle, logout, refreshDbUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
