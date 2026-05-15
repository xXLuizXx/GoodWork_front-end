import { useContext, useEffect, useState } from "react";
import { Flex, Spinner, useColorModeValue } from "@chakra-ui/react";
import { Header } from "@/components/Header/Header";
import { Sidebar } from "@/components/Sidebar";
import { AuthContext } from "@/contexts/AuthContext";
import { withSSRAuth } from "@/shared/withSSRAuth";
import { parseCookies } from "nookies";
import decode from "jwt-decode";
import { AdminReport } from "@/components/Reports/AdminReport";
import { CompanyReport } from "@/components/Reports/CompanyReport";
import { IndividualReport } from "@/components/Reports/IndividualReport";

interface DecodedToken {
    sub: string;
    isAdmin: boolean;
    accessLevel: string;
}

export default function Report() {
    const { user } = useContext(AuthContext);
    const [userId, setUserId] = useState("");
    const pageBg = useColorModeValue("gray.50", "gray.900");

    useEffect(() => {
        const cookies = parseCookies();
        const token = cookies["token.token"];
        if (token) {
            try {
                const decoded = decode<DecodedToken>(token);
                setUserId(decoded.sub);
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
            }
        }
    }, []);

    return (
        <Flex direction="column" minH="100vh" bg={pageBg}>
            <Header />

            <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
                <Sidebar />

                <Flex flex="1" ml={4}>
                    {!user || !userId ? (
                        <Flex justify="center" align="center" flex="1">
                            <Spinner size="xl" color="blue.500" />
                        </Flex>
                    ) : user.isAdmin ? (
                        <AdminReport />
                    ) : user.user_type === "company" ? (
                        <CompanyReport userId={userId} />
                    ) : (
                        <IndividualReport />
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
}

export const getServerSideProps = withSSRAuth(async () => {
    return { props: {} };
});
