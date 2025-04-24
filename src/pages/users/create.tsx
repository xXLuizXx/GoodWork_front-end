import Link from "next/link";
import { Input } from "@/components/Form/Input";
import { InputMask } from "@/components/Form/InputMask";
import { Button, Flex, Grid, GridItem, Image, SimpleGrid, Stack, Textarea, VStack, useToast } from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { api } from "@/services/apiClient";
import { useMutation } from "react-query";
import Router from "next/router";
import { queryClient } from "@/services/queryClient";
import { yupResolver } from "@hookform/resolvers/yup";
import { withSSRGuest } from "@/shared/withSSRGuest";
import { Select } from "@/components/Form/Select";
import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";

interface ICreateUser {
    name: string;
    road: string;
    number: string;
    identifier: string;
    neighborhood: string;
    telephone: string;
    email: string;
    password: string;
    confirmPassword: string;
    user_type: string;
    sex?: string;
    is_employee?: boolean;
    functionn?: string;
    ability?: string;
    curriculum?: File;
    business_area: string;
}

const validMandatoryFields = yup.object().shape({
    user_type: yup
        .string()
        .required('O tipo de usuário é obrigatório')
        .oneOf(['individual', 'company'], 'Tipo de usuário inválido'),
    name: yup
        .string()
        .when('user_type', (user_type, schema) => {
            const type = Array.isArray(user_type) ? user_type[0] : user_type;
            return type === 'company'
                ? schema.required('O nome da empresa é obrigatório')
                : schema.required('O nome completo é obrigatório');
        }),
    email: yup
        .string()
        .required('O e-mail é obrigatório')
        .email('O e-mail precisa ser válido'),
    password: yup
        .string()
        .required('A senha é obrigatória')
        .min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'As senhas não conferem')
        .required('A confirmação da senha é obrigatória'),
    identifier: yup
        .string()
        .required('O identificador (CPF/CNPJ) é obrigatório')
        .test('valid-identifier', 'CPF/CNPJ inválido', (value, context) => {
            const userType = context.parent.user_type;
            if (userType === 'company') {
                return /^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})\-(\d{2})$|^\d{14}$/.test(value);
            } else {
                return /^(\d{3})\.(\d{3})\.(\d{3})\-(\d{2})$|^\d{11}$/.test(value);
            }
        }),
    telephone: yup
        .string()
        .required('O telefone é obrigatório')
        .matches(/\(\d{2}\) \d{5}-\d{4}/, 'O telefone deve estar no formato (XX) XXXXX-XXXX'),
    road: yup.string().required('A rua é obrigatória'),
    number: yup
        .number()
        .typeError('O número deve ser numérico')
        .required('O número é obrigatório'),
    neighborhood: yup.string().required('O bairro é obrigatório'),
    curriculum: yup
        .mixed()
        .when('user_type', (user_type, schema) => {
            const type = Array.isArray(user_type) ? user_type[0] : user_type;
            if (type === 'company') {
                return schema.notRequired();
            }
            return schema
                .required('O arquivo é obrigatório')
                .test('fileType', 'Apenas arquivos do tipo PDF são permitidos', (value) => {
                    if (!value) return false;
                    return value.type === 'application/pdf';
                });
        }),
    ability: yup
        .string()
        .notRequired()
        .when('user_type', (user_type, schema) => {
            const type = Array.isArray(user_type) ? user_type[0] : user_type;
            return type === 'individual' ? schema.required('As habilidades são obrigatórias') : schema.notRequired();
        }),
    business_area: yup
        .string()
        .when('user_type', (user_type, schema) => {
            const type = Array.isArray(user_type) ? user_type[0] : user_type;
            return type === 'company' ? schema.required('A área de negócio é obrigatória') : schema.notRequired();
        }),
    is_employee: yup
        .string()
        .when('user_type', (user_type, schema) => {
            const type = Array.isArray(user_type) ? user_type[0] : user_type;
            return type === 'individual'
                ? schema
                      .required('A informação de emprego é obrigatória')
                      .oneOf(['true', 'false'], 'Valor inválido para a informação de emprego')
                : schema.notRequired();
        }),
    functionn: yup
        .string()
        .when('user_type', (user_type, schema) => {
            const type = Array.isArray(user_type) ? user_type[0] : user_type;
            return type === 'individual' ? schema.required('A função é obrigatória') : schema.notRequired();
        }),
});


export default function CreateUser(): JSX.Element {
        const { register, formState, handleSubmit, setValue } = useForm({
            resolver: yupResolver(validMandatoryFields),
        });
        const { errors } = formState;
        const toast = useToast();
        useEffect(() => {
            register("curriculum", { required: false });
        }, [register]);
        const [userType, setUserType] = useState<"" | "individual" | "company">("");
        
        const formatCpfCnpj = (value: string) => {
            if (value.length <= 14) {
                return value
                    .replace(/\D/g, "")
                    .replace(/(\d{3})(\d)/, "$1.$2")
                    .replace(/(\d{3})(\d)/, "$1.$2")
                    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
            } else {
                return value
                    .replace(/\D/g, "")
                    .replace(/^(\d{2})(\d)/, "$1.$2")
                    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
                    .replace(/\.(\d{3})(\d)/, ".$1/$2")
                    .replace(/(\d{4})(\d)/, "$1-$2");
            }
        };
    
        const handleIdentifierChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const formattedValue = formatCpfCnpj(event.target.value);
            setValue("identifier", formattedValue);
        };
    
        const createUser = useMutation(
            async (user: ICreateUser) => {
                try {
                    const response = await api.post("users", user,{
                        headers: { "Content-Type": "multipart/form-data" },
                    });
                    toast({
                        description: "Usuário criado com sucesso.",
                        status: "success",
                        position: "top",
                        duration: 8000,
                        isClosable: true,
                    });
                    Router.push("/");
                    return response.data.user;
                } catch (error) {
                    toast({
                        description: error.response?.data?.message || "Erro ao criar usuário",
                        status: "error",
                        position: "top",
                        duration: 8000,
                        isClosable: true,
                    });
                }
            },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries("users");
                },
            }
        );
    
        const createHandle: SubmitHandler<ICreateUser> = async (data) => {
            const formDataToSend = new FormData();
            
            for (const [key, value] of Object.entries(data)) {
                if (key === "curriculum" && value instanceof File) {
                    formDataToSend.append(key, value);
                } else if (value !== null && value !== undefined) {
                    formDataToSend.append(key, String(value));
                }
            }
        
            try {
                await createUser.mutateAsync(formDataToSend);
            } catch (error) {
                console.error("Erro no envio do formulário:", error);
            }
        };
        
        
    
        return (
            <Flex
                as="form"
                w="100vw"
                h="100vh"
                align="center"
                justify="center"
                overflowX="hidden"
                onSubmit={handleSubmit(createHandle)}
            >
                <Helmet>
                    <title>Criar Conta</title>
                    <link rel="icon" href="/Img/logos/GoodworkSSlogan.png" type="image/png" />
                </Helmet>
                <Stack w="40%" h="80%" spacing="1" align="center">
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
                            <Image maxW="100%" boxSize="250px" src="../Img/logos/GoodworkSSlogan.png" />
                            <Grid
                                pt="1%"
                                gap="2"
                                templateAreas={`"row1 row1"
                                                "row2 row3"
                                                "row4 row5"
                                                "row6 row7"
                                                "row8 row9"
                                                "row10 row11"
                                                "row12 row13"
                                                "row14 row14"
                                                "row15 row15"
                                                "row16 row17"`}
                                gridTemplateRows={
                                    userType === "" ? "auto" : "auto auto auto"
                                  }
                                gridTemplateColumns={"310px 1fr"}
                                w="550px"
                                minWidth={[200, 250]}
                            >
                                <GridItem pl="2" area={"row1"}>
                                    <Select
                                        name="user_type"
                                        error={errors.user_type}
                                        placeholder="Tipo de usuário"
                                        options={[
                                            { value: "individual", label: "Pessoa Física" },
                                            { value: "company", label: "Empresa" },
                                        ]}
                                        {...register("user_type")}
                                        onChange={(e) => {
                                            const value = e.target.value; 
                                            setUserType(value);
                                        }}
                                    />
                                </GridItem>
                                {userType === "" ? (
                                    <>
                                    </>
                                ) : userType === "individual" ? (
                                    <>
                                        <GridItem pl="2" area={'row2'}>
                                            <Input
                                                name="Nome"
                                                type="name"
                                                error={errors.name}
                                                placeholder="Nome Completo"
                                                {...register("name")}
                                            />
                                        </GridItem>
                                        <GridItem pl="2" area={'row3'}>
                                            <Input
                                                name="email"
                                                type="email"
                                                placeholder="E-mail"
                                                {...register("email")}
                                            />
                                        </GridItem>
                                        <GridItem pl="2" area={'row4'}>
                                            <Input
                                                name="password"
                                                type="password"
                                                error={errors.password}
                                                placeholder="Senha"
                                                {...register("password")}
                                            />
                                        </GridItem>
                                        <GridItem pl="2" area={'row5'}>
                                            <Input
                                                name="confirmPassword"
                                                type="password"
                                                error={errors.confirmPassword}
                                                placeholder="Confirmar senha"
                                                {...register("confirmPassword")}
                                            />
                                        </GridItem>
                                        <GridItem pl="2" area={'row6'}>
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
                                        <GridItem pl="2" area={'row7'}>
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
                                        <GridItem pl="2" area={'row8'}>
                                            <Input
                                                name="functionn"
                                                type="functionn"
                                                error={errors.functionn}
                                                placeholder="Função"
                                                {...register("functionn")}
                                            />
                                        </GridItem>
                                        <GridItem pl="2" area={'row9'}>
                                            <Input
                                                name="identifier"
                                                type="identifier"
                                                error={errors.identifier}
                                                placeholder="CPF/CNPJ"
                                                {...register("identifier")}
                                                onChange={handleIdentifierChange}
                                            />
                                        </GridItem>
                                        <GridItem pl="2" area={'row10'}>
                                            <Input
                                                name="road"
                                                type="road"
                                                error={errors.road}
                                                placeholder="Rua"
                                                {...register("road")}
                                            />
                                        </GridItem>
                                        <GridItem pl="2" area={'row11'}>
                                            <Input
                                                name="number"
                                                type="number"
                                                error={errors.number}
                                                placeholder="Número"
                                                {...register("number")}
                                            />
                                        </GridItem>
                                        <GridItem pl="2" area={'row12'}>
                                            <Input
                                                name="neighborhood"
                                                type="neighborhood"
                                                error={errors.neighborhood}
                                                placeholder="Bairro"
                                                {...register("neighborhood")}
                                            />
                                        </GridItem>
                                        <GridItem pl="2" area={'row13'}>
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
                                        <GridItem pl="2" area={'row14'}>
                                            <Textarea
                                                boxShadow="2xl"
                                                borderRadius="md"
                                                focusBorderColor="blue.400" 
                                                bgColor="gray.100" 
                                                variant="filled" 
                                                _hover={{ bgColor: 'gray.200' }} 
                                                size="lg"
                                                name="ability"
                                                type="ability"
                                                error={errors.ability}
                                                placeholder="Habilidades"
                                                {...register("ability")}
                                            />
                                        </GridItem>
                                        <GridItem pl="2" area={'row15'}>
                                            <Input
                                                type="file"
                                                name="curriculum"
                                                accept=".pdf"
                                                onChange={(event) => {
                                                    if (userType === "company") {
                                                        setValue("curriculum", null, { shouldValidate: true });
                                                    } else {
                                                        const file = event.target.files?.[0];
                                                        if (file) {
                                                            setValue("curriculum", file, { shouldValidate: true });
                                                        }
                                                    }
                                                }}
                                                error={errors.curriculum}
                                            />

                                        </GridItem>
                                    </>
                                ) : (
                                    <>
                                        <GridItem pl="2" area={"row2"}>
                                            <Input
                                                name="name"
                                                placeholder="Nome da Empresa"
                                                error={errors.name}
                                                {...register("name")}
                                            />
                                        </GridItem>
                                        <GridItem pl="2" area={"row3"}>
                                            <Input
                                                name="business_area"
                                                placeholder="Área de Negócio"
                                                error={errors.business_area}
                                                {...register("business_area")}
                                            />
                                        </GridItem>
                                        <GridItem pl="2" area={"row4"}>
                                            <Input
                                                name="identifier"
                                                type="identifier"
                                                error={errors.identifier}
                                                placeholder="CNPJ"
                                                {...register("identifier")}
                                                onChange={handleIdentifierChange}
                                            />
                                        </GridItem>
                                        <GridItem pl="2" area={"row5"}>
                                            <Input
                                                name="email"
                                                type="email"
                                                placeholder="E-mail"
                                                {...register("email")}
                                            />
                                        </GridItem>
                                        <GridItem pl="2" area={"row6"}>
                                            <Input
                                                name="password"
                                                type="password"
                                                error={errors.password}
                                                placeholder="Senha"
                                                {...register("password")}
                                            />
                                        </GridItem>
                                        <GridItem pl="2" area={'row7'}>
                                            <Input
                                                name="confirmPassword"
                                                type="password"
                                                error={errors.confirmPassword}
                                                placeholder="Confirmar senha"
                                                {...register("confirmPassword")}
                                            />
                                        </GridItem>
                                        <GridItem pl="2" area={"row8"}>
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
                                        <GridItem pl="2" area={"row9"}>
                                            <Input
                                                name="road"
                                                type="road"
                                                error={errors.road}
                                                placeholder="Rua"
                                                {...register("road")}
                                            />
                                        </GridItem>
                                        <GridItem pl="2" area={"row10"}>
                                            <Input
                                                name="number"
                                                type="number"
                                                error={errors.number}
                                                placeholder="Número"
                                                {...register("number")}
                                            />
                                        </GridItem>
                                        <GridItem pl="2" area={"row11"}>
                                            <Input
                                                name="neighborhood"
                                                type="text"
                                                error={errors.neighborhood}
                                                placeholder="Bairro"
                                                {...register("neighborhood")}
                                            />
                                        </GridItem>
                                    </>
                                )}
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

const getServerSideProps = withSSRGuest(async (ctx) => {
    return {
        props: {},
    };
});

export { getServerSideProps };
