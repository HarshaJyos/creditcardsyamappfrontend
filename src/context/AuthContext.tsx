import React, { createContext, useContext, useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";
import { GoogleSignin, User } from "@react-native-google-signin/google-signin";
import * as SecureStore from "expo-secure-store";
import api from "../api/api";
import { ICustomer } from "../../shared/types";

interface AuthContextType {
  user: ICustomer | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: ICustomer | null) => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>({
  user: null,
  loading: false,
  error: null,
  signUp: async () => {},
  login: async () => {},
  googleLogin: async () => {},
  logout: async () => {},
  setUser: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within AuthContextProvider");
  return context;
};

const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [error, setError] = React.useState<string | null>(null);
  const [user, setUserState] = useState<ICustomer | null>(null);

  // Set user state with ICustomer or null
  const setUser = (user: ICustomer | null) => {
    setUserState(user);
  };
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Configure Google Sign-In
    GoogleSignin.configure({
      webClientId:
        "599757311255-uct94hit35oh1qdeua3q6eblecodeog5.apps.googleusercontent.com",
    });

    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const token = await firebaseUser.getIdToken();
          await SecureStore.setItemAsync("authToken", token);
          // Sync with backend
          const response = await api.post("/auth/sync", {
            firebaseUid: firebaseUser.uid,
          });
          setUser(response.data);
        } else {
          setUser(null);
          await SecureStore.deleteItemAsync("authToken");
        }
      } catch (error: any) {
        console.error("Auth state error:", error.message);
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      const credential = await auth().createUserWithEmailAndPassword(
        email,
        password
      );
      const response = await api.post("/auth/register", {
        firebaseUid: credential.user.uid,
        email,
        firstName,
        lastName,
      });
      setUser(response.data);
    } catch (error: any) {
      throw new Error(error.message || "Sign-up failed");
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const credential = await auth().signInWithEmailAndPassword(
        email,
        password
      );
      const response = await api.post("/auth/sync", {
        firebaseUid: credential.user.uid,
      });
      setUser(response.data);
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    }
  };

  const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(
        "Google Sign-In response:",
        JSON.stringify(userInfo, null, 2)
      );
      const idToken =
        (userInfo as any).idToken ||
        (userInfo as any).data?.idToken ||
        (userInfo as any).user?.idToken; // Get idToken from userInfo.user.idToken
      if (!idToken) {
        throw new Error("No ID token received from Google Sign-In");
      }
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const credential = await auth().signInWithCredential(googleCredential);
      const { uid, email, displayName } = credential.user;
      const [firstName, ...lastNameParts] = (
        displayName || email!.split("@")[0]
      ).split(" ");
      const response = await api.post("/auth/sync", { firebaseUid: uid });
      setUser({
        firebaseUid: uid,
        email: email!,
        firstName,
        lastName: lastNameParts.join(" ") || "User",
        ...response.data,
      } as ICustomer);
    } catch (error: any) {
      console.error("Google Sign-In error:", error.message);
      throw new Error(error.message || "Google Sign-In failed");
    }
  };
  const logout = async () => {
    try {
      await auth().signOut();
      await SecureStore.deleteItemAsync("authToken");
      setUser(null);
    } catch (error: any) {
      console.error("Logout error:", error.message);
      throw new Error(error.message || "Logout failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signUp,
        login,
        googleLogin,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
