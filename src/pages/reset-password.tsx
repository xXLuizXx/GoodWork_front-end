import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Flex,
    FormLabel,
    InputGroup,
    InputRightElement,
    Stack,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "@/services/apiClient";
import { Input } from "@/components/Form/Input";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { GoCheckCircleFill, GoXCircleFill } from "react-icons/go";

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
    const [tokenError, setTokenError] = useState("");
    const [submitError, setSubmitError] = useState("");
    const outerBg = useColorModeValue("linear(to-l, #FFFFFF, #000080)", "linear(to-l, gray.900, gray.800)");
    const cardBg = useColorModeValue("white", "gray.800");
    const inputBg = useColorModeValue("gray.100", "gray.700");
    const inputHover = useColorModeValue("gray.200", "gray.600");

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<IResetForm>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (router.isReady && !router.query.token) {
            setTokenError("Link de redefinição inválido. Solicite um novo.");
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
        <Flex w="100vw" minH="100vh" align="center" justify="center" bgGradient={outerBg}>
            <Helmet>
                <title>Redefinir senha</title>
                <link rel="icon" href="/Img/logos/GoodworkSSlogan.png" type="image/png" />
            </Helmet>

            <Box bg={cardBg} p="10" borderRadius={20} maxW="480px" w="100%" boxShadow="dark-lg">
                {tokenError ? (
                    <Flex direction="column" align="center" textAlign="center">
                        <GoXCircleFill size={56} color="#E53E3E" />
                        <Text fontSize="xl" fontWeight="bold" color="gray.700" mt="4" mb="2">
                            Link inválido
                        </Text>
                        <Alert status="error" borderRadius="md" mb="6" textAlign="left">
                            <AlertIcon />
                            {tokenError}
                        </Alert>
                        <Button colorScheme="blue" borderRadius="full" w="100%" onClick={() => router.push("/forgot-password")}>
                            Solicitar novo link
                        </Button>
                    </Flex>
                ) : !done ? (
                    <>
                        <Text fontSize="2xl" fontWeight="bold" color="gray.700" mb="2" textAlign="center">
                            Redefinir senha
                        </Text>
                        <Text color="gray.500" fontSize="sm" mb="6" textAlign="center">
                            Escolha uma nova senha para sua conta.
                        </Text>

                        <Stack spacing="4" as="form" onSubmit={handleSubmit(handleReset)}>
                            {submitError && (
                                <Alert status="error" borderRadius="md">
                                    <AlertIcon />
                                    {submitError}
                                </Alert>
                            )}

                            <Box>
                                <FormLabel color="blue.600" fontSize="sm">Nova senha</FormLabel>
                                <InputGroup size="lg">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Mínimo 6 caracteres"
                                        boxShadow="sm"
                                        borderRadius="full"
                                        focusBorderColor="blue.400"
                                        bgColor={inputBg}
                                        variant="filled"
                                        _hover={{ bgColor: inputHover }}
                                        error={errors.password}
                                        {...register("password")}
                                    />
                                    <InputRightElement width="2.5rem" mr={1}>
                                        <Button
                                            h="1.75rem"
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setShowPassword(!showPassword)}
                                            _hover={{ bg: "transparent" }}
                                            _active={{ bg: "transparent" }}
                                            p={0}
                                        >
                                            {showPassword ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </Box>

                            <Box>
                                <FormLabel color="blue.600" fontSize="sm">Confirmar senha</FormLabel>
                                <InputGroup size="lg">
                                    <Input
                                        type={showConfirm ? "text" : "password"}
                                        placeholder="Repita a senha"
                                        boxShadow="sm"
                                        borderRadius="full"
                                        focusBorderColor="blue.400"
                                        bgColor={inputBg}
                                        variant="filled"
                                        _hover={{ bgColor: inputHover }}
                                        error={errors.confirmPassword}
                                        {...register("confirmPassword")}
                                    />
                                    <InputRightElement width="2.5rem" mr={1}>
                                        <Button
                                            h="1.75rem"
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setShowConfirm(!showConfirm)}
                                            _hover={{ bg: "transparent" }}
                                            _active={{ bg: "transparent" }}
                                            p={0}
                                        >
                                            {showConfirm ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </Box>

                            <Button
                                type="submit"
                                colorScheme="blue"
                                borderRadius="full"
                                w="100%"
                                h="12"
                                isLoading={isSubmitting}
                            >
                                Redefinir senha
                            </Button>
                        </Stack>
                    </>
                ) : (
                    <Flex direction="column" align="center" textAlign="center">
                        <GoCheckCircleFill size={56} color="#38A169" />
                        <Text fontSize="xl" fontWeight="bold" color="gray.700" mt="4" mb="2">
                            Senha redefinida com sucesso!
                        </Text>
                        <Text color="gray.500" mb="6">
                            Sua nova senha foi salva. Faça login para continuar.
                        </Text>
                        <Button colorScheme="blue" borderRadius="full" w="100%" onClick={() => router.push("/")}>
                            Ir para o login
                        </Button>
                    </Flex>
                )}
            </Box>
        </Flex>
    );
}
