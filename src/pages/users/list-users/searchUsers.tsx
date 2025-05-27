import {
    Avatar, Box, Button, Card, CardBody, CardFooter, CardHeader, Flex,
    Heading, Text, VStack, HStack, Badge, Divider, SimpleGrid,
    useDisclosure, Modal, ModalBody, ModalContent, ModalFooter,
    ModalHeader, ModalOverlay, Stack, Alert, AlertIcon, useToast,
    Menu, MenuButton, MenuList, MenuItem, Tooltip, ModalCloseButton,
    Tag, TagLabel, Icon
} from "@chakra-ui/react";
import { GrFormView } from "react-icons/gr";
import { GoXCircleFill, GoCheckCircleFill, GoFilter } from "react-icons/go";
import { FaFileDownload } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { HeaderSearchProfiles } from "@/components/Header/HeaderSearchProfiles";
import { Helmet } from "react-helmet";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import decode from "jwt-decode";
import { useAllDataUsersSearch } from "@/services/hooks/Users/useListAllUsersSearch";
import { api } from "@/services/apiClient";
import { ContactModal } from "@/components/Contact/contactModal";

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

export default function SearchAllUsers() {
    const {
        isOpen: isContactModalOpen,
        onOpen: onContactModalOpen,
        onClose: onContactModalClose,
    } = useDisclosure();
    const [contactModalData, setContactModalData] = useState<{
        profile: UserProfile | null;
        contactData: {
            subject: string;
            company: string;
            email_company: string;
            telephone: string;
            message: string;
            jobTitle: string;
        } | null;
    }>({
        profile: null,
        contactData: null
    });
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
    const [filter, setFilter] = useState("all");
    const toast = useToast();
    const [userId, setUserId] = useState("");
    const { search } = router.query;
    const [searchTerm, setSearchTerm] = useState(typeof search === 'string' ? search : '');
    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    useEffect(() => {
        const cookies = parseCookies();
        const token = cookies["token.token"];
        if (token) {
            try {
                const decoded = decode<DecodedToken>(token);
                setUserId(decoded.sub);
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
            }
        }
    }, []);

    const handleSearch = async (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1);
        await router.push({
            pathname: '/users/list-users/searchUsers',
            query: { search: term }
        }, undefined, { shallow: true });
    };

    const handleSearchComplete = () => {};

    const handleClearSearch = () => {
        setSearchTerm('');
        setCurrentPage(1);
        router.push('/users/list-users/searchUsers', undefined, { shallow: true });
    };

    const { data, isLoading } = useAllDataUsersSearch(searchTerm, userId);
    const users = data?.users ?? [];
    
    const filteredProfiles = users.filter(profile => {
        if (filter === "company") return profile.user_type === 'company';
        if (filter === "individual") return profile.user_type === 'individual';
        if (filter === "available") return profile.user_type === 'individual' && !profile.is_employee;
        return true;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProfiles = filteredProfiles.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);

    const handleContact = async (contactData: {
        subject: string;
        company: string;
        email_company: string;
        telephone: string;
        message: string;
        jobTitle: string;
    }) => {
        if (!contactModalData.profile) {
            throw new Error('Perfil não selecionado');
        }

        console.log("DADOS E-MAIL");
        console.log(contactModalData);
        try {
            const response = await api.post('/mail/', {
                to: contactModalData.profile.email,
                subject: contactData.subject,
                variables: {
                    name: contactModalData.profile.name,
                    jobTitle: contactData.jobTitle,
                    company: contactData.company,
                    email_company: contactData.email_company,
                    telephone: contactData.telephone,
                    message: contactData.message
                }
            });

            toast({
                title: 'Contato enviado!',
                description: `Proposta enviada para ${contactModalData.profile.name}`,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            return response.data;
        } catch (error) {
            console.error('Erro ao enviar e-mail:', error);
            toast({
                title: 'Erro ao enviar',
                description: error.response?.data?.message || 'Não foi possível enviar o contato',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            throw error;
        }
    };

    const handleOpenContact = (profile: UserProfile) => {
        setContactModalData({
            profile,
            contactData: {
                subject: `Oportunidade de Vaga para ${profile.name}`,
                company: "",
                email_company: "",
                telephone: "",
                message: `Olá ${profile.name},\n\nEncontramos seu perfil e gostaríamos de conversar sobre uma possível oportunidade em nossa equipe.`
            }
        });
        onContactModalOpen();
    };

    const PaginationButtons = () => {
        if (totalPages <= 1) return null;

        return (
            <Flex justify="center" mt="8" gap="2">
                <Button
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    isDisabled={currentPage === 1}
                >
                    «
                </Button>
                <Button
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    isDisabled={currentPage === 1}
                >
                    ‹
                </Button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                        pageNum = i + 1;
                    } else if (currentPage <= 3) {
                        pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                    } else {
                        pageNum = currentPage - 2 + i;
                    }

                    return (
                        <Button
                            key={pageNum}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            colorScheme={currentPage === pageNum ? 'blue' : 'gray'}
                        >
                            {pageNum}
                        </Button>
                    );
                })}

                <Button
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    isDisabled={currentPage === totalPages}
                >
                    ›
                </Button>
                <Button
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    isDisabled={currentPage === totalPages}
                >
                    »
                </Button>
            </Flex>
        );
    };

    if (isLoading) {
        return (
            <Flex justify="center" align="center" h="100vh">
                <Text>Carregando...</Text>
            </Flex>
        );
    }

    if (searchTerm && users.length === 0) {
        return (
            <Flex direction="column" h="100vh">
                <HeaderSearchProfiles 
                    id={userId}
                    searchValue={searchTerm}
                    onSearch={handleSearch}
                    onClearSearch={handleClearSearch}
                    onSearchComplete={handleSearchComplete}
                />
                <Flex w="100%" my="8" maxWidth={1480} mx="auto" px="4">
                    <Sidebar />
                    <Stack flex="1" p="4">
                        <Alert status="info">
                            <AlertIcon />
                            Nenhum perfil encontrado para "{searchTerm}".
                        </Alert>
                    </Stack>
                </Flex>
            </Flex>
        );
    }

    return (
        <Flex direction="column" h="100vh">
            <Helmet>
                <title>Buscar Perfis</title>
                <link rel="icon" href="/Img/logos/GoodworkSSlogan.png" type="image/png" />
            </Helmet>
            
            <HeaderSearchProfiles 
                id={userId}
                searchValue={searchTerm}
                onSearch={handleSearch}
                onClearSearch={handleClearSearch}
                onSearchComplete={handleSearchComplete}
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
                                    <MenuItem onClick={() => { setFilter("all"); setCurrentPage(1); }}>
                                        Todos os Perfis
                                        <Badge ml="2" colorScheme="gray">
                                            {users.length}
                                        </Badge>
                                    </MenuItem>
                                    <MenuItem onClick={() => { setFilter("company"); setCurrentPage(1); }}>
                                        Empresas
                                        <Badge ml="2" colorScheme="blue">
                                            {users.filter(p => p.user_type === 'company').length}
                                        </Badge>
                                    </MenuItem>
                                    <MenuItem onClick={() => { setFilter("individual"); setCurrentPage(1); }}>
                                        Profissionais
                                        <Badge ml="2" colorScheme="green">
                                            {users.filter(p => p.user_type === 'individual').length}
                                        </Badge>
                                    </MenuItem>
                                    <MenuItem onClick={() => { setFilter("available"); setCurrentPage(1); }}>
                                        Disponíveis para contratação
                                        <Badge ml="2" colorScheme="orange">
                                            {users.filter(p => p.user_type === 'individual' && !p.is_employee).length}
                                        </Badge>
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </HStack>
                    </Flex>

                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacingY="8" pb="4">
                        {currentProfiles.map(profile => (
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
                                        <Button
                                            variant="ghost"
                                            leftIcon={<Icon as={GoCheckCircleFill} color="purple" />}
                                            size="xs"
                                            onClick={() => handleOpenContact(profile)}
                                        >
                                            Contatar
                                        </Button>
                                    </SimpleGrid>
                                </CardFooter>
                            </Card>
                        ))}
                    </SimpleGrid>
                    <PaginationButtons />
                </Box>
            </Flex>

            {selectedProfile && (
                <Modal isOpen={isOpen} onClose={onClose} size="xl">
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>
                            <Flex align="center">
                                <Avatar name={selectedProfile.name} src={selectedProfile.avatar} mr="4" />
                                <Box>
                                    <Heading size="md">{selectedProfile.name}</Heading>
                                    <Text fontSize="sm" color="gray.500">{selectedProfile.email}</Text>
                                </Box>
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
                            <Button colorScheme="blue" mr={3} onClick={onClose}>
                                Fechar
                            </Button>
                            <Button 
                                colorScheme="green" 
                                onClick={() => {
                                    handleOpenContact(selectedProfile);
                                    onClose();
                                }}
                            >
                                Contatar
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}

            {contactModalData.profile && contactModalData.contactData && (
                <ContactModal
                    isOpen={isContactModalOpen}
                    onClose={() => {
                        onContactModalClose();
                        setContactModalData({ profile: null, contactData: null });
                    }}
                    profile={contactModalData.profile}
                    initialData={contactModalData.contactData}
                    onSendContact={handleContact}
                />
            )}
        </Flex>
    );
}