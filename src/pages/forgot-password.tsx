import React, { useState } from "react";
import { useRouter } from "next/router";
import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Flex,
    FormLabel,
    InputGroup,
    InputLeftElement,
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
import { CiMail } from "react-icons/ci";
import { GoCheckCircleFill } from "react-icons/go";

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
    const outerBg = useColorModeValue("linear(to-l, #FFFFFF, #000080)", "linear(to-l, gray.900, gray.800)");
    const cardBg = useColorModeValue("white", "gray.800");
    const inputBg = useColorModeValue("gray.100", "gray.700");
    const inputHover = useColorModeValue("gray.200", "gray.600");

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
        <Flex w="100vw" minH="100vh" align="center" justify="center" bgGradient={outerBg}>
            <Helmet>
                <title>Esqueci minha senha</title>
                <link rel="icon" href="/Img/logos/GoodworkSSlogan.png" type="image/png" />
            </Helmet>

            <Box bg={cardBg} p="10" borderRadius={20} maxW="480px" w="100%" boxShadow="dark-lg">
                {!sent ? (
                    <>
                        <Text fontSize="2xl" fontWeight="bold" color="gray.700" mb="2" textAlign="center">
                            Esqueci minha senha
                        </Text>
                        <Text color="gray.500" fontSize="sm" mb="6" textAlign="center">
                            Informe seu e-mail e enviaremos um link para redefinir sua senha.
                        </Text>

                        <Stack spacing="4" as="form" onSubmit={handleSubmit(handleForgot)}>
                            {errorMessage && (
                                <Alert status="error" borderRadius="md">
                                    <AlertIcon />
                                    {errorMessage}
                                </Alert>
                            )}

                            <Box>
                                <FormLabel color="blue.600" fontSize="sm">E-mail</FormLabel>
                                <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                        <CiMail />
                                    </InputLeftElement>
                                    <Input
                                        type="email"
                                        placeholder="seu@email.com"
                                        boxShadow="sm"
                                        borderRadius="full"
                                        focusBorderColor="blue.400"
                                        bgColor={inputBg}
                                        variant="filled"
                                        _hover={{ bgColor: inputHover }}
                                        size="lg"
                                        pl="10"
                                        error={errors.email}
                                        {...register("email")}
                                    />
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
                                Enviar link de redefinição
                            </Button>

                            <Button
                                variant="ghost"
                                colorScheme="blue"
                                borderRadius="full"
                                w="100%"
                                onClick={() => router.push("/")}
                            >
                                Voltar ao login
                            </Button>
                        </Stack>
                    </>
                ) : (
                    <Flex direction="column" align="center" textAlign="center">
                        <GoCheckCircleFill size={56} color="#38A169" />
                        <Text fontSize="xl" fontWeight="bold" color="gray.700" mt="4" mb="2">
                            E-mail enviado!
                        </Text>
                        <Text color="gray.500" mb="6">
                            Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                        </Text>
                        <Button colorScheme="blue" borderRadius="full" w="100%" onClick={() => router.push("/")}>
                            Voltar ao login
                        </Button>
                    </Flex>
                )}
            </Box>
        </Flex>
    );
}
