import { 
    Avatar, Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, 
    Heading, Image, SimpleGrid, Text, VStack, useDisclosure, Modal, 
    ModalBody, ModalContent, ModalFooter, ModalHeader, 
    ModalOverlay, Stack, Alert, AlertIcon, useToast, HStack, Icon, 
    Menu, MenuButton, MenuList, MenuItem, Badge, 
    ModalCloseButton,
    Tooltip
} from "@chakra-ui/react";
import { GrFormView, GrAdd } from "react-icons/gr";
import { GoXCircleFill, GoCheckCircleFill, GoFilter } from "react-icons/go";
import { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { TiInputChecked } from "react-icons/ti";
import { useAllJobsCompany } from "@/services/hooks/Jobs/useAllJobsCompany";
import { useRouter } from "next/router";
import { useUpdateStatusJob } from "@/services/hooks/Jobs/useUpdateStatusJob";
import { useJobsVacancy } from "@/services/hooks/Jobs/useJobsVacancy";

interface IJobsCompanyProps {
    vacancy: string;
}

interface Job {
    id: string;
    vacancy: string;
    contractor: string;
    description_vacancy: string;
    requirements: string;
    workload: string;
    location: string;
    benefits: string;
    banner: string | null;
    vacancy_available: boolean;
    user_name: string;
    amount_vacancy: number;
    closing_date: Date;
}

export function MyJobsVacancy({vacancy}: IJobsCompanyProps) {
    const router = useRouter();
    const { data, refetch } = useJobsVacancy(vacancy);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const { updateStatusJob, isLoading } = useUpdateStatusJob();
    const toast = useToast();
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const checkAndUpdateJobStatus = async (jobs: Job[]) => {
        const agoraBR = new Date().toLocaleString('pt-BR', {
            timeZone: 'America/Sao_Paulo',
            hour12: false
        });
        
        const [dataParte, horaParte] = agoraBR.split(', ');
        const [dia, mes, ano] = dataParte.split('/').map(Number);
        const [hora, minuto, segundo] = horaParte.split(':').map(Number);
    
        const todayUTC = new Date(Date.UTC(
            ano,
            mes - 1,
            dia,
            hora,
            minuto,
            segundo
        ));
        
    
        let needsRefetch = false;
    
        for (const job of jobs) {
            try {
                if (!job.closing_date) continue;
                
                const closingDate = new Date(job.closing_date);
                
                if (closingDate <= todayUTC && job.vacancy_available) {
                    await updateStatusJob(job.id, false);
                    needsRefetch = true;
                }
            } catch (error) {
                console.error(`Erro ao verificar vaga ${job.id}:`, error);
            }
        }
    
        if (needsRefetch) {
            refetch();
        }
    };

    useEffect(() => {
        if (data?.jobs) {
            checkAndUpdateJobStatus(data.jobs);
        }
    }, [data?.jobs]);

    const handleValidate = async (jobId: string, validated: boolean) => {
        const success = await updateStatusJob(jobId, validated);
        if (success) {
            if (selectedJob?.id === jobId) {
                onClose();
            }
            refetch();
        }
    };

    const filteredJobs = data?.jobs?.filter(job => {
        const today = new Date();
        
        const isClosedByDate = job.closing_date && new Date(job.closing_date) <= today;
        const isClosed = !job.vacancy_available || isClosedByDate;

        if (filter === "open" && isClosed) return false;
        if (filter === "closed" && !isClosed) return false;
        
        if (filter === "month") {
            if (!job.closing_date) return false;
            
            try {
                const closingDate = new Date(job.closing_date);
                const now = new Date();
                
                return (
                    closingDate.getMonth() === now.getMonth() && 
                    closingDate.getFullYear() === now.getFullYear()
                );
            } catch {
                return false;
            }
        }
        
        return true;
    });

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
        <Box p="4">
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
                            <MenuItem onClick={() => setFilter("all")}>Todas as Vagas</MenuItem>
                            <MenuItem onClick={() => setFilter("open")}>
                                Vagas Abertas
                                <Badge ml="2" colorScheme="green">
                                    {data.jobs.filter(j => j.vacancy_available && 
                                        (!j.closing_date || new Date(j.closing_date) > new Date())).length}
                                </Badge>
                            </MenuItem>
                            <MenuItem onClick={() => setFilter("closed")}>
                                Vagas Fechadas
                                <Badge ml="2" colorScheme="red">
                                    {data.jobs.filter(j => !j.vacancy_available || 
                                        (j.closing_date && new Date(j.closing_date) <= new Date())).length}
                                </Badge>
                            </MenuItem>
                            <MenuItem onClick={() => setFilter("month")}>
                                Vagas que fecham este mês
                                <Badge ml="2" colorScheme="orange">
                                    {data.jobs.filter(job => {
                                        if (!job.closing_date) return false;
                                        try {
                                            const closingDate = new Date(job.closing_date);
                                            const now = new Date();
                                            return (
                                                closingDate.getMonth() === now.getMonth() &&
                                                closingDate.getFullYear() === now.getFullYear()
                                            );
                                        } catch {
                                            return false;
                                        }
                                    }).length}
                                </Badge>
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </HStack>

                <Button 
                    leftIcon={<Icon as={GrAdd} />} 
                    colorScheme="blue"
                    size="sm"
                    onClick={() => router.push("/jobs/create")}
                >
                    Nova Vaga
                </Button>
            </Flex>

            <SimpleGrid columns={{ base: 1, lg: Math.min(4, filteredJobs?.length || 1) }} spacing="6">
                {filteredJobs?.map(job => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const isClosedByDate = job.closing_date && new Date(job.closing_date) <= today;
                    const isClosed = !job.vacancy_available || isClosedByDate;
                    const closingDateFormatted = job.closing_date ? 
                        new Date(job.closing_date).toLocaleDateString('pt-BR') : 
                        'Sem data definida';

                    return (
                        <Card
                            key={job.id}
                            boxShadow="dark-lg"
                            maxW="md"
                            h="96"
                            _hover={{ 
                                transform: "translateY(-4px)",
                                transition: "all 0.2s ease"
                            }}
                        >
                            <CardHeader p="2.5">
                                <Flex>
                                    <Flex flex="1" gap="4" alignItems="center">
                                        <Avatar name="avatar" src="../Img/icons/empresaTeste.jpg" />
                                        <Box>
                                            <Heading size="sm">
                                                <Text fontSize="14">
                                                    {job.vacancy}
                                                </Text>
                                            </Heading>
                                            <Text fontSize="12">
                                                {(job.contractor == null || job.contractor == "") ? job.user_name : job.contractor}
                                            </Text>
                                            <Text fontSize="10" color="gray.500" mt="1">
                                                Encerra em: {closingDateFormatted}
                                            </Text>
                                        </Box>
                                    </Flex>
                                    <Tooltip label={`Data de encerramento: ${closingDateFormatted}`}>
                                        <Badge 
                                            colorScheme={isClosed ? "red" : "green"}
                                            alignSelf="flex-start"
                                            ml="2"
                                        >
                                            {isClosed ? "Fechada" : "Aberta"}
                                        </Badge>
                                    </Tooltip>
                                </Flex>
                            </CardHeader>

                            <CardBody whiteSpace="1" h="10">
                                <VStack spacing="2" alignItems="center" height="100%">
                                    <Text textAlign="justify" fontSize="12" maxW="100%" noOfLines={3}>
                                        {job.description_vacancy.toString()}
                                    </Text>
                                    <Image
                                        maxW="40%"
                                        src={job.banner == null ? "../Img/icons/bannerVaga.png" : "../Img/icons/bannerVaga.png"} 
                                        alt="Banner da vaga"
                                    />
                                </VStack>
                            </CardBody>

                            <CardFooter alignItems="center" p="2.5" pt="1">
                                <SimpleGrid gap="2" w="100%" flex="1" minChildWidth="90px">
                                    <Button
                                        variant="ghost"
                                        leftIcon={<GrFormView color="blue" />}
                                        onClick={() => {
                                            setSelectedJob(job);
                                            onOpen();
                                        }}
                                        size="xs"
                                    >
                                        Visualizar
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        leftIcon={<FaRegEdit color="orange" />}
                                        size="xs"
                                        onClick={() => router.push(`../jobs-company-genereted/edit?id=${job.id}`)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        leftIcon={<GoXCircleFill color={isClosed ? "green" : "red"} />}
                                        size="xs"
                                        onClick={() => handleValidate(job.id, isClosed)}
                                        isLoading={isLoading}
                                        isDisabled={isClosedByDate}
                                    >
                                        {isClosed ? "Reabrir" : "Fechar"}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        leftIcon={<TiInputChecked color="green" />}
                                        size="xs"
                                        onClick={() => router.push(`/applications?id=${job.id}`)}
                                    >
                                        Candidaturas
                                    </Button>
                                </SimpleGrid>
                            </CardFooter>
                        </Card>
                    );
                })}
            </SimpleGrid>

            {selectedJob && (
                <Modal
                    isCentered
                    onClose={() => {
                        setSelectedJob(null);
                        onClose();
                    }}
                    isOpen={isOpen}
                    motionPreset="slideInBottom"
                >
                    <ModalOverlay />
                    <ModalContent maxW="700px" borderRadius="lg" boxShadow="2xl">
                        <ModalHeader alignItems="center">
                            <Flex flex="1" gap="4" alignItems="center">
                                <Avatar name="avatar" src="../Img/icons/empresaTeste.jpg" />
                                <Box>
                                    <Text fontWeight="bold" fontSize="xl">{selectedJob.vacancy}</Text>
                                    <Text fontSize="sm" color="gray.500">
                                        {(selectedJob.contractor == null || selectedJob.contractor === "") ? selectedJob.user_name : selectedJob.contractor}
                                    </Text>
                                </Box>
                                <Tooltip label={`Data de encerramento: ${
                                    selectedJob.closing_date ? 
                                    new Date(selectedJob.closing_date).toLocaleDateString('pt-BR') : 
                                    'Sem data definida'
                                }`}>
                                    <Badge 
                                        ml="auto"
                                        colorScheme={
                                            (!selectedJob.vacancy_available || 
                                            (selectedJob.closing_date && new Date(selectedJob.closing_date) <= new Date())) 
                                            ? "red" 
                                            : "green"
                                        }
                                    >
                                        {
                                            (!selectedJob.vacancy_available || 
                                            (selectedJob.closing_date && new Date(selectedJob.closing_date) <= new Date())) 
                                            ? "Fechada" 
                                            : "Aberta"
                                        }
                                    </Badge>
                                </Tooltip>
                            </Flex>
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody overflowY="auto" maxH="500px" bg="gray.50" p="6" borderRadius="md">
                            <VStack align="start" spacing="6">
                                <Box p="4" border="1px" borderColor="blue.100" borderRadius="md" w="100%">
                                    <Flex justifyContent="space-between" gap="4">
                                        <Box flex="1">
                                            <Text fontWeight="bold" fontSize="lg" mb="2">Data de Encerramento:</Text>
                                            <Box pl="4">
                                                {selectedJob.closing_date ? 
                                                    new Date(selectedJob.closing_date).toLocaleDateString('pt-BR', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    }) : 
                                                    'Não definida'}
                                            </Box>
                                        </Box>
                                        <Box flex="1">
                                            <Text fontWeight="bold" fontSize="lg" mb="2">Status:</Text>
                                            <Box pl="4">
                                                <Badge 
                                                    colorScheme={
                                                        (!selectedJob.vacancy_available || 
                                                        (selectedJob.closing_date && new Date(selectedJob.closing_date) <= new Date())) 
                                                        ? "red" 
                                                        : "green"
                                                    }
                                                >
                                                    {
                                                        (!selectedJob.vacancy_available || 
                                                        (selectedJob.closing_date && new Date(selectedJob.closing_date) <= new Date())) 
                                                        ? "Fechada" 
                                                        : "Aberta"
                                                    }
                                                </Badge>
                                            </Box>
                                        </Box>
                                    </Flex>
                                </Box>
                                <Box p="4" border="1px" borderColor="blue.100" borderRadius="md" w="100%">
                                    <Image
                                        src={selectedJob.banner == null ? "../Img/icons/bannerVaga.png" : "../Img/icons/bannerVaga.png"}
                                        borderRadius="md"
                                        boxShadow="md"
                                        mb="4"
                                        w="100%"
                                        alt="Banner da vaga"
                                    />
                                    <Box pl="4">{selectedJob.description_vacancy}</Box>
                                </Box>
                                <Box p="4" border="1px" borderColor="blue.100" borderRadius="md" w="100%">
                                    <Text fontWeight="bold" fontSize="lg" mb="2">Requisitos:</Text>
                                    <Box pl="4">
                                        {selectedJob.requirements.split(",").map((req, idx) => (
                                            <Text key={idx}>{req.trim()}</Text>
                                        ))}
                                    </Box>
                                </Box>
                                <Box p="4" border="1px" borderColor="blue.100" borderRadius="md" w="100%">
                                    <Flex justifyContent="space-between" gap="4">
                                        <Box flex="1">
                                            <Text fontWeight="bold" fontSize="lg" mb="2">Carga Horária:</Text>
                                            <Box pl="4">{selectedJob.workload}</Box>
                                        </Box>
                                        <Box flex="1">
                                            <Text fontWeight="bold" fontSize="lg" mb="2">Localização:</Text>
                                            <Box pl="4">{selectedJob.location}</Box>
                                        </Box>
                                    </Flex>
                                </Box>
                                <Box p="4" border="1px" borderColor="blue.100" borderRadius="md" w="100%">
                                    <Flex justifyContent="space-between" gap="4">
                                        <Box flex="1">
                                            <Text fontWeight="bold" fontSize="lg" mb="2">Benefícios:</Text>
                                            <Box pl="4">
                                                {selectedJob.benefits.split(",").map((benefit, idx) => (
                                                    <Text key={idx}>{benefit.trim()}</Text>
                                                ))}
                                            </Box>
                                        </Box>
                                        <Box flex="1">
                                            <Text fontWeight="bold" fontSize="lg" mb="2">Quantidade de Vagas:</Text>
                                            <Box pl="4">{selectedJob.amount_vacancy}</Box>
                                        </Box>
                                    </Flex>
                                </Box>
                            </VStack>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                colorScheme={
                                    (!selectedJob.vacancy_available || 
                                    (selectedJob.closing_date && new Date(selectedJob.closing_date) <= new Date())) 
                                    ? "green" 
                                    : "red"
                                }
                                leftIcon={<Icon as={
                                    (!selectedJob.vacancy_available || 
                                    (selectedJob.closing_date && new Date(selectedJob.closing_date) <= new Date())) 
                                    ? GoCheckCircleFill 
                                    : GoXCircleFill
                                } />}
                                onClick={() => handleValidate(
                                    selectedJob.id, 
                                    !(!selectedJob.vacancy_available || 
                                      (selectedJob.closing_date && new Date(selectedJob.closing_date) <= new Date()))
                                )}
                                isLoading={isLoading}
                                mr={3}
                                isDisabled={selectedJob.closing_date && new Date(selectedJob.closing_date) <= new Date()}
                            >
                                {
                                    (!selectedJob.vacancy_available || 
                                    (selectedJob.closing_date && new Date(selectedJob.closing_date) <= new Date())) 
                                    ? "Reabrir Vaga" 
                                    : "Fechar Vaga"
                                }
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
        </Box>
    );
}