import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { parseCookies } from "nookies";

function withSSRGuest<P>(fn?: GetServerSideProps<P>): GetServerSideProps {
    return async (
        ctx: GetServerSidePropsContext,
    ): Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseCookies(ctx);

        // Verifica se o usuário está autenticado
        if (cookies["token.token"]) {
            return {
                redirect: {
                    destination: "/dashboard",
                    permanent: false,
                },
            };
        }

        // Executa a função fornecida, se existir
        if (fn) {
            return await fn(ctx);
        }

        // Retorna props padrão caso `fn` seja opcional
        return { props: {} as P };
    };
}

export { withSSRGuest };
