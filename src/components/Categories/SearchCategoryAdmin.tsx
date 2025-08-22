import { Avatar, Badge, Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, Heading, SimpleGrid, Text, VStack, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Alert, AlertIcon, useToast, Tooltip, Link, Input, Select, HStack, IconButton } from "@chakra-ui/react";
import { GrFormView } from "react-icons/gr";
import { GoXCircleFill, GoCheckCircleFill, GoSearch, GoArrowLeft, GoArrowRight } from "react-icons/go";
import { FiFilter, FiX } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useCountCategoriesNotValidated } from "@/services/hooks/Categories/useCountCategoriesNotValidated";
import { useValidateCategory } from "@/services/hooks/Categories/useValidateCategory";
import { parseCookies } from 'nookies';
import decode from "jwt-decode";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header/Header";
import { Helmet } from "react-helmet";
import { useGenerateCategories } from "@/services/hooks/Categories/useAllCategories";
import { useRouter } from "next/router";
import { HeaderAdminCategories } from "@/components/Header/HeaderAdminCategories";
import { useGenerateSearchCategories } from "@/services/hooks/Categories/useSearchCategories";

interface DecodedToken {
    isAdmin: boolean;
    sub: string;
}

interface CategoryWithUser {
    id: string;
    name: string;
    description: string;
    valid_category: boolean | null;
    created_at: Date;
    user: {
        id: string;
        name: string;
        avatar: string;
    } | null;
}

interface SearchCategoryAdminProps {
    search: string;
}
export function SearchCategoryAdmin({ search }: SearchCategoryAdminProps) {

    const router = useRouter();
    const [admin, setAdmin] = useState(false); 
    const [userId, setUserId] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
    const [sortBy, setSortBy] = useState<"all" | "newest" | "oldest">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        if (search) {
            setSearchTerm(search);
        }
    }, [search]);

    useEffect(() => {
        const cookies = parseCookies();
        const token = cookies["token.token"];

        if (token) {
            try {
                const decoded = decode<DecodedToken>(token);
                if (decoded.isAdmin) {
                    setAdmin(decoded.isAdmin);
                    setUserId(decoded.sub);
                }
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
            }
        }
    }, []);

    console.log("Chamando o hook<<<<<<<<<<");
    const { data, isLoading, isError } = useGenerateSearchCategories(search);
    console.log(data);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedCategory, setSelectedCategory] = useState<CategoryWithUser | null>(null);
    const toast = useToast();

    const filteredAndSortedCategories = () => {
        if (!data) return [];
        
        let filtered = [...data];
        
        if (statusFilter !== "all") {
            filtered = filtered.filter(category => 
                statusFilter === "active" ? category.valid_category : !category.valid_category
            );
        }
        
        if (searchTerm) {
            filtered = filtered.filter(category => 
                category.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                category.name.toLowerCase().includes(searchTerm.toLowerCase()) // Busca também pelo nome da categoria
            );
        }
        
        if (sortBy === "newest") {
            filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        } else if (sortBy === "oldest") {
            filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        }
        
        return filtered;
    };

    const filteredCategories = filteredAndSortedCategories();
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);
    const { validateCategory, isLoadingCategory } = useValidateCategory();

    const handleToggleCategoryStatus = async (categoryId: string, currentStatus: boolean | null) => {
        const newStatus = !currentStatus;
        const success = await validateCategory(categoryId, newStatus, "generate");
        
        if (success) {            
            if (selectedCategory?.id === categoryId) {
                onClose();
            }
        }
    };

    const UserAvatar = ({ user }: { user: { id: string; name: string; avatar: string } | null }) => {
        const avatarUrl = user?.avatar 
            ? `${process.env.NEXT_PUBLIC_API_URL}/avatars/${user.avatar}`
            : "../../../Img/icons/avatarLogin.png";
        
        return (
            <Avatar 
                border="1px" 
                size="md" 
                src={avatarUrl} 
                name={user?.name || ''}
                _hover={{ transform: 'scale(1.1)', transition: 'all 0.2s' }}
                cursor="pointer"
            />
        );
    };

    const resetFilters = () => {
        setSearchTerm("");
        setStatusFilter("all");
        setSortBy("all");
        setCurrentPage(1);
    };

    if (isLoading) {
        return (
            <Stack>
                <Alert status="info">
                    <AlertIcon />
                    Carregando categorias...
                </Alert>
            </Stack>
        );
    }

    if (isError || !data) {
        return (

            <Stack>
                <Alert status="error">
                    <AlertIcon />
                    Ocorreu um erro ao carregar as categorias.
                </Alert>
            </Stack>

        );
    }

    return (
        <Flex w="100%" my="8" maxWidth={1480} mx="auto" px="4">
            <Helmet>
                <title>Gerenciamento de Categorias</title>
                <link rel="icon" href="/Img/logos/GoodworkSSlogan.png" type="image/png" />
            </Helmet>
            <Box flex="1" ml={{ base: 0, md: 6 }}>
                <Card mb={6} boxShadow="md">
                    <CardHeader pb={3}>
                        <Flex justify="space-between" align="center">
                            <Heading size="md">Filtros</Heading>
                            <Button 
                                size="sm" 
                                variant="outline" 
                                leftIcon={<FiX />} 
                                onClick={resetFilters}
                                isDisabled={searchTerm === "" && statusFilter === "all" && sortBy === "all"}
                            >
                                Limpar Filtros
                            </Button>
                        </Flex>
                    </CardHeader>
                    <CardBody pt={0}>
                        <Flex direction={{ base: "column", md: "row" }} gap={4}>
                            <Box flex="1">
                                <Text fontSize="sm" fontWeight="medium" mb={2}>Buscar por solicitante</Text>
                                <Input
                                    placeholder="Digite o nome do solicitante"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    size="md"
                                />
                            </Box>
                            
                            <Box flex="1">
                                <Text fontSize="sm" fontWeight="medium" mb={2}>Status</Text>
                                <Select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
                                    size="md"
                                >
                                    <option value="all">Todas as categorias</option>
                                    <option value="active">Categorias ativas</option>
                                    <option value="inactive">Categorias inativas</option>
                                </Select>
                            </Box>
                            
                            <Box flex="1">
                                <Text fontSize="sm" fontWeight="medium" mb={2}>Ordenar por</Text>
                                <Select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as "all" | "newest" | "oldest")}
                                    size="md"
                                >
                                    <option value="all">Data de criação</option>
                                    <option value="newest">Mais recentes</option>
                                    <option value="oldest">Mais antigos</option>
                                </Select>
                            </Box>
                        </Flex>
                    </CardBody>
                </Card>

                <SimpleGrid columns={[1, 2, 3]} spacing={6} mb={6}>
                    {paginatedCategories.map((category: CategoryWithUser) => (
                        <Card key={category.id} boxShadow="lg" maxW="sm">
                            <CardHeader>
                                <Flex 
                                    alignItems="center" 
                                    gap={3}
                                    cursor="pointer"
                                    onClick={() => router.push(`/profile?user=${category.user_id}`)}
                                >
                                    <Tooltip label={`Ver perfil de ${category.user?.name || 'Solicitante'}`} hasArrow>
                                        <UserAvatar user={category.user} />
                                    </Tooltip>
                                    <Box>
                                        <Heading size="sm">{category.name}</Heading>
                                        <Text fontSize="xs" color="gray.500">
                                            Solicitado por: {category.user?.name || 'Solicitante'}
                                        </Text>
                                        <Badge 
                                            colorScheme={category.valid_category ? "green" : "red"} 
                                            fontSize="xs"
                                            mt="1"
                                        >
                                            {category.valid_category ? "Ativa" : "Inativa"}
                                        </Badge>
                                    </Box>
                                </Flex>
                            </CardHeader>

                            <CardBody>
                                <VStack align="start" spacing={3}>
                                    <Box>
                                        <Text fontWeight="semibold" fontSize="sm">Descrição:</Text>
                                        <Text fontSize="sm">{category.description || "Nenhuma descrição fornecida"}</Text>
                                    </Box>
                                    <Box>
                                        <Text fontWeight="semibold" fontSize="sm">Data de criação:</Text>
                                        <Text fontSize="sm">
                                            {new Date(category.created_at).toLocaleDateString('pt-BR')}
                                        </Text>
                                    </Box>
                                </VStack>
                            </CardBody>

                            <CardFooter>
                                <SimpleGrid columns={2} spacing={2} w="100%">
                                    <Button 
                                        leftIcon={category.valid_category ? <GoXCircleFill /> : <GoCheckCircleFill />}
                                        colorScheme={category.valid_category ? "red" : "green"}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleToggleCategoryStatus(category.id, category.valid_category)}
                                        width="100%"
                                        isLoading={isLoadingCategory}
                                    >
                                        {category.valid_category ? "Desativar" : "Ativar"}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        leftIcon={<GrFormView />}
                                        onClick={() => {
                                            setSelectedCategory(category);
                                            onOpen();
                                        }}
                                    >
                                        Detalhes
                                    </Button>
                                </SimpleGrid>
                            </CardFooter>
                        </Card>
                    ))}
                </SimpleGrid>
                
                {totalPages > 1 && (
                    <Flex justify="center" align="center" mt={8} gap={2}>
                        <Button
                            size="sm"
                            leftIcon={<GoArrowLeft />}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            isDisabled={currentPage === 1}
                        >
                            Anterior
                        </Button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <Button
                                key={page}
                                size="sm"
                                variant={currentPage === page ? "solid" : "outline"}
                                colorScheme={currentPage === page ? "blue" : "gray"}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </Button>
                        ))}
                        
                        <Button
                            size="sm"
                            rightIcon={<GoArrowRight />}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            isDisabled={currentPage === totalPages}
                        >
                            Próxima
                        </Button>
                    </Flex>
                )}

                {filteredCategories.length === 0 && (
                    <Flex justify="center" align="center" py={10}>
                        <Alert status="info" maxW="md">
                            <AlertIcon />
                            Nenhuma categoria encontrada com os filtros aplicados.
                        </Alert>
                    </Flex>
                )}

                {selectedCategory && (
                    <Modal isOpen={isOpen} onClose={onClose} size="xl">
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>
                                <Flex alignItems="center" gap={3}>
                                    <UserAvatar user={selectedCategory.user} />
                                    <Box>
                                        <Text>{selectedCategory.name}</Text>
                                        <Text fontSize="sm" color="gray.500">
                                            Solicitado por: {selectedCategory.user?.name || 'Solicitante'}
                                        </Text>
                                        <Badge 
                                            colorScheme={selectedCategory.valid_category ? "green" : "red"} 
                                            fontSize="xs"
                                            mt="1"
                                        >
                                            {selectedCategory.valid_category ? "Ativa" : "Inativa"}
                                        </Badge>
                                    </Box>
                                </Flex>
                            </ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <VStack spacing={4} align="start">
                                    <Box>
                                        <Text fontWeight="bold">Descrição:</Text>
                                        <Text>{selectedCategory.description || "Nenhuma descrição fornecida"}</Text>
                                    </Box>
                                    <Box>
                                        <Text fontWeight="bold">Data de criação:</Text>
                                        <Text>
                                            {new Date(selectedCategory.created_at).toLocaleString('pt-BR')}
                                        </Text>
                                    </Box>
                                    <Box>
                                        <Text fontWeight="bold">Solicitante:</Text>
                                        <Flex alignItems="center" mt={2}>
                                            <UserAvatar user={selectedCategory.user} />
                                            <Link 
                                                href={`/profile?user=${selectedCategory.user?.id || 'unknown'}`} 
                                                isExternal
                                                color="blue.500"
                                                _hover={{ textDecoration: 'underline' }}
                                                ml={2}
                                            >
                                                {selectedCategory.user?.name || 'Solicitante'}
                                            </Link>
                                        </Flex>
                                    </Box>
                                </VStack>
                            </ModalBody>
                            <ModalFooter>
                                <Button 
                                    leftIcon={selectedCategory.valid_category ? <GoXCircleFill /> : <GoCheckCircleFill />}
                                    colorScheme={selectedCategory.valid_category ? "red" : "green"}
                                    variant="outline"
                                    onClick={() => handleToggleCategoryStatus(selectedCategory.id, selectedCategory.valid_category)}
                                    isLoading={isLoadingCategory}
                                    mr={3}
                                >
                                    {selectedCategory.valid_category ? "Desativar" : "Ativar"} Categoria
                                </Button>
                                <Button variant="ghost" onClick={onClose}>
                                    Fechar
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                )}
            </Box>
        </Flex>
    );
}