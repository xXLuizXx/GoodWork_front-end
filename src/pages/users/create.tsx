import { Input } from "@/components/Form/Input";
import { InputMask } from "@/components/Form/InputMask";
import {
    Box, Button, Divider, Flex, Image, SimpleGrid, Textarea,
    VStack, useToast, Heading, Text, useColorModeValue,
    Tag, TagLabel, TagCloseButton, Wrap, WrapItem,
    InputGroup, InputLeftElement, Alert, AlertIcon,
    AlertDescription, HStack, Icon, Spinner,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { api } from "@/services/apiClient";
import { useMutation } from "react-query";
import Router from "next/router";
import { useRouter } from "next/router";
import { queryClient } from "@/services/queryClient";
import { yupResolver } from "@hookform/resolvers/yup";
import { withSSRGuest } from "@/shared/withSSRGuest";
import { Select } from "@/components/Form/Select";
import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import { useCategories } from "@/services/hooks/Categories/useCategories";
import { SearchIcon } from "@chakra-ui/icons";
import { Footer } from "@/components/Footer/Footer";
import { FiBriefcase, FiLogIn, FiUser } from "react-icons/fi";

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
        .oneOf([yup.ref('password')], 'As senhas não conferem')
        .required('A confirmação da senha é obrigatória'),
    sex: yup.string().notRequired(),
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
            if (type === 'company') return schema.notRequired();
            return schema
                .required('O arquivo é obrigatório')
                .test('fileType', 'Apenas arquivos do tipo PDF são permitidos', (value) => {
                    if (!value) return false;
                    return (value as any).type === 'application/pdf';
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
                ? schema.required('A informação de emprego é obrigatória').oneOf(['true', 'false'], 'Valor inválido')
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
                ? schema.max(3, 'Selecione no máximo 3 categorias').min(1, 'Selecione pelo menos uma categoria').required('Selecione pelo menos uma categoria')
                : schema.notRequired();
        }),
});

function SectionHeader({ title }: { title: string }) {
    return (
        <Box w="100%" mb={4}>
            <Text fontWeight="semibold" color="blue.600" fontSize="sm" mb={2}>
                {title}
            </Text>
            <Divider />
        </Box>
    );
}

export default function CreateUser(): JSX.Element {
    const router = useRouter();
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

    useEffect(() => {
        setValue("identifier", "");
    }, [userType, setValue]);

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const [created, setCreated] = useState(false);
    const [createdEmail, setCreatedEmail] = useState("");

    const pageBg      = useColorModeValue("gray.50", "gray.900");
    const cardBg      = useColorModeValue("white", "gray.800");
    const navBg       = useColorModeValue("#0000CD", "gray.900");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const inputBg     = useColorModeValue("gray.50", "gray.700");
    const inputHover  = useColorModeValue("gray.100", "gray.600");
    const textColor   = useColorModeValue("gray.600", "gray.400");
    const headingColor = useColorModeValue("gray.800", "white");
    const toggleUnselectedBorder = useColorModeValue("gray.300", "gray.600");
    const toggleUnselectedHover  = useColorModeValue("blue.50", "blue.900");
    const cvBoxBg     = useColorModeValue("gray.50", "gray.700");
    const cvBoxBorder = useColorModeValue("gray.200", "gray.600");

    const { data: categoriesData, isLoading: categoriesLoading } = useCategories();

    const filteredCategories = categoriesData?.categories?.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

    const handleCategorySelect = async (categoryId: string) => {
        let updated: string[];
        if (selectedCategories.includes(categoryId)) {
            updated = selectedCategories.filter(id => id !== categoryId);
        } else if (selectedCategories.length < 3) {
            updated = [...selectedCategories, categoryId];
        } else {
            toast({ title: "Limite atingido", description: "Você pode selecionar no máximo 3 categorias.", status: "warning", duration: 3000, isClosable: true });
            return;
        }
        setSelectedCategories(updated);
        setValue("categories_interest", updated, { shouldValidate: true });
        await trigger("categories_interest");
    };

    const removeCategory = async (categoryId: string) => {
        const updated = selectedCategories.filter(id => id !== categoryId);
        setSelectedCategories(updated);
        setValue("categories_interest", updated, { shouldValidate: true });
        await trigger("categories_interest");
    };

    const formatCpf = (value: string) => {
        const digits = value.replace(/\D/g, "").slice(0, 11);
        return digits
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})$/, "$1.$2.$3-$4");
    };

    const formatCnpj = (value: string) => {
        const digits = value.replace(/\D/g, "").slice(0, 14);
        return digits
            .replace(/^(\d{2})(\d)/, "$1.$2")
            .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1/$2")
            .replace(/(\d{4})(\d)/, "$1-$2");
    };

    const handleIdentifierChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = userType === "company" ? formatCnpj(event.target.value) : formatCpf(event.target.value);
        setValue("identifier", formatted, { shouldValidate: true });
    };

    const createUser = useMutation(
        async (user: ICreateUser) => {
            try {
                const response = await api.post("users", user, { headers: { "Content-Type": "multipart/form-data" } });
                return response.data.user;
            } catch (error) {
                toast({ description: (error as any).response?.data?.message || "Erro ao criar usuário", status: "error", position: "top", duration: 8000, isClosable: true });
            }
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries("users");
                setCreated(true);
            },
        }
    );

    const createHandle: SubmitHandler<ICreateUser> = async (data) => {
        const formDataToSend = new FormData();
        for (const [key, value] of Object.entries(data)) {
            if (key === "curriculum" && value instanceof File) {
                formDataToSend.append(key, value);
            } else if (key === "categories_interest" && Array.isArray(value)) {
                formDataToSend.append(key, JSON.stringify(value));
            } else if (value !== null && value !== undefined) {
                formDataToSend.append(key, String(value));
            }
        }
        setCreatedEmail(data.email ?? "");
        try {
            await createUser.mutateAsync(formDataToSend as unknown as ICreateUser);
        } catch (error) {
            console.error("Erro no envio do formulário:", error);
        }
    };

    const Navbar = (
        <Flex as="header" w="100%" h="16" bg={navBg} px={6} align="center" position="sticky" top={0} zIndex={100} boxShadow="dark-lg" flexShrink={0}>
            <Image
                src="/Img/logos/GoodWorkLogoBranco.png"
                alt="GoodWork"
                h="44px"
                w="auto"
                objectFit="contain"
                draggable={false}
                style={{ userSelect: "none", cursor: "pointer" }}
                onClick={() => router.push("/")}
            />
            <Flex flex={1} />
            <Button
                leftIcon={<FiLogIn />}
                variant="ghost"
                color="white"
                _hover={{ bg: "whiteAlpha.200" }}
                size="sm"
                type="button"
                onClick={() => router.push("/login")}
            >
                Entrar
            </Button>
        </Flex>
    );

    if (created) {
        return (
            <Flex direction="column" minH="100vh" bg={pageBg}>
                <Helmet>
                    <title>Conta criada!</title>
                    <link rel="icon" href="/Img/logos/GoodworkSSlogan.png" type="image/png" />
                </Helmet>
                {Navbar}
                <Flex flex={1} align="center" justify="center" py={10} px={4}>
                    <Box
                        bg={cardBg}
                        p={10}
                        borderRadius="2xl"
                        maxW="480px"
                        w="100%"
                        boxShadow="xl"
                        textAlign="center"
                        borderWidth="1px"
                        borderColor={borderColor}
                    >
                        <Image src="/Img/logos/GoodworkSSlogan.png" alt="GoodWork" boxSize="80px" mx="auto" mb={4} />
                        <Heading size="lg" color={headingColor} mb={3}>Conta criada com sucesso!</Heading>
                        <Alert status="info" borderRadius="xl" mb={5} textAlign="left">
                            <AlertIcon />
                            <AlertDescription fontSize="sm">
                                Enviamos um e-mail de verificação para <strong>{createdEmail || "o seu endereço"}</strong>.
                                Verifique sua caixa de entrada e clique no link para ativar sua conta.
                            </AlertDescription>
                        </Alert>
                        <Text color={textColor} fontSize="sm" mb={6}>
                            Não recebeu o e-mail? Verifique a pasta de spam.
                        </Text>
                        <Button colorScheme="blue" borderRadius="full" w="100%" size="lg" onClick={() => Router.push("/login")}>
                            Ir para o login
                        </Button>
                    </Box>
                </Flex>
                <Footer />
            </Flex>
        );
    }

    return (
        <Flex direction="column" minH="100vh" bg={pageBg}>
            <Helmet>
                <title>Criar Conta — GoodWork</title>
                <link rel="icon" href="/Img/logos/GoodworkSSlogan.png" type="image/png" />
            </Helmet>

            {Navbar}

            <Flex
                as="form"
                flex={1}
                direction="column"
                align="center"
                py={10}
                px={4}
                onSubmit={handleSubmit(createHandle as any)}
            >
                <Box
                    bg={cardBg}
                    borderRadius="2xl"
                    boxShadow="xl"
                    borderWidth="1px"
                    borderColor={borderColor}
                    p={[6, 8, 10]}
                    w="100%"
                    maxW="680px"
                >
                    <VStack spacing={8} align="stretch">

                        {/* Cabeçalho */}
                        <Box textAlign="center">
                            <Heading size="lg" color={headingColor}>Criar Nova Conta</Heading>
                            <Text color={textColor} mt={1} fontSize="sm">
                                Preencha os dados abaixo para criar sua conta
                            </Text>
                        </Box>

                        <Alert status="info" borderRadius="xl" fontSize="sm">
                            <AlertIcon />
                            <AlertDescription>
                                Após criar sua conta, você receberá um e-mail para verificar e ativar o acesso.
                            </AlertDescription>
                        </Alert>

                        {/* Tipo de conta */}
                        <Box>
                            <SectionHeader title="Tipo de conta" />
                            <HStack spacing={4}>
                                {[
                                    { value: "individual", label: "Pessoa Física", icon: FiUser },
                                    { value: "company",    label: "Empresa",       icon: FiBriefcase },
                                ].map(opt => (
                                    <Button
                                        key={opt.value}
                                        flex={1}
                                        h="56px"
                                        type="button"
                                        borderRadius="xl"
                                        borderWidth="2px"
                                        leftIcon={<Icon as={opt.icon} />}
                                        bg={userType === opt.value ? "blue.500" : "transparent"}
                                        color={userType === opt.value ? "white" : headingColor}
                                        borderColor={userType === opt.value ? "blue.500" : toggleUnselectedBorder}
                                        _hover={{ bg: userType === opt.value ? "blue.600" : toggleUnselectedHover }}
                                        onClick={() => setValue("user_type", opt.value, { shouldValidate: true })}
                                    >
                                        {opt.label}
                                    </Button>
                                ))}
                            </HStack>
                            {errors.user_type && (
                                <Text color="red.500" fontSize="sm" mt={2}>{errors.user_type.message as string}</Text>
                            )}
                        </Box>

                        {userType && (
                            <>
                                {/* Dados pessoais */}
                                <Box>
                                    <SectionHeader title="Dados pessoais" />
                                    <SimpleGrid columns={[1, 2]} gap={4}>
                                        <Input
                                            type="text"
                                            error={errors.name}
                                            placeholder={userType === "company" ? "Nome da Empresa" : "Nome Completo"}
                                            variant="filled"
                                            borderRadius="lg"
                                            focusBorderColor="blue.400"
                                            bgColor={inputBg}
                                            _hover={{ bgColor: inputHover }}
                                            {...register("name")}
                                        />
                                        <Input
                                            type="text"
                                            error={errors.identifier}
                                            placeholder={userType === "company" ? "CNPJ (00.000.000/0000-00)" : "CPF (000.000.000-00)"}
                                            value={watch("identifier") ?? ""}
                                            variant="filled"
                                            borderRadius="lg"
                                            focusBorderColor="blue.400"
                                            bgColor={inputBg}
                                            _hover={{ bgColor: inputHover }}
                                            {...register("identifier")}
                                            onChange={handleIdentifierChange}
                                        />
                                        {userType === "company" && (
                                            <Input
                                                placeholder="Área de Negócio"
                                                error={errors.business_area}
                                                variant="filled"
                                                borderRadius="lg"
                                                focusBorderColor="blue.400"
                                                bgColor={inputBg}
                                                _hover={{ bgColor: inputHover }}
                                                {...register("business_area")}
                                            />
                                        )}
                                        {userType === "individual" && (
                                            <Select
                                                error={errors.sex}
                                                placeholder="Sexo"
                                                options={[
                                                    { value: "masculino", label: "Masculino" },
                                                    { value: "feminino",  label: "Feminino"  },
                                                ]}
                                                {...register("sex")}
                                            />
                                        )}
                                        <InputMask
                                            type="tel"
                                            mask="(**) *****-****"
                                            maskChar="_"
                                            error={errors.telephone}
                                            placeholder="Telefone"
                                            variant="filled"
                                            borderRadius="lg"
                                            focusBorderColor="blue.400"
                                            bgColor={inputBg}
                                            _hover={{ bgColor: inputHover }}
                                            {...register("telephone")}
                                        />
                                    </SimpleGrid>
                                </Box>

                                {/* Endereço */}
                                <Box>
                                    <SectionHeader title="Endereço" />
                                    <VStack spacing={4} align="stretch">
                                        <Input
                                            type="text"
                                            error={errors.road}
                                            placeholder="Rua"
                                            variant="filled"
                                            borderRadius="lg"
                                            focusBorderColor="blue.400"
                                            bgColor={inputBg}
                                            _hover={{ bgColor: inputHover }}
                                            {...register("road")}
                                        />
                                        <SimpleGrid columns={2} gap={4}>
                                            <Input
                                                type="number"
                                                error={errors.number}
                                                placeholder="Número"
                                                variant="filled"
                                                borderRadius="lg"
                                                focusBorderColor="blue.400"
                                                bgColor={inputBg}
                                                _hover={{ bgColor: inputHover }}
                                                {...register("number")}
                                            />
                                            <Input
                                                type="text"
                                                error={errors.neighborhood}
                                                placeholder="Bairro"
                                                variant="filled"
                                                borderRadius="lg"
                                                focusBorderColor="blue.400"
                                                bgColor={inputBg}
                                                _hover={{ bgColor: inputHover }}
                                                {...register("neighborhood")}
                                            />
                                        </SimpleGrid>
                                    </VStack>
                                </Box>

                                {/* Dados profissionais (Pessoa Física) */}
                                {userType === "individual" && (
                                    <Box>
                                        <SectionHeader title="Dados profissionais" />
                                        <VStack spacing={4} align="stretch">
                                            <SimpleGrid columns={[1, 2]} gap={4}>
                                                <Input
                                                    type="text"
                                                    error={errors.functionn}
                                                    placeholder="Função"
                                                    variant="filled"
                                                    borderRadius="lg"
                                                    focusBorderColor="blue.400"
                                                    bgColor={inputBg}
                                                    _hover={{ bgColor: inputHover }}
                                                    {...register("functionn")}
                                                />
                                                <Select
                                                    error={errors.is_employee}
                                                    placeholder="Está empregado?"
                                                    options={[
                                                        { value: "true",  label: "Sim" },
                                                        { value: "false", label: "Não" },
                                                    ]}
                                                    {...register("is_employee")}
                                                />
                                            </SimpleGrid>

                                            <Box>
                                                <Textarea
                                                    borderRadius="lg"
                                                    focusBorderColor="blue.400"
                                                    bgColor={inputBg}
                                                    variant="filled"
                                                    _hover={{ bgColor: inputHover }}
                                                    _focus={{ bgColor: cardBg }}
                                                    borderColor={errors.ability ? "red.500" : undefined}
                                                    placeholder="Habilidades"
                                                    {...register("ability")}
                                                    rows={3}
                                                />
                                                {errors.ability && (
                                                    <Text color="red.500" fontSize="sm" mt={1}>{errors.ability.message as string}</Text>
                                                )}
                                            </Box>

                                            <Box
                                                borderWidth="1px"
                                                borderRadius="lg"
                                                p={4}
                                                bg={cvBoxBg}
                                                borderColor={errors.curriculum ? "red.500" : cvBoxBorder}
                                            >
                                                <Text fontWeight="medium" mb={2} color={headingColor} fontSize="sm">
                                                    Currículo (PDF)
                                                </Text>
                                                <Input
                                                    type="file"
                                                    name="curriculum"
                                                    accept=".pdf"
                                                    onChange={(event) => {
                                                        const file = event.target.files?.[0];
                                                        if (file) setValue("curriculum", file, { shouldValidate: true });
                                                    }}
                                                    variant="unstyled"
                                                    p={1}
                                                />
                                                {errors.curriculum && (
                                                    <Text color="red.500" fontSize="sm" mt={1}>{errors.curriculum.message as string}</Text>
                                                )}
                                            </Box>

                                            <Box>
                                                <Text fontWeight="medium" mb={3} color={headingColor} fontSize="sm">
                                                    Categorias de Interesse (máximo 3)
                                                </Text>
                                                <Wrap spacing={2} mb={3}>
                                                    {selectedCategories.map(catId => {
                                                        const cat = categoriesData?.categories?.find(c => c.id === catId);
                                                        return (
                                                            <WrapItem key={catId}>
                                                                <Tag size="md" borderRadius="full" variant="solid" colorScheme="blue">
                                                                    <TagLabel>{cat?.name || "Categoria"}</TagLabel>
                                                                    <TagCloseButton onClick={() => removeCategory(catId)} />
                                                                </Tag>
                                                            </WrapItem>
                                                        );
                                                    })}
                                                </Wrap>
                                                {errors.categories_interest && (
                                                    <Text color="red.500" fontSize="sm" mb={2}>{errors.categories_interest.message as string}</Text>
                                                )}
                                                {categoriesLoading ? (
                                                    <Flex justify="center" py={4}><Spinner color="blue.400" size="sm" /></Flex>
                                                ) : (
                                                    <>
                                                        {(categoriesData?.categories?.length ?? 0) > 12 && (
                                                            <InputGroup mb={3}>
                                                                <InputLeftElement pointerEvents="none">
                                                                    <SearchIcon color="gray.400" />
                                                                </InputLeftElement>
                                                                <Input
                                                                    name="search_categories"
                                                                    placeholder="Pesquisar categorias..."
                                                                    value={searchTerm}
                                                                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                                                    variant="filled"
                                                                    borderRadius="lg"
                                                                    bgColor={inputBg}
                                                                />
                                                            </InputGroup>
                                                        )}
                                                        <SimpleGrid columns={[2, 3]} spacing={2} mb={filteredCategories.length > itemsPerPage ? 3 : 0}>
                                                            {paginatedCategories.map(cat => (
                                                                <Button
                                                                    key={cat.id}
                                                                    size="sm"
                                                                    type="button"
                                                                    variant={selectedCategories.includes(cat.id) ? "solid" : "outline"}
                                                                    colorScheme="blue"
                                                                    borderRadius="full"
                                                                    onClick={() => handleCategorySelect(cat.id)}
                                                                    isDisabled={selectedCategories.length >= 3 && !selectedCategories.includes(cat.id)}
                                                                    whiteSpace="normal"
                                                                    wordBreak="break-word"
                                                                    textAlign="center"
                                                                    height="auto"
                                                                    minH="36px"
                                                                    py={2}
                                                                >
                                                                    {cat.name}
                                                                </Button>
                                                            ))}
                                                        </SimpleGrid>
                                                        {filteredCategories.length > itemsPerPage && (
                                                            <HStack justify="center" mt={2} spacing={3}>
                                                                <Button size="sm" type="button" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} isDisabled={currentPage === 1}>
                                                                    Anterior
                                                                </Button>
                                                                <Text fontSize="sm" color={textColor}>
                                                                    {currentPage} / {totalPages}
                                                                </Text>
                                                                <Button size="sm" type="button" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} isDisabled={currentPage === totalPages}>
                                                                    Próxima
                                                                </Button>
                                                            </HStack>
                                                        )}
                                                    </>
                                                )}
                                            </Box>
                                        </VStack>
                                    </Box>
                                )}

                                {/* Acesso */}
                                <Box>
                                    <SectionHeader title="Acesso" />
                                    <VStack spacing={4}>
                                        <Input
                                            type="email"
                                            placeholder="E-mail"
                                            error={errors.email}
                                            variant="filled"
                                            borderRadius="lg"
                                            focusBorderColor="blue.400"
                                            bgColor={inputBg}
                                            _hover={{ bgColor: inputHover }}
                                            {...register("email")}
                                        />
                                        <SimpleGrid columns={[1, 2]} gap={4} w="100%">
                                            <Input
                                                type="password"
                                                error={errors.password}
                                                placeholder="Senha"
                                                variant="filled"
                                                borderRadius="lg"
                                                focusBorderColor="blue.400"
                                                bgColor={inputBg}
                                                _hover={{ bgColor: inputHover }}
                                                {...register("password")}
                                            />
                                            <Input
                                                type="password"
                                                error={errors.confirmPassword}
                                                placeholder="Confirmar senha"
                                                variant="filled"
                                                borderRadius="lg"
                                                focusBorderColor="blue.400"
                                                bgColor={inputBg}
                                                _hover={{ bgColor: inputHover }}
                                                {...register("confirmPassword")}
                                            />
                                        </SimpleGrid>
                                    </VStack>
                                </Box>

                                {/* Botões */}
                                <SimpleGrid columns={[1, 2]} gap={4} pt={2}>
                                    <Button
                                        type="submit"
                                        colorScheme="blue"
                                        borderRadius="full"
                                        size="lg"
                                        isLoading={formState.isSubmitting}
                                        loadingText="Cadastrando..."
                                    >
                                        Criar Conta
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        colorScheme="blue"
                                        borderRadius="full"
                                        size="lg"
                                        onClick={() => router.push("/")}
                                    >
                                        Cancelar
                                    </Button>
                                </SimpleGrid>
                            </>
                        )}

                        {!userType && (
                            <Text textAlign="center" color={textColor} fontSize="sm" pb={2}>
                                Selecione um tipo de conta para continuar
                            </Text>
                        )}

                    </VStack>
                </Box>
            </Flex>

            <Footer />
        </Flex>
    );
}

const getServerSideProps = withSSRGuest(async () => {
    return { props: {} };
});

export { getServerSideProps };
