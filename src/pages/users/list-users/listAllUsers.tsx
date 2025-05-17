import {
    Avatar, Box, Button, Card, CardBody, CardFooter, CardHeader, Flex,
    Heading, Text, VStack, HStack, Badge, Divider, SimpleGrid,
    useDisclosure, Modal, ModalBody, ModalContent, ModalFooter,
    ModalHeader, ModalOverlay, Stack, Alert, AlertIcon, useToast,
    Menu, MenuButton, MenuList, MenuItem, Tooltip, ModalCloseButton,
    Tag, TagLabel,
    Icon
} from "@chakra-ui/react";
import { GrFormView, GrAdd } from "react-icons/gr";
import { GoXCircleFill, GoCheckCircleFill, GoFilter } from "react-icons/go";
import { FaRegEdit, FaFileDownload } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { HeaderSearchProfiles } from "@/components/Header/HeaderSearchProfiles";
import { Helmet } from "react-helmet";
import { useRouter } from "next/router";
import { useAllDataUsers } from '@/services/hooks/Users/useListAllUsersForCompany';
import { parseCookies } from "nookies";
import decode from "jwt-decode";

interface DecodedToken {
    accessLevel: string;
    sub: string;
}

interface UserProfile {
    id?: string;
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
    is_employee?: boolean;
    curriculum?: string;
    business_area?: string;
}

export default function ListAllDataUsers() {
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
    const [filter, setFilter] = useState("all");
    const toast = useToast();
    const [mounted, setMounted] = useState(false);
    const [ typeUser, setTypeUser ] = useState("");
    const { search } = router.query;
    const [ userId, setUserId ] = useState("");
    const [searchTerm, setSearchTerm] = useState(typeof search === 'string' ? search : '');
    const [localSearch, setLocalSearch] = useState(searchTerm);

    useEffect(() => {
        setMounted(true);
        
        const cookies = parseCookies();
        const token = cookies["token.token"];

        if (token) {
            try {
                const decoded = decode<DecodedToken>(token);
                setTypeUser(decoded.accessLevel);
                setUserId(decoded.sub);
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
            }
        }
    }, []);

    const { data } = useAllDataUsers(userId);

    const filteredProfiles = data?.users?.filter(profile => {
        if (filter === "company") return profile.user_type === 'company';
        if (filter === "individual") return profile.user_type === 'individual';
        if (filter === "available") return profile.user_type === 'individual' && !profile.is_employee;
        return true;
    }) || [];

    const handleContact = (profile: UserProfile) => {
        toast({
            title: 'Contato iniciado',
            description: `Mensagem enviada para ${profile.name}`,
            status: 'success',
            duration: 5000,
            isClosable: true,
        });
    };

    const handleSearch = (term: string) => {
        router.push({
            pathname: '/users/list-users/searchUsers',
            query: { search: term }
        }, undefined, { shallow: true })
        .then(() => {
            setSearchTerm('');
        })
        .catch(error => {
            console.error("Erro na navegação:", error);
        });
    };


    const handleClearSearch = () => {
        setSearchTerm('');
        router.push('/users/list-users/searchUsers', undefined, { shallow: true });
    };

    if (data?.users?.length === 0) {
        return (
            <Stack>
                <Alert status="info">
                    <AlertIcon />
                    Nenhum perfil encontrado.
                </Alert>
            </Stack>
        );
    }

    return (
        <Flex as="form" direction="column" h="100vh">
            <Helmet>
                <title>Buscar Perfis</title>
                <link rel="icon" href="/Img/logos/GoodworkSSlogan.png" type="image/png" />
            </Helmet>
            <HeaderSearchProfiles 
                id={userId}
                searchValue={localSearch}
                onSearch={handleSearch}
                onClearSearch={handleClearSearch}
            />
    
            <Flex w="100%" my="8" maxWidth={1480} mx="auto" px="4">
                <Sidebar />
                
                <Box flex="1">
                    <Flex 
                        justify="space-between" 
                        align="center" 
                        mb="6" 
                        p="4" 
                        bg="white" 
                        borderRadius="md" 
                        boxShadow="sm"
                        flexWrap="wrap"
                        gap="4"
                    >
                        <HStack spacing="4">
                            <Menu>
                                <MenuButton 
                                    as={Button} 
                                    leftIcon={<Icon as={GoFilter} />} 
                                    variant="outline"
                                    size="sm"
                                >
                                    Filtrar
                                </MenuButton>
                                <MenuList>
                                    <MenuItem onClick={() => setFilter("all")}>
                                        Todos os Perfis
                                        <Badge ml="2" colorScheme="gray">
                                            {data?.users?.length || 0}
                                        </Badge>
                                    </MenuItem>
                                    <MenuItem onClick={() => setFilter("company")}>
                                        Empresas
                                        <Badge ml="2" colorScheme="blue">
                                            {data?.users?.filter(p => p.user_type === 'company').length || 0}
                                        </Badge>
                                    </MenuItem>
                                    <MenuItem onClick={() => setFilter("individual")}>
                                        Profissionais
                                        <Badge ml="2" colorScheme="green">
                                            {data?.users?.filter(p => p.user_type === 'individual').length || 0}
                                        </Badge>
                                    </MenuItem>
                                    <MenuItem onClick={() => setFilter("available")}>
                                        Disponíveis para contratação
                                        <Badge ml="2" colorScheme="orange">
                                            {data?.users?.filter(p => p.user_type === 'individual' && !p.is_employee).length || 0}
                                        </Badge>
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </HStack>
                    </Flex>

                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacingY="8" pb="4" >
                        {filteredProfiles.map(profile => (
                            <Card
                                key={profile.id}
                                boxShadow="dark-lg"
                                maxW="xs"
                                h="72"
                                mb="4"
                                _hover={{ 
                                    transform: "translateY(-2px)",
                                    transition: "all 0.2s ease"
                                }}
                            >
                                <CardHeader p="2">
                                    <Flex>
                                        <Flex flex="1" gap="4" alignItems="center">
                                            <Avatar name={profile.name} src={profile.avatar} size="md" />
                                            <Box>
                                                <Heading size="sm">
                                                    <Text fontSize="12" noOfLines={1}>
                                                        {profile.name}
                                                    </Text>
                                                </Heading>
                                                <Text fontSize="10" color="gray.600" noOfLines={1}>
                                                    {profile.email}
                                                </Text>
                                                <Text fontSize="10" color="gray.500" mt="1">
                                                    {profile.telephone}
                                                </Text>
                                            </Box>
                                        </Flex>
                                        <Tooltip label={profile.user_type === 'company' ? 'Empresa' : 'Profissional'}>
                                            <Badge 
                                                colorScheme={profile.user_type === 'company' ? 'blue' : 'green'}
                                                alignSelf="flex-start"
                                                ml="1"
                                                fontSize="9"
                                            >
                                                {profile.user_type === 'company' ? 'Empresa' : 'Profissional'}
                                            </Badge>
                                        </Tooltip>
                                    </Flex>
                                </CardHeader>

                                <CardBody p="2" fontSize="sm">
                                    <VStack spacing="2" alignItems="start">
                                        <Text textAlign="justify" fontSize="12" maxW="100%" noOfLines={3}>
                                            {profile.user_type === 'company' ? (
                                                <><strong>Área:</strong> {profile.business_area}</>
                                            ) : (
                                                <><strong>Função:</strong> {profile.functionn}</>
                                            )}
                                        </Text>
                                        <Text fontSize="12">
                                            <strong>Endereço:</strong> {profile.road}, {profile.number} - {profile.neighborhood}
                                        </Text>
                                        {profile.user_type === 'individual' && profile.ability && (
                                            <Box mt={2}>
                                                <Text fontSize="12" fontWeight="bold">Habilidades:</Text>
                                                <Flex wrap="wrap" gap={1}>
                                                    {profile.ability.split('|').slice(0, 3).map((skill, idx) => (
                                                        <Tag key={idx} size="sm" colorScheme="blue">
                                                            <TagLabel>{skill.trim()}</TagLabel>
                                                        </Tag>
                                                    ))}
                                                    {profile.ability.split('|').length > 3 && (
                                                        <Tag size="sm" colorScheme="gray">
                                                            <TagLabel>+{profile.ability.split('|').length - 3}</TagLabel>
                                                        </Tag>
                                                    )}
                                                </Flex>
                                            </Box>
                                        )}
                                    </VStack>
                                </CardBody>

                                <CardFooter alignItems="center" p="2.5" pt="1">
                                    <SimpleGrid gap="2" w="100%" flex="1" minChildWidth="90px">
                                        <Button
                                            variant="ghost"
                                            leftIcon={<GrFormView color="blue" />}
                                            onClick={() => {
                                                setSelectedProfile(profile);
                                                onOpen();
                                            }}
                                            size="xs"
                                        >
                                            Visualizar
                                        </Button>
                                        
                                        {profile.user_type === 'individual' && (
                                            <Button
                                                variant="ghost"
                                                leftIcon={<FaFileDownload color="green" />}
                                                size="xs"
                                                onClick={() => alert(`Download do currículo: ${profile.curriculum}`)}
                                            >
                                                Currículo
                                            </Button>
                                        )}
                                        {/* <Button
                                            variant="ghost"
                                            leftIcon={<Icon as={GoCheckCircleFill} color="purple" />}
                                            size="xs"
                                            onClick={() => handleContact(profile)}
                                        >
                                            Contatar
                                        </Button> */}
                                    </SimpleGrid>
                                </CardFooter>
                            </Card>
                        ))}
                    </SimpleGrid>
                </Box>
            </Flex>

            {selectedProfile && (
                <Modal
                    isCentered
                    onClose={() => {
                        setSelectedProfile(null);
                        onClose();
                    }}
                    isOpen={isOpen}
                    motionPreset="slideInBottom"
                    size="xl"
                >
                    <ModalOverlay />
                    <ModalContent borderRadius="lg" boxShadow="2xl">
                        <ModalHeader>
                            <Flex flex="1" gap="4" alignItems="center">
                                <Avatar name={selectedProfile.name} src={selectedProfile.avatar} size="lg" />
                                <Box>
                                    <Text fontWeight="bold" fontSize="xl">{selectedProfile.name}</Text>
                                    <Text fontSize="sm" color="gray.500">{selectedProfile.email}</Text>
                                </Box>
                                <Badge 
                                    ml="auto"
                                    colorScheme={selectedProfile.user_type === 'company' ? 'blue' : 'green'}
                                >
                                    {selectedProfile.user_type === 'company' ? 'Empresa' : 'Profissional'}
                                </Badge>
                            </Flex>
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody overflowY="auto" maxH="70vh" p="6">
                            <VStack align="start" spacing="6">
                                <Box w="100%">
                                    <Heading size="md" mb="4">Informações Básicas</Heading>
                                    <SimpleGrid columns={2} spacing="4">
                                        <Box>
                                            <Text fontWeight="bold">Telefone</Text>
                                            <Text>{selectedProfile.telephone}</Text>
                                        </Box>
                                        <Box>
                                            <Text fontWeight="bold">E-mail</Text>
                                            <Text>{selectedProfile.email}</Text>
                                        </Box>
                                        {selectedProfile.user_type === 'individual' && (
                                            <>
                                                <Box>
                                                    <Text fontWeight="bold">Função</Text>
                                                    <Text>{selectedProfile.functionn}</Text>
                                                </Box>
                                                <Box>
                                                    <Text fontWeight="bold">Status</Text>
                                                    <Badge colorScheme={selectedProfile.is_employee ? 'green' : 'orange'}>
                                                        {selectedProfile.is_employee ? 'Empregado' : 'Disponível'}
                                                    </Badge>
                                                </Box>
                                            </>
                                        )}
                                        {selectedProfile.user_type === 'company' && (
                                            <Box gridColumn="1 / -1">
                                                <Text fontWeight="bold">Área de Atuação</Text>
                                                <Text>{selectedProfile.business_area}</Text>
                                            </Box>
                                        )}
                                    </SimpleGrid>
                                </Box>

                                <Box w="100%">
                                    <Heading size="md" mb="4">Endereço</Heading>
                                    <SimpleGrid columns={2} spacing="4">
                                        <Box>
                                            <Text fontWeight="bold">Rua</Text>
                                            <Text>{selectedProfile.road}, {selectedProfile.number}</Text>
                                        </Box>
                                        <Box>
                                            <Text fontWeight="bold">Bairro</Text>
                                            <Text>{selectedProfile.neighborhood}</Text>
                                        </Box>
                                    </SimpleGrid>
                                </Box>

                                {selectedProfile.user_type === 'individual' && selectedProfile.ability && selectedProfile.ability.length > 0 && (
                                    <Box w="100%">
                                        <Heading size="md" mb="4">Habilidades</Heading>
                                        <Flex wrap="wrap" gap="2">
                                            {selectedProfile.ability?.split('|').map((skill, idx) => (
                                                <Badge key={idx} colorScheme="blue" p="2">
                                                    {skill.trim()}
                                                </Badge>
                                            ))}
                                        </Flex>
                                    </Box>
                                )}

                                {selectedProfile.user_type === 'individual' && selectedProfile.curriculum && (
                                    <Box w="100%">
                                        <Heading size="md" mb="4">Currículo</Heading>
                                        <Button 
                                            leftIcon={<FaFileDownload />} 
                                            colorScheme="blue"
                                            onClick={() => alert(`Download do currículo: ${selectedProfile.curriculum}`)}
                                        >
                                            Baixar Currículo
                                        </Button>
                                    </Box>
                                )}
                            </VStack>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                colorScheme="purple"
                                leftIcon={<Icon as={GoCheckCircleFill} />}
                                onClick={() => {
                                    handleContact(selectedProfile);
                                    onClose();
                                }}
                                mr={3}
                            >
                                Contatar {selectedProfile.user_type === 'company' ? 'Empresa' : 'Profissional'}
                            </Button>
                            <Button
                                colorScheme="blue"
                                onClick={() => {
                                    setSelectedProfile(null);
                                    onClose();
                                }}
                            >
                                Fechar
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </Flex>
    );
}