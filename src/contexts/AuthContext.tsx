import { ReactNode, createContext, useEffect, useState } from "react";
import { IShowToast } from "@/utils/IShowToast";
import { api } from "@/services/apiClient";
import { setCookie } from "nookies";
import Router from "next/router";

interface ISignInCredentials {
    email: string;
    password: string;
    showToast: (infoToas: IShowToast) => void;
}

interface IUser {
    name: string;
    identifier: string;
    telephone: string;
    is_employee: string
    functionn: string;
    email: string;
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

function AuthProvider({ children }: IAuthProviderProps){
    const [user, setUser] = useState<IUser>();
    const isAuthenticated = !!user;

    async function signIn({ email, password, showToast }: ISignInCredentials): Promise<void> {
        try{
            const  response = await api.post("sessions", { email, password });

            const { name, identifier, telephone, is_employee, functionn, isAdmin } = response.data.user;

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
                identifier,
                telephone,
                is_employee,
                functionn,
                email,
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