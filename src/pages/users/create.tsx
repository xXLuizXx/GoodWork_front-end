import Link from "next/link";
import { Input } from "@/components/Form/Input";
import { InputMask } from "@/components/Form/InputMask";
import { Button, Flex, Grid, GridItem, Image, SimpleGrid, Stack, Textarea, VStack, useToast, Box, Heading, Text, useColorModeValue, Tag, TagLabel, TagCloseButton, Wrap, WrapItem, InputGroup, InputLeftElement } from "@chakra-ui/react";
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
import { useCategories } from "@/services/hooks/Categories/useCategories";
import { SearchIcon } from "@chakra-ui/icons";

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
    categories_interest?: string[];
}

interface Category {
    id: string;
    name: string;
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
    categories_interest: yup
        .array()
        .of(yup.string())
        .when('user_type', (user_type, schema) => {
            const type = Array.isArray(user_type) ? user_type[0] : user_type;
            return type === 'individual' 
                ? schema
                    .max(3, 'Selecione no máximo 3 categorias')
                    .min(1, 'Selecione pelo menos uma categoria')
                    .required('Selecione pelo menos uma categoria')
                : schema.notRequired();
        }),
});

export default function CreateUser(): JSX.Element {
    const { register, formState, handleSubmit, setValue, watch, trigger } = useForm({
        resolver: yupResolver(validMandatoryFields),
    });
    const { errors } = formState;
    const toast = useToast();
    
    useEffect(() => {
        register("curriculum", { required: false });
        register("categories_interest", { required: true });
    }, [register]);
    
    const userType = watch("user_type");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('blue.200', 'blue.600');
    const primaryColor = useColorModeValue('blue.500', 'blue.300');
    const buttonBg = useColorModeValue('blue.500', 'blue.600');
    const buttonHover = useColorModeValue('blue.600', 'blue.500');
    const textColor = useColorModeValue('gray.600', 'gray.300');
    const headingColor = useColorModeValue('gray.800', 'white');
    
    const { data: categoriesData, isLoading: categoriesLoading } = useCategories();

    const filteredCategories = categoriesData?.categories?.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

    const handleCategorySelect = async (categoryId: string) => {
        let updatedCategories: string[];
        
        if (selectedCategories.includes(categoryId)) {
            updatedCategories = selectedCategories.filter(id => id !== categoryId);
        } else if (selectedCategories.length < 3) {
            updatedCategories = [...selectedCategories, categoryId];
        } else {
            toast({
                title: "Limite atingido",
                description: "Você pode selecionar no máximo 3 categorias.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setSelectedCategories(updatedCategories);
        setValue("categories_interest", updatedCategories, { shouldValidate: true });
        await trigger("categories_interest");
    };

    const removeCategory = async (categoryId: string) => {
        const updatedCategories = selectedCategories.filter(id => id !== categoryId);
        setSelectedCategories(updatedCategories);
        setValue("categories_interest", updatedCategories, { shouldValidate: true });
        await trigger("categories_interest");
    };

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
        
        console.log(">>>>>>>>>>>>DADOS<<<<<<<<<<<<<");
        console.log(data);

        for (const [key, value] of Object.entries(data)) {
            if (key === "curriculum" && value instanceof File) {
                formDataToSend.append(key, value);
            } else if (key === "categories_interest" && Array.isArray(value)) {
                formDataToSend.append(key, JSON.stringify(value));
            } else if (value !== null && value !== undefined) {
                formDataToSend.append(key, String(value));
            }
        }
    
        try {
            await createUser.mutateAsync(formDataToSend as unknown as ICreateUser);
        } catch (error) {
            console.error("Erro no envio do formulário:", error);
        }
    };
    
    return (
        <Flex
            as="form"
            w="100vw"
            minH="100vh"
            align="center"
            justify="center"
            overflowX="hidden"
            bg={bgColor}
            py={8}
            onSubmit={handleSubmit(createHandle)}
        >
            <Helmet>
                <title>Criar Conta</title>
                <link rel="icon" href="/Img/logos/GoodworkSSlogan.png" type="image/png" />
            </Helmet>
            
            <Box w={["95%", "90%", "70%"]} maxW="800px">
                <Flex
                    width="100%"
                    borderRadius="2xl"
                    borderWidth="1px"
                    borderColor={borderColor}
                    p={[4, 6, 8]}
                    bg={cardBg}
                    boxShadow="xl"
                    flexDir="column"
                >
                    <VStack spacing={6} w="100%">
                        <Box textAlign="center" mb={4}>
                            <Image 
                                maxW="100%" 
                                boxSize={["150px", "180px", "200px"]} 
                                src="../Img/logos/GoodworkSSlogan.png" 
                                alt="Goodwork Logo"
                                mx="auto"
                            />
                            <Heading as="h1" size="lg" color={headingColor} mt={4}>
                                Criar Nova Conta
                            </Heading>
                            <Text color={textColor} mt={2}>
                                Preencha os dados abaixo para criar sua conta
                            </Text>
                        </Box>
                        
                        <Grid
                            gap={4}
                            templateAreas={`"row1 row1"
                                            "row2 row3"
                                            "row4 row5"
                                            "row6 row7"
                                            "row8 row9"
                                            "row10 row11"
                                            "row12 row13"
                                            "row14 row14"
                                            "row15 row15"
                                            "row16 row17"
                                            "row18 row18"
                                            "buttons buttons"`}
                            gridTemplateRows={userType ? "auto" : "auto"}
                            gridTemplateColumns={["1fr", "1fr", "1fr 1fr"]}
                            w="100%"
                        >
                            <GridItem area={"row1"} colSpan={[1, 1, 2]}>
                                <Select
                                    name="user_type"
                                    error={errors.user_type}
                                    placeholder="Selecione o tipo de usuário"
                                    options={[
                                        { value: "individual", label: "Pessoa Física" },
                                        { value: "company", label: "Empresa" },
                                    ]}
                                    {...register("user_type")}
                                    size="lg"
                                />
                            </GridItem>
                            
                            {!userType ? (
                                <GridItem colSpan={[1, 1, 2]} textAlign="center" py={10}>
                                    <Text color={textColor}>
                                        Selecione um tipo de usuário para continuar
                                    </Text>
                                </GridItem>
                            ) : userType === "individual" ? (
                                <>
                                    <GridItem area={'row2'}>
                                        <Input
                                            name="name"
                                            type="text"
                                            error={errors.name}
                                            placeholder="Nome Completo"
                                            {...register("name")}
                                            size="lg"
                                        />
                                    </GridItem>
                                    <GridItem area={'row3'}>
                                        <Input
                                            name="email"
                                            type="email"
                                            placeholder="E-mail"
                                            error={errors.email}
                                            {...register("email")}
                                            size="lg"
                                        />
                                    </GridItem>
                                    <GridItem area={'row4'}>
                                        <Input
                                            name="password"
                                            type="password"
                                            error={errors.password}
                                            placeholder="Senha"
                                            {...register("password")}
                                            size="lg"
                                        />
                                    </GridItem>
                                    <GridItem area={'row5'}>
                                        <Input
                                            name="confirmPassword"
                                            type="password"
                                            error={errors.confirmPassword}
                                            placeholder="Confirmar senha"
                                            {...register("confirmPassword")}
                                            size="lg"
                                        />
                                    </GridItem>
                                    <GridItem area={'row6'}>
                                        <Select 
                                            name="sex"
                                            error={errors.sex}
                                            placeholder='Sexo'
                                            options={[
                                                { value: "masculino", label: "Masculino" },
                                                { value: "feminino", label: "Feminino" },
                                            ]}
                                            {...register("sex")}
                                            size="lg"
                                        />
                                    </GridItem>
                                    <GridItem area={'row7'}>
                                        <Select
                                            name="is_employee"
                                            error={errors.is_employee}
                                            placeholder="Está empregado?"
                                            options={[
                                            { value: "true", label: "Sim" },
                                            { value: "false", label: "Não" },
                                            ]}
                                            {...register("is_employee")}
                                            size="lg"
                                        />
                                    </GridItem>
                                    <GridItem area={'row8'}>
                                        <Input
                                            name="functionn"
                                            type="text"
                                            error={errors.functionn}
                                            placeholder="Função"
                                            {...register("functionn")}
                                            size="lg"
                                        />
                                    </GridItem>
                                    <GridItem area={'row9'}>
                                        <Input
                                            name="identifier"
                                            type="text"
                                            error={errors.identifier}
                                            placeholder="CPF"
                                            {...register("identifier")}
                                            onChange={handleIdentifierChange}
                                            size="lg"
                                        />
                                    </GridItem>
                                    <GridItem area={'row10'}>
                                        <Input
                                            name="road"
                                            type="text"
                                            error={errors.road}
                                            placeholder="Rua"
                                            {...register("road")}
                                            size="lg"
                                        />
                                    </GridItem>
                                    <GridItem area={'row11'}>
                                        <Input
                                            name="number"
                                            type="number"
                                            error={errors.number}
                                            placeholder="Número"
                                            {...register("number")}
                                            size="lg"
                                        />
                                    </GridItem>
                                    <GridItem area={'row12'}>
                                        <Input
                                            name="neighborhood"
                                            type="text"
                                            error={errors.neighborhood}
                                            placeholder="Bairro"
                                            {...register("neighborhood")}
                                            size="lg"
                                        />
                                    </GridItem>
                                    <GridItem area={'row13'}>
                                        <InputMask
                                            name="telephone"
                                            type="tel"
                                            mask="(**) *****-****"
                                            maskChar="_"
                                            error={errors.telephone}
                                            placeholder="Telefone"
                                            {...register("telephone")}
                                            size="lg"
                                        />
                                    </GridItem>
                                    <GridItem area={'row14'} colSpan={[1, 1, 2]}>
                                        <Textarea
                                            borderRadius="md"
                                            focusBorderColor={primaryColor}
                                            bgColor="gray.50"
                                            variant="filled"
                                            _hover={{ bgColor: 'gray.100' }}
                                            _focus={{ bgColor: 'white' }}
                                            size="lg"
                                            name="ability"
                                            error={errors.ability}
                                            placeholder="Habilidades"
                                            {...register("ability")}
                                            rows={4}
                                        />
                                    </GridItem>
                                    <GridItem area={'row15'} colSpan={[1, 1, 2]}>
                                        <Box 
                                            borderWidth="1px" 
                                            borderRadius="md" 
                                            p={4} 
                                            bg="gray.50"
                                            borderColor={errors.curriculum ? "red.500" : "gray.200"}
                                        >
                                            <Text fontWeight="medium" mb={2} color={headingColor}>
                                                Currículo (PDF)
                                            </Text>
                                            <Input
                                                type="file"
                                                name="curriculum"
                                                accept=".pdf"
                                                onChange={(event) => {
                                                    const file = event.target.files?.[0];
                                                    if (file) {
                                                        setValue("curriculum", file, { shouldValidate: true });
                                                    }
                                                }}
                                                variant="unstyled"
                                                p={1}
                                            />
                                            {errors.curriculum && (
                                                <Text color="red.500" fontSize="sm" mt={1}>
                                                    {errors.curriculum.message}
                                                </Text>
                                            )}
                                        </Box>
                                    </GridItem>
                                    <GridItem area={'row16'} colSpan={[1, 1, 2]}>
                                        <Box>
                                            <Text fontWeight="medium" mb={2} color={headingColor}>
                                                Categorias de Interesse (Máximo 3) *
                                            </Text>
                                            <Wrap spacing={2} mb={3}>
                                                {selectedCategories.map(categoryId => {
                                                    const category = categoriesData?.categories?.find(c => c.id === categoryId);
                                                    return (
                                                        <WrapItem key={categoryId}>
                                                            <Tag
                                                                size="md"
                                                                borderRadius="full"
                                                                variant="solid"
                                                                colorScheme="blue"
                                                            >
                                                                <TagLabel>{category?.name || 'Categoria'}</TagLabel>
                                                                <TagCloseButton onClick={() => removeCategory(categoryId)} />
                                                            </Tag>
                                                        </WrapItem>
                                                    );
                                                })}
                                            </Wrap>
                                            {errors.categories_interest && (
                                                <Text color="red.500" fontSize="sm" mb={2}>
                                                    {errors.categories_interest.message}
                                                </Text>
                                            )}
                                            
                                            {categoriesLoading ? (
                                                <Text>Carregando categorias...</Text>
                                            ) : (
                                                <>
                                                    {filteredCategories.length > 12 && (
                                                        <InputGroup mb={3}>
                                                            <InputLeftElement pointerEvents="none">
                                                                <SearchIcon color="gray.300" />
                                                            </InputLeftElement>
                                                            <Input
                                                                placeholder="Pesquisar categorias..."
                                                                value={searchTerm}
                                                                onChange={(e) => {
                                                                    setSearchTerm(e.target.value);
                                                                    setCurrentPage(1);
                                                                }}
                                                                size="md"
                                                            />
                                                        </InputGroup>
                                                    )}
                                                    
                                                    <SimpleGrid columns={[2, 3, 4]} spacing={2} mb={filteredCategories.length > 12 ? 3 : 0}>
                                                        {paginatedCategories.map(category => (
                                                            <Button
                                                                key={category.id}
                                                                size="sm"
                                                                variant={selectedCategories.includes(category.id) ? "solid" : "outline"}
                                                                colorScheme="blue"
                                                                onClick={() => handleCategorySelect(category.id)}
                                                                isDisabled={selectedCategories.length >= 3 && !selectedCategories.includes(category.id)}
                                                            >
                                                                {category.name}
                                                            </Button>
                                                        ))}
                                                    </SimpleGrid>

                                                    {filteredCategories.length > itemsPerPage && (
                                                        <Flex justify="center" mt={3} gap={2}>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                                isDisabled={currentPage === 1}
                                                            >
                                                                Anterior
                                                            </Button>
                                                            <Text fontSize="sm" mx={2}>
                                                                Página {currentPage} de {totalPages}
                                                            </Text>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                                isDisabled={currentPage === totalPages}
                                                            >
                                                                Próxima
                                                            </Button>
                                                        </Flex>
                                                    )}
                                                </>
                                            )}
                                        </Box>
                                    </GridItem>
                                </>
                            ) : (
                                <>
                                    <GridItem area={"row2"}>
                                        <Input
                                            name="name"
                                            placeholder="Nome da Empresa"
                                            error={errors.name}
                                            {...register("name")}
                                            size="lg"
                                        />
                                    </GridItem>
                                    <GridItem area={"row3"}>
                                        <Input
                                            name="business_area"
                                            placeholder="Área de Negócio"
                                            error={errors.business_area}
                                            {...register("business_area")}
                                            size="lg"
                                        />
                                    </GridItem>
                                    <GridItem area={"row4"}>
                                        <Input
                                            name="identifier"
                                            type="text"
                                            error={errors.identifier}
                                            placeholder="CNPJ"
                                            {...register("identifier")}
                                            onChange={handleIdentifierChange}
                                            size="lg"
                                        />
                                    </GridItem>
                                    <GridItem area={"row5"}>
                                        <Input
                                            name="email"
                                            type="email"
                                            placeholder="E-mail"
                                            error={errors.email}
                                            {...register("email")}
                                            size="lg"
                                        />
                                    </GridItem>
                                    <GridItem area={"row6"}>
                                        <Input
                                            name="password"
                                            type="password"
                                            error={errors.password}
                                            placeholder="Senha"
                                            {...register("password")}
                                            size="lg"
                                        />
                                    </GridItem>
                                    <GridItem area={'row7'}>
                                        <Input
                                            name="confirmPassword"
                                            type="password"
                                            error={errors.confirmPassword}
                                            placeholder="Confirmar senha"
                                            {...register("confirmPassword")}
                                            size="lg"
                                        />
                                    </GridItem>
                                    <GridItem area={"row8"}>
                                        <InputMask
                                            name="telephone"
                                            type="tel"
                                            mask="(**) *****-****"
                                            maskChar="_"
                                            error={errors.telephone}
                                            placeholder="Telefone"
                                            {...register("telephone")}
                                            size="lg"
                                        />
                                    </GridItem>
                                    <GridItem area={"row9"}>
                                        <Input
                                            name="road"
                                            type="text"
                                            error={errors.road}
                                            placeholder="Rua"
                                            {...register("road")}
                                            size="lg"
                                        />
                                    </GridItem>
                                    <GridItem area={"row10"}>
                                        <Input
                                            name="number"
                                            type="number"
                                            error={errors.number}
                                            placeholder="Número"
                                            {...register("number")}
                                            size="lg"
                                        />
                                    </GridItem>
                                    <GridItem area={"row11"}>
                                        <Input
                                            name="neighborhood"
                                            type="text"
                                            error={errors.neighborhood}
                                            placeholder="Bairro"
                                            {...register("neighborhood")}
                                            size="lg"
                                        />
                                    </GridItem>
                                </>
                            )}

                            <GridItem area={"buttons"} colSpan={[1, 1, 2]} mt={6}>
                                <SimpleGrid columns={[1, 2]} gap={4} w="100%">
                                    <Button 
                                        type="submit"  
                                        borderRadius="lg" 
                                        colorScheme="blue" 
                                        size="lg"
                                        height="14"
                                        isLoading={formState.isSubmitting}
                                        loadingText="Cadastrando..."
                                        bg={buttonBg}
                                        _hover={{ bg: buttonHover }}
                                        fontSize="md"
                                        fontWeight="semibold"
                                        w="100%"
                                    >
                                        Criar Conta
                                    </Button>
                                    <Link href="/" passHref>
                                        <Button
                                            borderRadius="lg" 
                                            size="lg"
                                            height="14"
                                            variant="outline"
                                            colorScheme="blue"
                                            fontSize="md"
                                            fontWeight="semibold"
                                            w="100%"
                                        >
                                            Cancelar
                                        </Button>
                                    </Link>
                                </SimpleGrid>
                            </GridItem>
                        </Grid>
                    </VStack>
                </Flex>
            </Box>
        </Flex>
    );    
}

const getServerSideProps = withSSRGuest(async (ctx) => {
    return {
        props: {},
    };
});

export { getServerSideProps };