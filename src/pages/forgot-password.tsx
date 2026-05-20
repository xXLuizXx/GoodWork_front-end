import React, { useState } from "react";
import { useRouter } from "next/router";
import {
    Box,
    Button,
    Flex,
    Image,
    InputGroup,
    InputLeftElement,
    Stack,
    Text,
    Alert,
    AlertIcon,
    useColorModeValue,
    VStack,
    Icon,
} from "@chakra-ui/react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "@/services/apiClient";
import { Input } from "@/components/Form/Input";
import { CiMail } from "react-icons/ci";
import { GoCheckCircleFill } from "react-icons/go";
import { Footer } from "@/components/Footer/Footer";

interface IForgotForm {
    email: string;
}

const schema = yup.object().shape({
    email: yup.string().required("E-mail obrigatório").email("E-mail inválido"),
});

export default function ForgotPassword(): JSX.Element {
    const router = useRouter();
    const [sent, setSent] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const pageBg      = useColorModeValue("gray.50", "gray.900");
    const navBg       = useColorModeValue("#0000CD", "gray.900");
    const cardBg      = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const inputBg     = useColorModeValue("gray.50", "gray.700");
    const inputHover  = useColorModeValue("gray.100", "gray.600");
    const subtitleColor = useColorModeValue("gray.500", "gray.400");
    const headingColor  = useColorModeValue("gray.800", "white");

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<IForgotForm>({
        resolver: yupResolver(schema),
    });

    async function handleForgot({ email }: IForgotForm) {
        setErrorMessage("");
        try {
            await api.post("users/forgot-password", { email });
            setSent(true);
        } catch (err: any) {
            setErrorMessage(err?.response?.data?.message ?? "Erro ao enviar e-mail. Tente novamente.");
        }
    }

    return (
        <Flex direction="column" minH="100vh" bg={pageBg}>
            <Helmet>
                <title>GoodWork — Esqueci minha senha</title>
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
                <Flex flex={1} />
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
                >
                    {!sent ? (
                        <VStack spacing={6}>
                            {/* Ícone */}
                            <Flex
                                w="72px"
                                h="72px"
                                borderRadius="full"
                                bg="blue.50"
                                align="center"
                                justify="center"
                            >
                                <Icon as={CiMail} boxSize="36px" color="blue.500" />
                            </Flex>

                            {/* Título */}
                            <VStack spacing={1} textAlign="center">
                                <Text fontSize="2xl" fontWeight="bold" color={headingColor}>
                                    Esqueci minha senha
                                </Text>
                                <Text fontSize="sm" color={subtitleColor}>
                                    Informe seu e-mail e enviaremos um link para redefinir sua senha.
                                </Text>
                            </VStack>

                            {/* Formulário */}
                            <Stack spacing={4} w="100%" as="form" onSubmit={handleSubmit(handleForgot)}>
                                {errorMessage && (
                                    <Alert status="error" borderRadius="xl" fontSize="sm">
                                        <AlertIcon />
                                        {errorMessage}
                                    </Alert>
                                )}

                                <InputGroup>
                                    <InputLeftElement pointerEvents="none" color="gray.400">
                                        <CiMail size={18} />
                                    </InputLeftElement>
                                    <Input
                                        type="email"
                                        placeholder="seu@email.com"
                                        borderRadius="lg"
                                        focusBorderColor="blue.400"
                                        bgColor={inputBg}
                                        variant="filled"
                                        _hover={{ bgColor: inputHover }}
                                        error={errors.email}
                                        {...register("email")}
                                    />
                                </InputGroup>

                                <Button
                                    type="submit"
                                    colorScheme="blue"
                                    borderRadius="full"
                                    w="100%"
                                    h="12"
                                    isLoading={isSubmitting}
                                    loadingText="Enviando..."
                                >
                                    Enviar link de redefinição
                                </Button>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    colorScheme="blue"
                                    borderRadius="full"
                                    w="100%"
                                    onClick={() => router.push("/login")}
                                >
                                    Voltar ao login
                                </Button>
                            </Stack>
                        </VStack>
                    ) : (
                        <VStack spacing={6} textAlign="center">
                            <GoCheckCircleFill size={64} color="#38A169" />
                            <VStack spacing={1}>
                                <Text fontSize="xl" fontWeight="bold" color={headingColor}>
                                    E-mail enviado!
                                </Text>
                                <Text fontSize="sm" color={subtitleColor}>
                                    Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                                </Text>
                            </VStack>
                            <Button
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
