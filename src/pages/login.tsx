import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/contexts/AuthContext";
import { SubmitHandler, useForm } from "react-hook-form";
import {
    Box,
    Button,
    Checkbox,
    Divider,
    Flex,
    HStack,
    Icon,
    Image,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Link,
    Stack,
    Text,
    useToast,
    useColorModeValue,
    VStack,
} from "@chakra-ui/react";
import { FiUser } from "react-icons/fi";
import { CiUser } from "react-icons/ci";
import { RiLockPasswordLine, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { IShowToast } from "@/utils/IShowToast";
import { withSSRGuest } from "@/shared/withSSRGuest";
import { Input } from "@/components/Form/Input";
import { Helmet } from "react-helmet";
import { Footer } from "@/components/Footer/Footer";

interface ISignInFormData {
    email: string;
    password: string;
    remember?: boolean;
}

const signInFormSchema = yup.object().shape({
    email: yup.string().required("E-mail obrigatório").email("E-mail inválido"),
    password: yup.string().required("Senha obrigatória"),
    remember: yup.boolean(),
});

export default function Login(): JSX.Element {
    const { signIn } = useContext(AuthContext);
    const toast = useToast();
    const router = useRouter();

    const pageBg      = useColorModeValue("gray.50", "gray.900");
    const navBg       = useColorModeValue("#0000CD", "gray.900");
    const cardBg      = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const inputBg     = useColorModeValue("gray.50", "gray.700");
    const inputHover  = useColorModeValue("gray.100", "gray.600");
    const subtitleColor = useColorModeValue("gray.500", "gray.400");
    const headingColor  = useColorModeValue("gray.800", "white");
    const dividerColor  = useColorModeValue("gray.200", "gray.600");

    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState, setValue, watch } = useForm<ISignInFormData>({
        resolver: yupResolver(signInFormSchema),
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            const rememberedEmail = localStorage.getItem("rememberedEmail");
            const expiration = localStorage.getItem("rememberExpiration");
            if (rememberedEmail && expiration) {
                const isExpired = new Date().getTime() > parseInt(expiration);
                if (!isExpired) {
                    setValue("email", rememberedEmail);
                    setValue("remember", true);
                } else {
                    localStorage.removeItem("rememberedEmail");
                    localStorage.removeItem("rememberExpiration");
                }
            }
        }
    }, [setValue]);

    const rememberValue = watch("remember");
    useEffect(() => {
        if (rememberValue === false && typeof window !== "undefined") {
            localStorage.removeItem("rememberedEmail");
            localStorage.removeItem("rememberExpiration");
        }
    }, [rememberValue]);

    function showToast({ description, status }: IShowToast) {
        toast({ description, status, position: "top", duration: 8000, isClosable: true });
    }

    const handleSignIn: SubmitHandler<ISignInFormData> = async (data) => {
        if (data.remember && typeof window !== "undefined") {
            const oneMonth = 30 * 24 * 60 * 60 * 1000;
            localStorage.setItem("rememberedEmail", data.email);
            localStorage.setItem("rememberExpiration", (new Date().getTime() + oneMonth).toString());
        }
        await signIn({ showToast, ...data });
    };

    const { errors } = formState;

    return (
        <Flex direction="column" minH="100vh" bg={pageBg}>
            <Helmet>
                <title>GoodWork — Login</title>
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

            {/* Formulário centralizado */}
            <Flex
                as="form"
                flex={1}
                align="center"
                justify="center"
                py={10}
                px={4}
                onSubmit={handleSubmit(handleSignIn)}
            >
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
                    <VStack spacing={6}>
                        {/* Logo */}
                        <Image
                            src="/Img/logos/GoodWorkLogoAzul.png"
                            alt="GoodWork"
                            h="56px"
                            objectFit="contain"
                            fallbackSrc="/Img/logos/GoodWorkLogoBranco.png"
                        />

                        {/* Ícone */}
                        <Flex
                            w="72px"
                            h="72px"
                            borderRadius="full"
                            bg="blue.50"
                            align="center"
                            justify="center"
                        >
                            <Icon as={FiUser} boxSize="36px" color="blue.500" />
                        </Flex>

                        {/* Título */}
                        <VStack spacing={1} textAlign="center">
                            <Text fontSize="2xl" fontWeight="bold" color={headingColor}>
                                Entrar na sua conta
                            </Text>
                            <Text fontSize="sm" color={subtitleColor}>
                                Bem-vindo de volta ao GoodWork
                            </Text>
                        </VStack>

                        {/* Campos */}
                        <Stack spacing={4} w="100%">
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" color="gray.400">
                                    <CiUser size={18} />
                                </InputLeftElement>
                                <Input
                                    type="email"
                                    error={errors.email}
                                    borderRadius="lg"
                                    focusBorderColor="blue.400"
                                    bgColor={inputBg}
                                    variant="filled"
                                    _hover={{ bgColor: inputHover }}
                                    placeholder="E-mail"
                                    {...register("email")}
                                />
                            </InputGroup>

                            <InputGroup>
                                <InputLeftElement pointerEvents="none" color="gray.400">
                                    <RiLockPasswordLine size={18} />
                                </InputLeftElement>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    error={errors.password}
                                    borderRadius="lg"
                                    focusBorderColor="blue.400"
                                    bgColor={inputBg}
                                    variant="filled"
                                    _hover={{ bgColor: inputHover }}
                                    placeholder="Senha"
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
                        </Stack>

                        {/* Lembrar + Esqueceu */}
                        <HStack w="100%" justify="space-between">
                            <Checkbox
                                isChecked={!!rememberValue}
                                colorScheme="blue"
                                {...register("remember")}
                            >
                                <Text fontSize="sm">Lembrar de mim</Text>
                            </Checkbox>
                            <Link href="/forgot-password" fontSize="sm" color="blue.500" _hover={{ textDecor: "underline" }}>
                                Esqueceu a senha?
                            </Link>
                        </HStack>

                        {/* Botão login */}
                        <Button
                            type="submit"
                            colorScheme="blue"
                            borderRadius="full"
                            w="100%"
                            h="12"
                            fontSize="md"
                            boxShadow="md"
                            isLoading={formState.isSubmitting}
                            loadingText="Entrando..."
                        >
                            Entrar
                        </Button>

                        {/* Separador */}
                        <HStack w="100%" spacing={3}>
                            <Divider borderColor={dividerColor} />
                            <Text fontSize="xs" color={subtitleColor} whiteSpace="nowrap">
                                Não tem uma conta?
                            </Text>
                            <Divider borderColor={dividerColor} />
                        </HStack>

                        {/* Criar conta */}
                        <Button
                            as={Link}
                            href="/users/create"
                            variant="outline"
                            colorScheme="blue"
                            borderRadius="full"
                            w="100%"
                            h="12"
                            fontSize="md"
                            _hover={{ textDecor: "none", bg: "blue.50" }}
                        >
                            Criar conta
                        </Button>
                    </VStack>
                </Box>
            </Flex>

            <Footer />
        </Flex>
    );
}

export const getServerSideProps = withSSRGuest(async () => ({ props: {} }));
