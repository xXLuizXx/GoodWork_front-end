import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Flex,
    Spinner,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import { Helmet } from "react-helmet";
import { api } from "@/services/apiClient";
import { GoCheckCircleFill, GoXCircleFill } from "react-icons/go";

type Status = "loading" | "success" | "error";

export default function VerifyAccount(): JSX.Element {
    const router = useRouter();
    const [status, setStatus] = useState<Status>("loading");
    const [message, setMessage] = useState("");
    const outerBg = useColorModeValue("linear(to-l, #FFFFFF, #000080)", "linear(to-l, gray.900, gray.800)");
    const cardBg = useColorModeValue("white", "gray.800");

    useEffect(() => {
        if (!router.isReady) return;

        const { token } = router.query;

        if (!token) {
            setStatus("error");
            setMessage("Token de verificação não encontrado na URL.");
            return;
        }

        api.get("users/verify-account", { params: { token } })
            .then(() => {
                setStatus("success");
            })
            .catch((err) => {
                setStatus("error");
                setMessage(err?.response?.data?.message ?? "Token inválido ou expirado.");
            });
    }, [router.isReady, router.query]);

    return (
        <Flex w="100vw" minH="100vh" align="center" justify="center" bgGradient={outerBg}>
            <Helmet>
                <title>Verificação de conta</title>
                <link rel="icon" href="/Img/logos/GoodworkSSlogan.png" type="image/png" />
            </Helmet>

            <Box bg={cardBg} p="10" borderRadius={20} maxW="480px" w="100%" textAlign="center" boxShadow="dark-lg">
                {status === "loading" && (
                    <>
                        <Spinner size="xl" color="blue.500" mb="4" />
                        <Text color="gray.600">Verificando sua conta...</Text>
                    </>
                )}

                {status === "success" && (
                    <>
                        <Flex justify="center" mb="4">
                            <GoCheckCircleFill size={56} color="#38A169" />
                        </Flex>
                        <Text fontSize="xl" fontWeight="bold" color="gray.700" mb="2">
                            Conta verificada com sucesso!
                        </Text>
                        <Text color="gray.500" mb="6">
                            Sua conta foi ativada. Agora você pode fazer login.
                        </Text>
                        <Button colorScheme="blue" borderRadius="full" w="100%" onClick={() => router.push("/")}>
                            Ir para o login
                        </Button>
                    </>
                )}

                {status === "error" && (
                    <>
                        <Flex justify="center" mb="4">
                            <GoXCircleFill size={56} color="#E53E3E" />
                        </Flex>
                        <Text fontSize="xl" fontWeight="bold" color="gray.700" mb="2">
                            Falha na verificação
                        </Text>
                        <Alert status="error" borderRadius="md" mb="6" textAlign="left">
                            <AlertIcon />
                            {message}
                        </Alert>
                        <Button variant="outline" colorScheme="blue" borderRadius="full" w="100%" onClick={() => router.push("/")}>
                            Voltar ao login
                        </Button>
                    </>
                )}
            </Box>
        </Flex>
    );
}
