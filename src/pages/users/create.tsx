import Link from "next/link";
import { Input } from "@/components/Form/Input";
import { InputMask } from "@/components/Form/InputMask";
import { Button, Flex, Grid, GridItem, Image, SimpleGrid, Stack, VStack, useToast } from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { api } from "@/services/apiClient";
import { useMutation } from "react-query";
import Router from "next/router";
import { queryClient } from "@/services/queryClient";
import { yupResolver } from "@hookform/resolvers/yup";
import { withSSRGuest } from "@/shared/withSSRGuest";
import { Select } from "@/components/Form/Select";
interface ICreateUser{
    name: string;
    road: string;
    number: string;
    identifier: string;
    neighborhood: string;
    sex: string;
    telephone: string;
    is_employee: boolean;
    functionn: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const validMandatoryFields = yup.object().shape({
    name: yup.string().required("Campo obrigatório"),
    road: yup.string().required("Campo obrigatório"),
    number: yup.string().required("Campo obrigatório"),
    identifier: yup.string().required("Campo obrigatório").min(11, "CPF/CNPJ incompleto"),
    neighborhood: yup.string().required("Campo obrigatório"),
    sex: yup.string().required("Campo obrigatório"),
    telephone: yup.string().required("Campo obrigatório"),
    is_employee: yup.boolean().required("Campo obrigatório"),
    functionn: yup.string().required("Campo obrigatório"),
    email: yup.string().required("Campo obrigatório"),
    password: yup.string().required("Campo obrigatório").min(6, "No mínimo 6 caracteres"),
    confirmPassword: yup.string().oneOf([yup.ref("password")], "Senha diferente da informada no campo senha"),
});

export default function CreateUser(): JSX.Element {
    const { register, formState, handleSubmit } = useForm({
        resolver: yupResolver(validMandatoryFields)
    });
    const { errors } = formState;
    const toast = useToast();

    const createUser = useMutation(
        async (user: ICreateUser) => {
            api.post("users", user)
            .then(response => {
                toast({
                    description: "Usuário criado com sucesso.",
                    status: "success",
                    position: "top",
                    duration: 8000,
                    isClosable: true,
                });

                Router.push("/");
                return response.data.user;
            }).catch(error => {
                toast({
                    description: error.reponse.data.message,
                    status: "error",
                    position: "top",
                    duration: 8000,
                    isClosable: true,
                });
            });
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries("users")
            }
        },
    );


    const creteHandle: SubmitHandler<ICreateUser> = async data=>{
        await createUser.mutateAsync(data);
    };


    return(
        <Flex
            as="form" 
            w="100vw"
            h="100vh" 
            align="center" 
            justify="center"
            onSubmit={handleSubmit(creteHandle)}
        >
            <Stack
                w="35%"
                h="80%"
                spacing="1"
                align="center"
            >
                <Flex 
                    width="100%" 
                    maxWidth={1050}
                    borderRadius={20}
                    border="1px"
                    pl="4%"
                    pr="5%"
                    pb="6%"
                    borderColor="blue.400"
                >
                    <VStack>                    
                        <Image
                            maxW="50%"
                            boxSize='250px'
                            src="../Img/logos/GoodworkSSlogan.png"
                        />
                        <Grid
                            pt="1%"
                            gap="2"
                            templateAreas={`"row1 row2"
                                            "row3 row4"
                                            "row5 row5"
                                            "row6 row6"
                                            "row7 row8"
                                            "row9 row10"
                                            "row11 row12"
                                        `}
                            gridTemplateRows={'50px 1fr 90px'}
                            gridTemplateColumns={'310px 1fr'}
                            minWidth={[200, 250]}
                        >
                            <GridItem pl="2" area={'row1'}>
                                <Input
                                    name="Nome"
                                    type="name"
                                    error={errors.name}
                                    placeholder="Nome Completo"
                                    {...register("name")}
                                />
                            </GridItem>
                            <GridItem pl="2" area={'row2'}>
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="E-mail"
                                    {...register("email")}
                                />
                            </GridItem>
                            <GridItem pl="2" area={'row3'}>
                                <Input
                                    name="password"
                                    type="password"
                                    error={errors.password}
                                    placeholder="Senha"
                                    {...register("password")}
                                />
                            </GridItem>
                            <GridItem pl="2" area={'row4'}>
                                <Input
                                    name="confirmPassword"
                                    type="password"
                                    error={errors.confirmPassword}
                                    placeholder="Confirmar senha"
                                    {...register("confirmPassword")}
                                />
                            </GridItem>
                            <GridItem pl="2" area={'row5'}>
                                <Select 
                                    name="sex"
                                    error={errors.sex}
                                    placeholder='Sexo'
                                    options={[
                                        { value: "masculino", label: "Masculino" },
                                        { value: "feminino", label: "Feminino" },
                                    ]}
                                    {...register("sex")}
                                />
                            </GridItem>
                            <GridItem pl="2" area={'row6'}>
                                <Select
                                    name="is_employee"
                                    error={errors.is_employee}
                                    placeholder="Está empregado?"
                                    options={[
                                    { value: "true", label: "Sim" },
                                    { value: "false", label: "Não" },
                                    ]}
                                    
                                    {...register("is_employee")}
                                />
                            </GridItem>
                            <GridItem pl="2" area={'row7'}>
                                <Input
                                    name="functionn"
                                    type="functionn"
                                    error={errors.functionn}
                                    placeholder="Função"
                                    {...register("functionn")}
                                />
                            </GridItem>
                            <GridItem pl="2" area={'row8'}>
                                <Input
                                    name="identifier"
                                    type="identifier"
                                    error={errors.identifier}
                                    placeholder="CPF/CNPJ"
                                    {...register("identifier")}
                                />
                            </GridItem>
                            <GridItem pl="2" area={'row9'}>
                                <Input
                                    name="road"
                                    type="road"
                                    error={errors.road}
                                    placeholder="Rua"
                                    {...register("road")}
                                />
                            </GridItem>
                            <GridItem pl="2" area={'row10'}>
                                <Input
                                    name="number"
                                    type="number"
                                    error={errors.number}
                                    placeholder="Número"
                                    {...register("number")}
                                />
                            </GridItem>
                            <GridItem pl="2" area={'row11'}>
                                <Input
                                    name="neighborhood"
                                    type="neighborhood"
                                    error={errors.neighborhood}
                                    placeholder="Bairro"
                                    {...register("neighborhood")}
                                />
                            </GridItem>
                            <GridItem pl="2" area={'row12'}>
                                <InputMask
                                    name="telephone"
                                    type="telephone"
                                    mask="(**) *****-****"
                                    maskChar="_"
                                    error={errors.telephone}
                                    placeholder="Telefone"
                                    {...register("telephone")}
                                />
                            </GridItem>
                            
                        </Grid>
                    </VStack>
                </Flex>
                <Flex 
                    width="100%" 
                    maxWidth={1050} 
                    p="8" 
                    borderRadius={10} 
                    flexDir="column"
                >
                    <Stack spacing='1'>
                        <SimpleGrid
                            gap="2"
                            w="100%"
                            flex="1"
                            minChildWidth="90px"
                        >
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
                                Salvar
                            </Button>
                            <Link href="/" passHref>
                                <Button
                                    boxShadow="dark-lg"   
                                    borderRadius="full" 
                                    mt="4" 
                                    colorScheme="blue" 
                                    w='100%' 
                                    h="12"  
                                >
                                    Cancelar
                                </Button>
                            </Link>
                        </SimpleGrid>
                    </Stack>
                </Flex>
            </Stack>
        </Flex>
    );

}


const getServerSideProps = withSSRGuest(async ctx => {
    return {
        props: {},
    };
});

export { getServerSideProps };