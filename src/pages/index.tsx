import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { SubmitHandler, useForm } from "react-hook-form";
import { Avatar, Button, Checkbox, Divider, Flex, HStack, InputGroup, InputLeftElement, Link, Stack, Text, useToast } from "@chakra-ui/react" 
import { CiUser } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { IShowToast } from "@/utils/IShowToast";
import { withSSRGuest } from "@/shared/withSSRGuest";
import { Input } from "@/components/Form/Input";
import { Helmet } from "react-helmet";
interface ISignInFormData {
    email: string;
    password: string;
}

const signInFormSchema = yup.object().shape({
    email: yup.string().required("E-mail obrigatório").email("E-mail inválido"),
    password: yup.string().required("Senha obrigatória")
});

export default function Login(): JSX.Element {
    const { signIn } = useContext(AuthContext);
    const toast  = useToast();
    const { register, handleSubmit, formState} = useForm({
        resolver: yupResolver(signInFormSchema)
    });

    function showToast({ description, status }: IShowToast) {
        toast({
          description,
          status,
          position: "top",
          duration: 8000,
          isClosable: true,
        });
      }
    
      const handleSignIn: SubmitHandler<ISignInFormData> = async data => {
        await signIn({ showToast, ...data });
      };

      const { errors } = formState;
    return (
        <Flex 
            w="100vw"
            h="100vh" 
            align="center" 
            justify="center"
        >
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
                        <Text fontSize="5xl">
                            BEM VINDO
                        </Text>
                        <Text fontSize="3xl" fontWeight="bold" letterSpacing="tigth">
                            <u>Novo</u> Login
                        </Text>
                        <Link href="users/create">
                            <Button boxShadow="dark-lg" borderRadius="full" mt="6" colorScheme="green" w='44'>Criar conta</Button>
                        </Link>                     
                        
                    </Stack>

                    <HStack 
                        spacing="4"
                        mx="24"
                        pr="8"
                        py="3"
                        color="gray.50"
                        borderRightWidth={1}
                        borderColor="gray.100"

                    >
                    </HStack>

                    <Stack spacing="8">
                        <Stack alignItems="center">
                            <Avatar
                                boxShadow="dark-lg" 
                                alignItems="center"
                                boxSize="60"
                                objectFit="cover"
                                src="./Img/icons/avatarLogin.png"
                                size="md"
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
                                    type="password"
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
                            </InputGroup>
                        </Stack>
                        <Stack mt="1" align="center" spacing="20" direction='row'>
                            <Checkbox boxShadow="2xl" ml="8">Lembrar</Checkbox>
                            <Link boxShadow="2xl" >
                                Esqueceu senha?
                            </Link>
                        </Stack>
                        <Stack spacing='1'>
                            <Button boxShadow="dark-lg" type="submit"  borderRadius="full" mt="4" colorScheme="blue" w='100%' h="12" isLoading={formState.isSubmitting}>Login</Button>
                        </Stack>
                        <Stack></Stack>
                    </Stack>
                </Flex>
            </Flex>
        </Flex>
        
    );
}

const getServerSideProps = withSSRGuest(async ctx => {
    return {
        props: {},
    };
});
  
export { getServerSideProps };