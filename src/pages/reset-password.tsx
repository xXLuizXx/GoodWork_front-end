import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
    Box,
    Button,
    Flex,
    Image,
    InputGroup,
    InputRightElement,
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
import { RiLockPasswordLine, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { GoCheckCircleFill, GoXCircleFill } from "react-icons/go";
import { Footer } from "@/components/Footer/Footer";

interface IResetForm {
    password: string;
    confirmPassword: string;
}

const schema = yup.object().shape({
    password: yup
        .string()
        .required("Senha obrigatória")
        .min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmPassword: yup
        .string()
        .required("Confirmação obrigatória")
        .oneOf([yup.ref("password")], "As senhas não coincidem"),
});

export default function ResetPassword(): JSX.Element {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [done, setDone] = useState(false);
    const [tokenError, setTokenError] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const pageBg      = useColorModeValue("gray.50", "gray.900");
    const navBg       = useColorModeValue("#0000CD", "gray.900");
    const cardBg      = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const inputBg     = useColorModeValue("gray.50", "gray.700");
    const inputHover  = useColorModeValue("gray.100", "gray.600");
    const subtitleColor = useColorModeValue("gray.500", "gray.400");
    const headingColor  = useColorModeValue("gray.800", "white");

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<IResetForm>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (router.isReady && !router.query.token) {
            setTokenError(true);
        }
    }, [router.isReady, router.query.token]);

    async function handleReset({ password }: IResetForm) {
        setSubmitError("");
        try {
            await api.post("users/reset-password", { password }, {
                params: { token: router.query.token },
            });
            setDone(true);
        } catch (err: any) {
            setSubmitError(err?.response?.data?.message ?? "Erro ao redefinir senha. Tente novamente.");
        }
    }

    return (
        <Flex direction="column" minH="100vh" bg={pageBg}>
            <Helmet>
                <title>GoodWork — Redefinir senha</title>
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
                >
                    {tokenError ? (
                        <VStack spacing={6} textAlign="center">
                            <GoXCircleFill size={64} color="#E53E3E" />
                            <VStack spacing={1}>
                                <Text fontSize="xl" fontWeight="bold" color={headingColor}>
                                    Link inválido
                                </Text>
                                <Text fontSize="sm" color={subtitleColor}>
                                    O link de redefinição é inválido ou já expirou. Solicite um novo.
                                </Text>
                            </VStack>
                            <Button
                                colorScheme="blue"
                                borderRadius="full"
                                w="100%"
                                h="12"
                                onClick={() => router.push("/forgot-password")}
                            >
                                Solicitar novo link
                            </Button>
                        </VStack>
                    ) : !done ? (
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
                                <Icon as={RiLockPasswordLine} boxSize="36px" color="blue.500" />
                            </Flex>

                            {/* Título */}
                            <VStack spacing={1} textAlign="center">
                                <Text fontSize="2xl" fontWeight="bold" color={headingColor}>
                                    Redefinir senha
                                </Text>
                                <Text fontSize="sm" color={subtitleColor}>
                                    Escolha uma nova senha para sua conta.
                                </Text>
                            </VStack>

                            {/* Formulário */}
                            <Stack spacing={4} w="100%" as="form" onSubmit={handleSubmit(handleReset)}>
                                {submitError && (
                                    <Alert status="error" borderRadius="xl" fontSize="sm">
                                        <AlertIcon />
                                        {submitError}
                                    </Alert>
                                )}

                                <InputGroup>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Nova senha (mínimo 6 caracteres)"
                                        borderRadius="lg"
                                        focusBorderColor="blue.400"
                                        bgColor={inputBg}
                                        variant="filled"
                                        _hover={{ bgColor: inputHover }}
                                        error={errors.password}
                                        {...register("password")}
                                    />
                                    <InputRightElement mr={1}>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            _hover={{ bg: "transparent" }}
                                            _active={{ bg: "transparent" }}
                                            p={0}
                                            color="gray.400"
                                        >
                                            {showPassword ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>

                                <InputGroup>
                                    <Input
                                        type={showConfirm ? "text" : "password"}
                                        placeholder="Confirmar senha"
                                        borderRadius="lg"
                                        focusBorderColor="blue.400"
                                        bgColor={inputBg}
                                        variant="filled"
                                        _hover={{ bgColor: inputHover }}
                                        error={errors.confirmPassword}
                                        {...register("confirmPassword")}
                                    />
                                    <InputRightElement mr={1}>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            type="button"
                                            onClick={() => setShowConfirm(!showConfirm)}
                                            _hover={{ bg: "transparent" }}
                                            _active={{ bg: "transparent" }}
                                            p={0}
                                            color="gray.400"
                                        >
                                            {showConfirm ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>

                                <Button
                                    type="submit"
                                    colorScheme="blue"
                                    borderRadius="full"
                                    w="100%"
                                    h="12"
                                    isLoading={isSubmitting}
                                    loadingText="Redefinindo..."
                                >
                                    Redefinir senha
                                </Button>
                            </Stack>
                        </VStack>
                    ) : (
                        <VStack spacing={6} textAlign="center">
                            <GoCheckCircleFill size={64} color="#38A169" />
                            <VStack spacing={1}>
                                <Text fontSize="xl" fontWeight="bold" color={headingColor}>
                                    Senha redefinida com sucesso!
                                </Text>
                                <Text fontSize="sm" color={subtitleColor}>
                                    Sua nova senha foi salva. Faça login para continuar.
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
                </Box>
            </Flex>

            <Footer />
        </Flex>
    );
}
