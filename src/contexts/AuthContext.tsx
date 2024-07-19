import { ReactNode, createContext, useEffect, useState } from "react";
import { IShowToast } from "@/utils/IShowToast";
import { api } from "@/services/apiClient";
import { setCookie, destroyCookie, parseCookies } from "nookies";
import Router from "next/router";

interface ISignInCredentials {
    email: string;
    password: string;
    showToast: (infoToas: IShowToast) => void;
}

interface IUser {
    name: string;
    email: string;
    avatar: string;
    avatarUrl: string;
    isAdmin: boolean;
}

interface IAuthContextData {
    signIn(credentials: ISignInCredentials): Promise<void>;
    user: IUser;
    isAuthenticated: boolean;
}

interface IAuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext({} as IAuthContextData);
let authChannel: BroadcastChannel;

function signOut(): void {
  destroyCookie(undefined, "baseApp.token");
  destroyCookie(undefined, "baseApp.refreshToken");

  authChannel.postMessage("signOut");

  Router.push("/");
}

function AuthProvider({ children }: IAuthProviderProps){
    const [user, setUser] = useState<IUser>();
    const isAuthenticated = !!user;

    useEffect(() => {
        authChannel = new BroadcastChannel("auth");
    
        authChannel.onmessage = message => {
          switch (message.data) {
            case "signOut":
              signOut();
              break;
            default:
              break;
          }
        };
      }, []);
    
      useEffect(() => {
        const { "baseApp.token": token } = parseCookies();
    
        if (token) {
          api
            .get("users/profile")
            .then(response => {
              const {
                name,
                email,
                avatar,
                avatarUrl,
                isAdmin
              } = response.data as IUser;
    
              setUser({
                name,
                email,
                avatar,
                avatarUrl,
                isAdmin
              });
            })
            .catch(() => {
              if (process.browser) {
                signOut();
              }
            });
        }
      }, []);

    async function signIn({ email, password, showToast }: ISignInCredentials): Promise<void> {
        try{
            const  response = await api.post("sessions", { email, password });

            const { name, avatar, avatarUrl, isAdmin } = response.data.user;

            const { token, refreshToken } = response.data;

            setCookie(undefined, "baseApp.token", token, {
                maxAge: 60 * 60 * 1 * 1, // 30 days
                path: "/",
            });
            setCookie(undefined, "baseApp.refreshToken", refreshToken, {
                maxAge: 60 * 60 * 1 * 1, // 30 days
                path: "/",
            });

            setUser({
                name,
                email,
                avatar,
                avatarUrl,
                isAdmin
            });

            api.defaults.headers["Authorization"] = `Bearer ${token}`;

            Router.push("/dashboard");

        }catch(error){
            showToast({
                description: error.response.data.message,
                status: "error"
            });
        }
    }
    return (
        <AuthContext.Provider value={{ signIn, user, isAuthenticated }}>
          {children}
        </AuthContext.Provider>
    );

}

export { AuthProvider , AuthContext };