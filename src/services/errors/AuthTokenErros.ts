class AuthTokenError extends Error {
    constructor(){
        super("Erro do toekn de autenticação!");
    }
}

export { AuthTokenError }