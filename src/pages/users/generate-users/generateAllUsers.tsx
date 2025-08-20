import {
    Box, Flex, Heading, Text, VStack, HStack, Badge, 
    useToast, Menu, MenuButton, MenuList, 
    MenuItem, Tag, TagLabel, Icon, Avatar, Button, 
    Alert, AlertIcon, Spinner, Center, Input,
    InputGroup, InputLeftElement, Select, Stack
} from "@chakra-ui/react";
import { GrFormView } from "react-icons/gr";
import { GoCheckCircleFill, GoXCircleFill, GoFilter } from "react-icons/go";
import { FaFileDownload, FaUserEdit, FaSearch, FaCalendarAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header/Header";
import { useRouter } from "next/router";
import Link from "next/link";
import { FiMail, FiPhone, FiBriefcase } from "react-icons/fi";
import { Helmet } from "react-helmet";
import { parseCookies } from 'nookies';
import decode from "jwt-decode";
import { useAllDataUsers } from '@/services/hooks/Users/useListAllUsers';
import { useUpdateStatusUser } from '@/services/hooks/Users/useUpdateStatusUser';

interface DecodedToken {
    accessLevel: string;
    isAdmin: boolean;
    sub: string;
}

interface UserProfile {
    id: string;
    name: string;
    email: string;
    telephone: string;
    avatar?: string;
    road: string;
    number: string;
    neighborhood: string;
    user_type: "individual" | "company";
    functionn?: string;
    ability?: string;
    active: boolean;
    curriculum?: string;
    business_area?: string;
    created_at?: Date;
}

export default function UserManagementList() {
    const router = useRouter();
    const toast = useToast();
    
    const [ typeUser, setTypeUser] = useState("");
    const [admin, setAdmin] = useState(false); 
    const [ userId, setUserId ] = useState("");
    
    useEffect(() => {
        const cookies = parseCookies();
        const token = cookies["token.token"];

        if (token) {
            try {
                const decoded = decode<DecodedToken>(token);
                if (decoded.accessLevel) {
                    setTypeUser(decoded.accessLevel);
                    setAdmin(decoded.isAdmin);
                    setUserId(decoded.sub);
                }
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
            }
        }
    }, []);

    const { data, isLoading: hookLoading } = useAllDataUsers(userId, admin);
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { updateStatusUser, isLoadingStatus } = useUpdateStatusUser();
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
    const [typeFilter, setTypeFilter] = useState<"all" | "individual" | "company">("all");
    const [nameFilter, setNameFilter] = useState("");
    const [dateFilter, setDateFilter] = useState<"all" | "newest" | "oldest">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;


    useEffect(() => {
        if (data) {
            setUsers(data.users || []);
            setIsLoading(false);
        }
    }, [data]);

    const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
        try {
            await updateStatusUser(userId, !currentStatus);
            
        } catch (error) {
            toast({
                title: "Erro",
                description: "Ocorreu um erro ao alterar o status do usuário.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const filteredUsers = users.filter(user => {
        if (statusFilter === "active" && !user.active) return false;
        if (statusFilter === "inactive" && user.active) return false;
        
        if (typeFilter === "individual" && user.user_type !== "individual") return false;
        if (typeFilter === "company" && user.user_type !== "company") return false;
        
        if (nameFilter && !user.name.toLowerCase().includes(nameFilter.toLowerCase())) return false;
        
        return true;
    });

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (dateFilter === "newest") {
            return new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime();
        } else if (dateFilter === "oldest") {
            return new Date(a.created_at || "").getTime() - new Date(b.created_at || "").getTime();
        }
        return 0;
    });

    const totalPages = Math.ceil(sortedUsers.length / ITEMS_PER_PAGE);
    const paginatedUsers = sortedUsers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const activeCount = users.filter(u => u.active).length;
    const inactiveCount = users.filter(u => !u.active).length;
    const individualCount = users.filter(u => u.user_type === "individual").length;
    const companyCount = users.filter(u => u.user_type === "company").length;

    if (hookLoading || isLoading) {
        return (
            <Center h="200px">
                <Spinner size="xl" />
            </Center>
        );
    }

    if (users.length === 0) {
        return (
            <Alert status="info">
                <AlertIcon />
                Nenhum usuário cadastrado
            </Alert>
        );
    }

    return (
        <Flex direction="column" minH="100vh">
            <Helmet>
                <title>Gerenciamento de Usuários</title>
                <link rel="icon" href="/Img/logos/GoodworkSSlogan.png" type="image/png" />
            </Helmet>
            
            <Header />
            
            <Flex w="100%" my="8" maxWidth={1480} mx="auto" px="4">
                <Sidebar />
                
                <Box flex="1" p="4" width="100%">
                    <Heading size="lg" mb="6">Gerenciamento de Usuários</Heading>
                    
                    <Flex 
                        justify="space-between" 
                        align="center" 
                        mb="6" 
                        p="4" 
                        bg="white" 
                        borderRadius="md" 
                        boxShadow="lg" 
                        flexWrap="wrap"
                        gap="4"
                        position="sticky"
                        top="4"
                        zIndex="9"
                    >
                        <HStack spacing="4">
                            <Text fontWeight="bold" fontSize="sm">
                                Total: {users.length} | 
                                Ativos: {activeCount} | 
                                Inativos: {inactiveCount} | 
                                Profissionais: {individualCount} | 
                                Empresas: {companyCount}
                            </Text>
                        </HStack>
                    </Flex>

                    {/* Filtros avançados */}
                    <Box 
                        p="4" 
                        mb="6" 
                        bg="white" 
                        borderRadius="md" 
                        boxShadow="md"
                    >
                        <Heading size="md" mb="4">Filtros</Heading>
                        <Stack direction={{ base: "column", md: "row" }} spacing="4" flexWrap="wrap">
                            <InputGroup maxW="300px">
                                <InputLeftElement pointerEvents="none">
                                    <Icon as={FaSearch} color="gray.300" />
                                </InputLeftElement>
                                <Input 
                                    placeholder="Buscar por nome" 
                                    value={nameFilter}
                                    onChange={(e) => setNameFilter(e.target.value)}
                                />
                            </InputGroup>
                            
                            <Select 
                                maxW="200px" 
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                            >
                                <option value="all">Todos os status</option>
                                <option value="active">Ativos</option>
                                <option value="inactive">Inativos</option>
                            </Select>
                            
                            <Select 
                                maxW="200px" 
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value as any)}
                            >
                                <option value="all">Todos os tipos</option>
                                <option value="individual">Profissionais</option>
                                <option value="company">Empresas</option>
                            </Select>
                            
                            <Select 
                                maxW="200px" 
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value as any)}
                            >
                                <option value="all">Data de criação</option>
                                <option value="newest">Mais recentes</option>
                                <option value="oldest">Mais antigos</option>
                            </Select>
                        </Stack>
                    </Box>

                    <VStack spacing="4" align="stretch">
                        {paginatedUsers.map(user => (
                            <Box 
                                key={user.id}
                                boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                                _hover={{ 
                                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                                    transform: "translateY(-2px) scale(1.01)", 
                                    borderColor: "blue.200", 
                                }}
                                width="100%"
                                borderRadius="xl"
                                borderWidth="1px"
                                borderColor="gray.100"
                                bg="white"
                                position="relative"
                                overflow="hidden"
                            >
                                <Flex direction={{ base: "column", md: "row" }} justify="space-between">
                                    <Box flex="1" p="4" borderRight={{ md: "1px" }} borderColor={{ md: "gray.200" }}>
                                        <Flex 
                                            align="center" 
                                            mb="4"
                                            cursor="pointer"
                                            onClick={() => router.push(`/profile?user=${user.id}`)}
                                        >
                                            <Avatar 
                                                name={user.name}
                                                src={user.avatar ? `${process.env.NEXT_PUBLIC_API_URL}/avatars/${user.avatar}` : undefined}
                                                size="lg"
                                                mr="4"
                                            />
                                            <Box>
                                                <Heading size="md">{user.name}</Heading>
                                                <Text fontSize="sm" color="gray.500">
                                                    {user.user_type === 'individual' ? user.functionn || 'Profissional' : user.business_area || 'Empresa'}
                                                </Text>
                                                <Badge 
                                                    colorScheme={user.active ? "green" : "red"} 
                                                    fontSize="xs"
                                                    mt="1"
                                                >
                                                    {user.active ? "Ativo" : "Inativo"}
                                                </Badge>
                                            </Box>
                                        </Flex>

                                        <VStack align="start" spacing="2">
                                            <HStack>
                                                <Icon as={FiMail} color="gray.500" />
                                                <Text fontSize="sm">{user.email}</Text>
                                            </HStack>
                                            <HStack>
                                                <Icon as={FiPhone} color="gray.500" />
                                                <Text fontSize="sm">{user.telephone}</Text>
                                            </HStack>
                                            <HStack>
                                                <Icon as={FiBriefcase} color="gray.500" />
                                                <Text fontSize="sm">
                                                    {user.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'Data não disponível'}
                                                </Text>
                                            </HStack>
                                        </VStack>
                                    </Box>
                                
                                    <Box p="4" display="flex" alignItems="center">
                                        <VStack spacing="3" align="stretch" minWidth="fit-content">
                                            <Tag 
                                                size="md" 
                                                variant="subtle" 
                                                colorScheme={user.user_type === 'company' ? "purple" : "blue"}
                                                alignSelf="center"
                                            >
                                                <TagLabel>
                                                    {user.user_type === 'company' ? "Empresa" : "Profissional"}
                                                </TagLabel>
                                            </Tag>
                                    
                                            <Button 
                                                leftIcon={user.active ? <GoXCircleFill /> : <GoCheckCircleFill />}
                                                colorScheme={user.active ? "red" : "green"}
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleToggleUserStatus(user.id, user.active)}
                                                width="100%"
                                            >
                                                {user.active ? "Desativar" : "Ativar"}
                                            </Button>
                                            
                                            {user.user_type === 'individual' && user.curriculum && (
                                                <Button 
                                                    leftIcon={<FaFileDownload />}
                                                    variant="outline"
                                                    size="sm"
                                                    as={Link}
                                                    href={`${process.env.NEXT_PUBLIC_API_URL}/curriculum_user_profile/${user.curriculum}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    width="100%"
                                                >
                                                    Baixar Currículo
                                                </Button>
                                            )}
                                            
                                            <Button 
                                                leftIcon={<GrFormView />}
                                                variant="outline"
                                                size="sm"
                                                onClick={() => router.push(`/profile?user=${user.id}`)}
                                                width="100%"
                                            >
                                                Ver Perfil
                                            </Button>
                                        </VStack>
                                    </Box>
                                </Flex>
                            </Box>
                        ))}
                    </VStack>

                    {totalPages > 1 && (
                        <Flex justify="center" mt="6" gap="2">
                            <Button 
                                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                isDisabled={currentPage === 1}
                                size="sm"
                            >
                                Anterior
                            </Button>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <Button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    colorScheme={currentPage === page ? "blue" : "gray"}
                                    size="sm"
                                >
                                    {page}
                                </Button>
                            ))}
                            
                            <Button 
                                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                isDisabled={currentPage === totalPages}
                                size="sm"
                            >
                                Próxima
                            </Button>
                        </Flex>
                    )}
                </Box>
            </Flex>
        </Flex>
    );
}