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
    sex: string;
    telephone: string;
    is_employee: boolean;
    functionn: string;
    ability: string;
    email: string;
    avatar: string;
    avatarUrl: string;
    isAdmin: boolean;
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

function AuthProvider({ children }: IAuthProviderProps){
    const [user, setUser] = useState<IUser | undefined>(undefined);
    const isAuthenticated = !!user;

    useEffect(() => {
        authChannel = new BroadcastChannel("auth");
        authChannel.onmessage = (message) => {
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
          const { "token.token": token } = parseCookies();
    
          if(token){
              api.get("users/profile").then(response => {
                  const {
                        id,                    
                        name,
                        road,
                        number,
                        identifier,
                        neighborhood,
                        sex,
                        telephone,
                        is_employee,
                        functionn,
                        ability,
                        email,
                        avatar,
                        avatarUrl,
                        isAdmin,
                  } = response.data as IUser;
        
                  setUser({
                        id,
                        name,
                        road,
                        number,
                        identifier,
                        neighborhood,
                        sex,
                        telephone,
                        is_employee,
                        functionn,
                        ability,
                        email,
                        avatar,
                        avatarUrl,
                        isAdmin,
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
            const { id, name, road, number, identifier, neighborhood, sex, telephone, is_employee, functionn, ability, avatar, avatarUrl, isAdmin } = response.data.user;
            const { token, refreshToken } = response.data;

            setCookie(undefined, "token.token", token, {
                maxAge: 60 * 60 * 1 * 1,
                path: "/",
            });
            setCookie(undefined, "token.refreshToken", refreshToken, {
                maxAge: 60 * 60 * 1 * 1,
                path: "/",
            });

            setUser({
                id,
                name,
                road,
                number,
                identifier,
                neighborhood,
                sex,
                telephone,
                is_employee,
                functionn,
                ability,
                email,
                avatar,
                avatarUrl,
                isAdmin,
            });

            api.defaults.headers["Authorization"] = `Bearer ${token}`;

            Router.push("/dashboard");

        }catch(error: any){
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

export { AuthProvider , AuthContext , signOut};