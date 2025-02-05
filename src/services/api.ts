import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from "nookies";
import { signOut } from "../contexts/AuthContext";
import {AuthTokenError} from "@/services/errors/AuthTokenErros";

let isRefreshing = false;
let failedRequestsQueue = [];

function setupAPIClient(ctx = undefined){
    let cookies = parseCookies(ctx);

    const api = axios.create({
        baseURL: "http://localhost:3333",
        headers: {
            Authorization: `Bearer ${cookies["token.token"]}`
        }
    });

    api.interceptors.response.use(
        response => response,
        (error: AxiosError) => {
            if(error.response?.status === 401 ){
                if(error.response.data === "Token inválido"){
                    cookies = parseCookies(ctx);

                    const { "token.refreshToken": refreshToken } = cookies;
                    const originalConfig = error.config;

                    if(!isRefreshing){
                        isRefreshing = true;

                        api
                            .post("refresh-token", { token: refreshToken })
                            .then(response => {
                                const { token, refreshToken} = response.data;

                                setCookie(ctx, "token.token", token, {
                                    maxAge: 60 * 60 * 24 * 1,
                                    path: "/"
                                });

                                setCookie(ctx, "token.refreshToken", refreshToken, {
                                    maxAge: 60 * 60 * 24 * 1,
                                    path: "/",
                                });

                                api.defaults.headers["Authorization"] = `Bearer ${token}`;

                                failedRequestsQueue.forEach(request =>
                                    request.onSuccess(token),
                                );
                                failedRequestsQueue = [];

                            })
                            .catch(error => {
                                failedRequestsQueue.forEach(request => 
                                    request.onFailure(error)
                                );
                                failedRequestsQueue = [];
                            })
                            .finally(() => {
                                isRefreshing = false;
                            });
                    }

                    return new Promise((resolve, reject) => {
                        failedRequestsQueue.push({
                          onSuccess: (token: string) => {
                            originalConfig.headers["Authorization"] = `Bearer ${token}`;
                            resolve(api(originalConfig));
                          },
                          onFailure: (error: AxiosError) => {
                            reject(error);
                          },
                        });
                    });
                }
                if (process.browser) {
                    signOut();
                } else {
                    return Promise.reject(new AuthTokenError());
                }
            }

            return Promise.reject(error);
        }
    );
    return api;
}

export { setupAPIClient }