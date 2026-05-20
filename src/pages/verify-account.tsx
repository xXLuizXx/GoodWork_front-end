import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
    Box,
    Button,
    Flex,
    Image,
    Spinner,
    Text,
    Alert,
    AlertIcon,
    useColorModeValue,
    VStack,
} from "@chakra-ui/react";
import { Helmet } from "react-helmet";
import { api } from "@/services/apiClient";
import { GoCheckCircleFill, GoXCircleFill } from "react-icons/go";
import { Footer } from "@/components/Footer/Footer";

const GENERIC_ERROR = "O link de verificação é inválido ou já expirou. Solicite um novo e-mail de verificação.";

type Status = "loading" | "success" | "error";

export default function VerifyAccount(): JSX.Element {
    const router = useRouter();
    const [status, setStatus] = useState<Status>("loading");

    const pageBg      = useColorModeValue("gray.50", "gray.900");
    const navBg       = useColorModeValue("#0000CD", "gray.900");
    const cardBg      = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const subtitleColor = useColorModeValue("gray.500", "gray.400");
    const headingColor  = useColorModeValue("gray.800", "white");

    useEffect(() => {
        if (!router.isReady) return;

        const { token } = router.query;

        if (!token || typeof token !== "string") {
            setStatus("error");
            return;
        }

        api.get("users/verify-account", { params: { token } })
            .then(() => {
                setStatus("success");
            })
            .catch(() => {
                setStatus("error");
            });
    }, [router.isReady, router.query]);

    return (
        <Flex direction="column" minH="100vh" bg={pageBg}>
            <Helmet>
                <title>GoodWork — Verificação de conta</title>
                <link rel="icon" href="/Img/logos/GoodworkSSlogan.png" type="image/png" />
            </Helmet>

            {/* Navbar */}
            <Flex
                as="header"
                w="100%"
                h="16"
                bg={navBg}
                px={6}
                align="center"
                position="sticky"
                top={0}
                zIndex={100}
                boxShadow="dark-lg"
                flexShrink={0}
            >
                <Image
                    src="/Img/logos/GoodWorkLogoBranco.png"
                    alt="GoodWork"
                    h="44px"
                    objectFit="contain"
                    draggable={false}
                    style={{ userSelect: "none", cursor: "pointer" }}
                    onClick={() => router.push("/")}
                />
            </Flex>

            {/* Conteúdo centralizado */}
            <Flex flex={1} align="center" justify="center" py={10} px={4}>
                <Box
                    bg={cardBg}
                    borderRadius="2xl"
                    boxShadow="xl"
                    borderWidth="1px"
                    borderColor={borderColor}
                    p={[6, 8, 10]}
                    w="100%"
                    maxW="440px"
                    textAlign="center"
                >
                    {status === "loading" && (
                        <VStack spacing={4}>
                            <Spinner size="xl" color="blue.500" thickness="4px" />
                            <Text color={subtitleColor} fontSize="sm">
                                Verificando sua conta...
                            </Text>
                        </VStack>
                    )}

                    {status === "success" && (
                        <VStack spacing={6}>
                            <GoCheckCircleFill size={64} color="#38A169" />
                            <VStack spacing={1}>
                                <Text fontSize="xl" fontWeight="bold" color={headingColor}>
                                    Conta verificada com sucesso!
                                </Text>
                                <Text fontSize="sm" color={subtitleColor}>
                                    Sua conta foi ativada. Agora você pode fazer login.
                                </Text>
                            </VStack>
                            <Button
                                colorScheme="blue"
                                borderRadius="full"
                                w="100%"
                                h="12"
                                onClick={() => router.push("/login")}
                            >
                                Ir para o login
                            </Button>
                        </VStack>
                    )}

                    {status === "error" && (
                        <VStack spacing={6}>
                            <GoXCircleFill size={64} color="#E53E3E" />
                            <VStack spacing={1}>
                                <Text fontSize="xl" fontWeight="bold" color={headingColor}>
                                    Falha na verificação
                                </Text>
                            </VStack>
                            <Alert status="error" borderRadius="xl" fontSize="sm" textAlign="left">
                                <AlertIcon />
                                {GENERIC_ERROR}
                            </Alert>
                            <Button
                                variant="outline"
                                colorScheme="blue"
                                borderRadius="full"
                                w="100%"
                                h="12"
                                onClick={() => router.push("/login")}
                            >
                                Voltar ao login
                            </Button>
                        </VStack>
                    )}
                </Box>
            </Flex>

            <Footer />
        </Flex>
    );
}
