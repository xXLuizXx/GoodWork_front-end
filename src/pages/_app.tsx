import { AppProps } from "next/app";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import { QueryClientProvider } from "react-query";
import { theme } from "@/styles/theme";
import { AuthProvider } from "../contexts/AuthContext";
import { queryClient } from "@/services/queryClient";
import { Footer } from "@/components/Footer/Footer";
import { useRouter } from "next/router";

const NO_FOOTER_PAGES = ["/", "/login", "/users/create", "/forgot-password", "/reset-password", "/verify-account"];

function MyApp({ Component, pageProps }: AppProps){
    const router = useRouter();
    const showFooter = !NO_FOOTER_PAGES.includes(router.pathname);

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ChakraProvider theme={theme}>
                    <Flex direction="column" minH="100vh">
                        <Component {...pageProps}/>
                        {showFooter && <Footer />}
                    </Flex>
                </ChakraProvider>
            </AuthProvider>
        </QueryClientProvider>
    )
}

export default MyApp