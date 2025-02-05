import { ReactNode, createContext, useEffect, useState } from "react";
import { IShowToast } from "@/utils/IShowToast";
import { api } from "@/services/apiClient";
import { setCookie, destroyCookie, parseCookies } from "nookies";
import Router from "next/router";

interface ISignInCredentials {
  email: string;
  password: string;
  showToast: (infoToast: IShowToast) => void;
}

interface IUser {
  id: string;
  name: string;
  road: string;
  number: string;
  identifier: string;
  neighborhood: string;
  telephone: string;
  email: string;
  avatar: string;
  avatarUrl: string;
  isAdmin: boolean;
  user_type: string;
  sex?: string;
  functionn?: string;
  ability?: string;
  is_employee?: boolean;
  curriculum?: string;
  business_area?: string;
}

interface IAuthContextData {
  signIn(credentials: ISignInCredentials): Promise<void>;
  user: IUser | undefined;
  isAuthenticated: boolean;
}

interface IAuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({} as IAuthContextData);
let authChannel: BroadcastChannel;

function signOut(): void {
  destroyCookie(undefined, "token.token");
  destroyCookie(undefined, "token.refreshToken");

  authChannel.postMessage("signOut");

  Router.push("/");
}

function AuthProvider({ children }: IAuthProviderProps) {
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const isAuthenticated = !!user;

  function saveTokens(token: string, refreshToken: string): void {
    setCookie(undefined, "token.token", token, {
      maxAge: 60 * 60 * 1, // 1 hora
      path: "/",
    });
    setCookie(undefined, "token.refreshToken", refreshToken, {
      maxAge: 60 * 60 * 1, // 1 hora
      path: "/",
    });
  }

  useEffect(() => {
    authChannel = new BroadcastChannel("auth");
    authChannel.onmessage = (message) => {
      if (message.data === "signOut") signOut();
    };
  }, []);

  useEffect(() => {
    const { "token.token": token } = parseCookies();
    if (token) {
      api.defaults.headers["Authorization"] = `Bearer ${token}`;
      api
        .get("users/profile")
        .then((response) => {
          const data = response.data as IUser;
          setUser({
            ...data,
            sex: data.sex || undefined,
            functionn: data.functionn || undefined,
            ability: data.ability || undefined,
            is_employee: data.is_employee || undefined,
            curriculum: data.curriculum || undefined,
            business_area: data.business_area || undefined,
          });
        })
        .catch(() => {
          if (process.browser) signOut();
        });
    }
  }, []);

  async function signIn({ email, password, showToast }: ISignInCredentials): Promise<void> {
    try {
      const response = await api.post("sessions", { email, password });
      const { token, refreshToken, user: userData } = response.data;

      saveTokens(token, refreshToken);

      setUser(userData);

      api.defaults.headers["Authorization"] = `Bearer ${token}`;
      Router.push("/dashboard");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Ocorreu um erro inesperado. Tente novamente.";
      showToast({ description: errorMessage, status: "error" });
      Router.push("/");
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext, signOut };
