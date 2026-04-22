import { AppProps } from "next/app";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import { QueryClientProvider } from "react-query";
import { theme } from "@/styles/theme";
import { AuthProvider } from "../contexts/AuthContext";
import { queryClient } from "@/services/queryClient";
import { Footer } from "@/components/Footer";

function MyApp({ Component, pageProps }: AppProps){

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ChakraProvider theme={theme}>
                    <Flex direction="column" minH="100vh">
                        <Component {...pageProps}/>
                        <Footer />
                    </Flex>
                </ChakraProvider>
            </AuthProvider>
        </QueryClientProvider>
    )
}

export default MyApp