import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { SubmitHandler, useForm } from "react-hook-form";
import { Avatar, Button, Checkbox, Flex, HStack, InputGroup, InputLeftElement, InputRightElement, Link, Stack, Text, useToast } from "@chakra-ui/react";
import { CiUser } from "react-icons/ci";
import { RiLockPasswordLine, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { IShowToast } from "@/utils/IShowToast";
import { withSSRGuest } from "@/shared/withSSRGuest";
import { Input } from "@/components/Form/Input";
import { Helmet } from "react-helmet";

interface ISignInFormData {
    email: string;
    password: string;
    remember: boolean;
}

const signInFormSchema = yup.object().shape({
    email: yup.string().required("E-mail obrigatório").email("E-mail inválido"),
    password: yup.string().required("Senha obrigatória"),
    remember: yup.boolean()
});

export default function Login(): JSX.Element {
    const { signIn } = useContext(AuthContext);
    const toast = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [isRememberChecked, setIsRememberChecked] = useState(false);
    const { register, handleSubmit, formState, setValue, watch } = useForm<ISignInFormData>({
        resolver: yupResolver(signInFormSchema)
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const rememberedEmail = localStorage.getItem('rememberedEmail');
            const rememberedPassword = localStorage.getItem('rememberedPassword');
            const expiration = localStorage.getItem('rememberExpiration');
            const rememberChecked = localStorage.getItem('rememberChecked');

            if (rememberedEmail && rememberedPassword && expiration && rememberChecked) {
                const now = new Date().getTime();
                const isExpired = now > parseInt(expiration);

                if (!isExpired) {
                    setValue('email', rememberedEmail);
                    setValue('password', rememberedPassword);
                    setValue('remember', true);
                    setIsRememberChecked(true);
                } else {
                    localStorage.removeItem('rememberedEmail');
                    localStorage.removeItem('rememberedPassword');
                    localStorage.removeItem('rememberExpiration');
                    localStorage.removeItem('rememberChecked');
                }
            }
        }
    }, [setValue]);

    const rememberValue = watch('remember');
    useEffect(() => {
        if (rememberValue === false && typeof window !== 'undefined') {
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('rememberedPassword');
            localStorage.removeItem('rememberExpiration');
            localStorage.removeItem('rememberChecked');
            setIsRememberChecked(false);
        }
    }, [rememberValue]);

    function showToast({ description, status }: IShowToast) {
        toast({
            description,
            status,
            position: "top",
            duration: 8000,
            isClosable: true,
        });
    }
    
    const handleSignIn: SubmitHandler<ISignInFormData> = async (data) => {
        if (data.remember && typeof window !== 'undefined') {
            const oneMonth = 30 * 24 * 60 * 60 * 1000;
            const expirationDate = new Date().getTime() + oneMonth;
            
            localStorage.setItem('rememberedEmail', data.email);
            localStorage.setItem('rememberedPassword', data.password);
            localStorage.setItem('rememberExpiration', expirationDate.toString());
            localStorage.setItem('rememberChecked', 'true');
        }
        
        await signIn({ showToast, ...data });
    };

    const { errors } = formState;

    return (
        <Flex w="100vw" h="100vh" align="center" justify="center">
            <Helmet>
                <title>GoodWork - Bem Vindo!</title>
            </Helmet>
            <Flex 
                as="form" 
                width="100%" 
                maxWidth={1050} 
                bg="white" 
                p="8" 
                borderRadius={50} 
                flexDir="column"
                onSubmit={handleSubmit(handleSignIn)}
            >
                <Flex>
                    <Stack spacing='8' w="600" mt="40" ml="20" alignItems="center">
                        <Text fontSize="5xl">BEM VINDO</Text>
                        <Text fontSize="3xl" fontWeight="bold" letterSpacing="tigth">
                            <u>Novo</u> Login
                        </Text>
                        <Link href="users/create">
                            <Button boxShadow="dark-lg" borderRadius="full" mt="6" colorScheme="green" w='44'>Criar conta</Button>
                        </Link>                     
                    </Stack>

                    <HStack spacing="4" mx="24" pr="8" py="3" color="gray.50" borderRightWidth={1} borderColor="gray.100" />

                    <Stack spacing="8">
                        <Stack alignItems="center">
                            <Avatar
                                boxShadow="dark-lg" 
                                boxSize="60"
                                objectFit="cover"
                                src="./Img/icons/avatarLogin.png"
                            />
                        </Stack>
                        
                        <Stack>   
                            <InputGroup>
                                <InputLeftElement pointerEvents='none' fontSize="medium">
                                    <CiUser/>
                                </InputLeftElement>
                                <Input
                                    name="email"
                                    type="email"
                                    error={errors.email}
                                    boxShadow="2xl"
                                    borderRadius="full"
                                    focusBorderColor="blue.400"
                                    bgColor="gray.100"
                                    variant="filled" 
                                    _hover={{ bgColor: 'gray.200' }} 
                                    size="lg" 
                                    placeholder="E-mail"
                                    {...register("email")}
                                />
                            </InputGroup>
                        </Stack>
                        <Stack>
                            <InputGroup>
                                <InputLeftElement pointerEvents='none'>
                                    <RiLockPasswordLine />
                                </InputLeftElement>
                                <Input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    error={errors.password}
                                    boxShadow="2xl"
                                    borderRadius="full"
                                    focusBorderColor="blue.400" 
                                    bgColor="gray.100" 
                                    variant="filled" 
                                    _hover={{ bgColor: 'gray.200' }} 
                                    size="lg" 
                                    placeholder="Senha"
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
                        </Stack>
                        <Stack mt="1" align="center" spacing="20" direction='row'>
                            <Checkbox 
                                boxShadow="2xl" 
                                ml="8"
                                defaultChecked={isRememberChecked}
                                {...register("remember")}
                            >
                                Lembrar
                            </Checkbox>
                            <Link boxShadow="2xl">Esqueceu senha?</Link>
                        </Stack>
                        <Stack spacing='1'>
                            <Button 
                                boxShadow="dark-lg" 
                                type="submit"  
                                borderRadius="full" 
                                mt="4" 
                                colorScheme="blue" 
                                w='100%' 
                                h="12" 
                                isLoading={formState.isSubmitting}
                            >
                                Login
                            </Button>
                        </Stack>
                    </Stack>
                </Flex>
            </Flex>
        </Flex>
    );
}

export const getServerSideProps = withSSRGuest(async () => ({ props: {} }));