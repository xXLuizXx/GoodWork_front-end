import { 
    Avatar, Box, Button, Card, CardBody, CardFooter, CardHeader, 
    Flex, Heading, Image, SimpleGrid, Text, VStack, useDisclosure, 
    Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, 
    ModalHeader, ModalOverlay, Stack, Alert, AlertIcon, useToast,
    Select, HStack, Badge, Center, Spinner
} from "@chakra-ui/react";
import { GrFormView } from "react-icons/gr";
import { GoXCircleFill, GoCheckCircleFill } from "react-icons/go";
import { FiX } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useValidateJob } from "@/services/hooks/Jobs/useValidateJob";
import { useRouter } from "next/router";
import { useAllJobs } from "@/services/hooks/Jobs/useAllJobs";
import decode from "jwt-decode";
import { parseCookies } from "nookies";
import { Helmet } from "react-helmet";

interface DecodedToken {
    isAdmin: boolean;
    sub: string;
}

interface Job {
    id: string;
    vacancy: string;
    description_vacancy: string;
    contractor?: string;
    user_name: string;
    user_id: string;
    user_avatar?: string;
    banner?: string;
    requirements: string;
    workload: string;
    location: string;
    benefits: string;
    amount_vacancy: string;
    valid_vacancy: boolean;
    created_at: string;
    closing_date: string;
}

interface SearchJobAdminProps {
    search: string;
}

export function GenerateAllJobs({ search }: SearchJobAdminProps) {
    const router = useRouter();
    const [admin, setAdmin] = useState(false); 
    const [userId, setUserId] = useState("");
    const { data, refetch, isLoading: jobsLoading } = useAllJobs(admin, search);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const { validateJob, isLoading } = useValidateJob();
    const toast = useToast();
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
    const [dateFilter, setDateFilter] = useState<"all" | "newest" | "oldest">("all");
    const [closingDateFilter, setClosingDateFilter] = useState<"all" | "expiring" | "expired">("all");
    const [searchFilter, setSearchFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 9;

    useEffect(() => {
        if (search !== undefined) {
            setSearchFilter(search as string);
        } else {
            setSearchFilter("");
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

    const handleValidate = async (jobId: string, validated: boolean) => {
        const aprovateVacancy = false;
        const success = await validateJob(jobId, validated, aprovateVacancy);
        if (success) {
            refetch();
            if (selectedJob?.id === jobId) {
                onClose();
            }
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const isJobExpired = (closingDate: string) => {
        return new Date(closingDate) < new Date();
    };

    const isJobExpiringSoon = (closingDate: string, days = 7) => {
        const today = new Date();
        const closing = new Date(closingDate);
        const diffTime = closing.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= days && diffDays >= 0;
    };

    const clearFilters = () => {
        setStatusFilter("all");
        setDateFilter("all");
        setClosingDateFilter("all");
        setSearchFilter("");
        setCurrentPage(1);
    };

    const hasActiveFilters = statusFilter !== "all" || dateFilter !== "all" || closingDateFilter !== "all" || searchFilter !== "";

    const filteredJobs = data?.jobs?.filter(job => {
        if (statusFilter === "active" && !job.valid_vacancy) return false;
        if (statusFilter === "inactive" && job.valid_vacancy) return false;
        
        if (searchFilter.length > 0 && searchFilter && !job.vacancy.toLowerCase().includes(searchFilter.toLowerCase())) {
            return false;
        }
        
        if (closingDateFilter === "expiring" && !isJobExpiringSoon(job.closing_date)) return false;
        if (closingDateFilter === "expired" && !isJobExpired(job.closing_date)) return false;
        
        return true;
    }) || [];

    const sortedJobs = [...filteredJobs].sort((a, b) => {
        if (dateFilter === "newest") {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        } else if (dateFilter === "oldest") {
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        return 0;
    });

    const totalPages = Math.ceil(sortedJobs.length / ITEMS_PER_PAGE);
    const paginatedJobs = sortedJobs.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const activeCount = data?.jobs?.filter(job => job.valid_vacancy).length || 0;
    const inactiveCount = data?.jobs?.filter(job => !job.valid_vacancy).length || 0;
    const expiringCount = data?.jobs?.filter(job => isJobExpiringSoon(job.closing_date)).length || 0;
    const expiredCount = data?.jobs?.filter(job => isJobExpired(job.closing_date)).length || 0;

    if (jobsLoading) {
        return (
            <Center h="200px">
                <Spinner size="xl" />
            </Center>
        );
    }

    if (!data?.jobs || data.jobs.length === 0) {
        return (
            <Stack>
                <Alert status="info">
                    <AlertIcon />
                    Nenhuma vaga encontrada.
                </Alert>
            </Stack>
        );
    }

    return (
        <>
            <Helmet>
                <title>Gerenciamento de Vagas</title>
                <link rel="icon" href="/Img/logos/GoodworkSSlogan.png" type="image/png" />
            </Helmet>

            <Box width="100%">
                <Box 
                    p="4" 
                    mb="6" 
                    bg="white" 
                    borderRadius="md" 
                    boxShadow="md"
                    width="100%"
                >
                    <Flex justify="space-between" align="center" mb="4">
                        <Heading size="md"> </Heading>
                        <Button 
                            size="sm" 
                            variant="outline" 
                            leftIcon={<FiX />} 
                            onClick={clearFilters}
                            isDisabled={!hasActiveFilters}
                        >
                            Limpar Filtros
                        </Button>
                    </Flex>

                    <Text fontWeight="bold" fontSize="sm" mb="2">
                        Total: {data.jobs.length} | 
                        Ativas: {activeCount} | 
                        Inativas: {inactiveCount} |
                        Expirando: {expiringCount} |
                        Expiradas: {expiredCount}
                    </Text>
                    
                    <HStack spacing="4" flexWrap="wrap" mb={search ? 3 : 0}>
                        <Select 
                            maxW="200px" 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                        >
                            <option value="all">Todas as vagas</option>
                            <option value="active">Vagas ativas</option>
                            <option value="inactive">Vagas inativas</option>
                        </Select>
                        
                        <Select 
                            maxW="200px" 
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value as any)}
                        >
                            <option value="all">Data de criação</option>
                            <option value="newest">Mais recentes</option>
                            <option value="oldest">Mais antigas</option>
                        </Select>

                        <Select 
                            maxW="200px" 
                            value={closingDateFilter}
                            onChange={(e) => setClosingDateFilter(e.target.value as any)}
                        >
                            <option value="all">Todas as datas</option>
                            <option value="expiring">Expirando em breve</option>
                            <option value="expired">Expiradas</option>
                        </Select>
                    </HStack>
                </Box>

                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} width="100%">
                    {paginatedJobs.map(job => (
                        <Card
                            boxShadow="dark-lg"
                            key={job.id}
                            minH="420px"
                            position="relative"
                            width="100%"
                        >
                            <Badge 
                                position="absolute" 
                                top="2" 
                                right="2" 
                                colorScheme={job.valid_vacancy ? "green" : "red"}
                            >
                                {job.valid_vacancy ? "Ativa" : "Inativa"}
                            </Badge>

                            <CardHeader top="10" p="3">
                                <Flex>
                                    <Flex flex="1" gap="3" alignItems="center">
                                        <Avatar 
                                            name="avatar" 
                                            src={job.user_avatar ? `${process.env.NEXT_PUBLIC_API_URL}/avatars/${job.user_avatar}` : "../../../Img/icons/avatarLogin.png"} 
                                            _hover={{
                                                transform: 'scale(1.1)',
                                                transition: 'transform 0.2s ease-in-out',
                                                boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => router.push(`/profile?user=${job.user_id}`)}
                                            size="md"
                                        />
                                        <Box>
                                            <Heading size="sm">
                                                <Text fontSize="14" noOfLines={1}>
                                                    {job.vacancy}
                                                </Text>
                                            </Heading>
                                            <Text fontSize="12" color="gray.500">
                                                {(job.contractor == null || job.contractor == "") ? job.user_name : job.contractor}
                                            </Text>
                                        </Box>
                                    </Flex>
                                </Flex>
                            </CardHeader>

                            <CardBody p="3">
                                <VStack spacing="3" alignItems="center" height="100%">
                                    <Text textAlign="justify" fontSize="12" noOfLines={4}>
                                        {job.description_vacancy.toString()}
                                    </Text>
                                    <Image
                                        maxW="80%"
                                        maxH="120px"
                                        objectFit="cover"
                                        src={job.banner ? `${process.env.NEXT_PUBLIC_API_URL}/banners/${job.banner}` : "../Img/icons/bannerVaga.png"}
                                        alt="Banner da vaga"
                                        borderRadius="md"
                                    />
                                </VStack>
                            </CardBody>

                            <CardFooter p="3" pt="0">
                                <VStack spacing="2" w="100%">
                                    <HStack spacing="2" w="100%" justify="space-between">
                                        <Text fontSize="10" color="gray.500">
                                            Criada: {formatDate(job.created_at)}
                                        </Text>
                                        <Text 
                                            fontSize="10" 
                                            color={isJobExpired(job.closing_date) ? "red.500" : "gray.500"}
                                            fontWeight={isJobExpiringSoon(job.closing_date) ? "bold" : "normal"}
                                        >
                                            Encerra: {formatDate(job.closing_date)}
                                        </Text>
                                    </HStack>
                                    
                                    <HStack spacing="2" w="100%" justify="center">
                                        <Button
                                            variant="ghost"
                                            leftIcon={job.valid_vacancy ? <GoXCircleFill color="red" /> : <GoCheckCircleFill color="green" />}
                                            size="xs"
                                            onClick={() => handleValidate(job.id, !job.valid_vacancy)}
                                            isLoading={isLoading}
                                            colorScheme={job.valid_vacancy ? "red" : "green"}
                                            flex="1"
                                            minW="120px"
                                        >
                                            {job.valid_vacancy ? "Desativar" : "Ativar"}
                                        </Button>
                                        
                                        <Button
                                            variant="ghost"
                                            leftIcon={<GrFormView color="blue" />}
                                            onClick={() => {
                                                setSelectedJob(job);
                                                onOpen();
                                            }}
                                            size="xs"
                                            colorScheme="blue"
                                            flex="1"
                                            minW="120px"
                                        >
                                            Visualizar
                                        </Button>
                                    </HStack>
                                </VStack>
                            </CardFooter>
                        </Card>
                    ))}
                </SimpleGrid>

                {filteredJobs.length === 0 && (
                    <Box mt="6" textAlign="center">
                        <Alert status="info">
                            <AlertIcon />
                            Nenhuma vaga encontrada com os filtros aplicados.
                        </Alert>
                    </Box>
                )}

                {totalPages > 1 && filteredJobs.length > 0 && (
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

            {selectedJob && (
                <Modal
                    isCentered
                    onClose={() => {
                        setSelectedJob(null);
                        onClose();
                    }}
                    isOpen={isOpen}
                    motionPreset="slideInBottom"
                    size="xl"
                >
                    <ModalOverlay />
                    <ModalContent maxW="700px" borderRadius="lg" boxShadow="2xl">
                        <ModalHeader alignItems="center">
                            <Flex flex="1" gap="4" alignItems="center">
                                <Avatar 
                                    name="avatar" 
                                    src={selectedJob.user_avatar ? `${process.env.NEXT_PUBLIC_API_URL}/avatars/${selectedJob.user_avatar}` : "../../../Img/icons/avatarLogin.png"} 
                                    size="md"
                                />
                                <Box>
                                    <Text fontWeight="bold" fontSize="xl">{selectedJob.vacancy}</Text>
                                    <Text fontSize="sm" color="gray.500">
                                        {(selectedJob.contractor == null || selectedJob.contractor === "") ? selectedJob.user_name : selectedJob.contractor}
                                    </Text>
                                    <Badge 
                                        colorScheme={selectedJob.valid_vacancy ? "green" : "red"}
                                        mt="1"
                                    >
                                        {selectedJob.valid_vacancy ? "Vaga Ativa" : "Vaga Inativa"}
                                    </Badge>
                                </Box>
                            </Flex>
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody overflowY="auto" maxH="500px" bg="gray.50" p="6" borderRadius="md">
                            <VStack align="start" spacing="6">
                                <Box p="4" border="1px" borderColor="blue.100" borderRadius="md" w="100%">
                                    <Image
                                        src={selectedJob.banner ? `${process.env.NEXT_PUBLIC_API_URL}/banners/${selectedJob.banner}` : "../Img/icons/bannerVaga.png"}
                                        borderRadius="md"
                                        boxShadow="md"
                                        mb="4"
                                        w="100%"
                                        maxH="200px"
                                        objectFit="cover"
                                        alt="Banner da vaga"
                                    />
                                    <Box pl="4">{selectedJob.description_vacancy}</Box>
                                </Box>
                                
                                <Box p="4" border="1px" borderColor="blue.100" borderRadius="md" w="100%">
                                    <Flex justifyContent="space-between" gap="4" flexWrap="wrap">
                                        <Box flex="1" minW="150px">
                                            <Text fontWeight="bold" fontSize="lg" mb="2">Data de Criação:</Text>
                                            <Box pl="4">{formatDate(selectedJob.created_at)}</Box>
                                        </Box>
                                        <Box flex="1" minW="150px">
                                            <Text fontWeight="bold" fontSize="lg" mb="2">Data de Encerramento:</Text>
                                            <Box 
                                                pl="4" 
                                                color={isJobExpired(selectedJob.closing_date) ? "red.500" : "inherit"}
                                                fontWeight={isJobExpiringSoon(selectedJob.closing_date) ? "bold" : "normal"}
                                            >
                                                {formatDate(selectedJob.closing_date)}
                                                {isJobExpired(selectedJob.closing_date) && (
                                                    <Badge ml="2" colorScheme="red">Expirada</Badge>
                                                )}
                                                {isJobExpiringSoon(selectedJob.closing_date) && !isJobExpired(selectedJob.closing_date) && (
                                                    <Badge ml="2" colorScheme="orange">Expirando</Badge>
                                                )}
                                            </Box>
                                        </Box>
                                    </Flex>
                                </Box>
                                
                                <Box p="4" border="1px" borderColor="blue.100" borderRadius="md" w="100%">
                                    <Text fontWeight="bold" fontSize="lg" mb="2">Requisitos:</Text>
                                    <Box pl="4">
                                        {selectedJob.requirements.split(",").map((req, idx) => (
                                            <Text key={idx}>• {req.trim()}</Text>
                                        ))}
                                    </Box>
                                </Box>
                                
                                <Box p="4" border="1px" borderColor="blue.100" borderRadius="md" w="100%">
                                    <Flex justifyContent="space-between" gap="4" flexWrap="wrap">
                                        <Box flex="1" minW="150px">
                                            <Text fontWeight="bold" fontSize="lg" mb="2">Carga Horária:</Text>
                                            <Box pl="4">{selectedJob.workload}</Box>
                                        </Box>
                                        <Box flex="1" minW="150px">
                                            <Text fontWeight="bold" fontSize="lg" mb="2">Localização:</Text>
                                            <Box pl="4">{selectedJob.location}</Box>
                                        </Box>
                                    </Flex>
                                </Box>
                                
                                <Box p="4" border="1px" borderColor="blue.100" borderRadius="md" w="100%">
                                    <Flex justifyContent="space-between" gap="4" flexWrap="wrap">
                                        <Box flex="1" minW="150px">
                                            <Text fontWeight="bold" fontSize="lg" mb="2">Benefícios:</Text>
                                            <Box pl="4">
                                                {selectedJob.benefits.split(",").map((benefit, idx) => (
                                                    <Text key={idx}>• {benefit.trim()}</Text>
                                                ))}
                                            </Box>
                                        </Box>
                                        <Box flex="1" minW="150px">
                                            <Text fontWeight="bold" fontSize="lg" mb="2">Quantidade de Vagas:</Text>
                                            <Box pl="4">{selectedJob.amount_vacancy}</Box>
                                        </Box>
                                    </Flex>
                                </Box>
                            </VStack>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                colorScheme={selectedJob.valid_vacancy ? "red" : "green"}
                                mr={3}
                                leftIcon={selectedJob.valid_vacancy ? <GoXCircleFill /> : <GoCheckCircleFill />}
                                onClick={() => handleValidate(selectedJob.id, !selectedJob.valid_vacancy)}
                                isLoading={isLoading}
                            >
                                {selectedJob.valid_vacancy ? "Desativar Vaga" : "Ativar Vaga"}
                            </Button>
                            <Button
                                colorScheme="blue"
                                onClick={() => {
                                    setSelectedJob(null);
                                    onClose();
                                }}
                            >
                                Voltar
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </>
    );
}