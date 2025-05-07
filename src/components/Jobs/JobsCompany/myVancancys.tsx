import { 
    Avatar, Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, 
    Heading, Image, SimpleGrid, Text, VStack, useDisclosure, Modal, 
    ModalBody, ModalContent, ModalFooter, ModalHeader, 
    ModalOverlay, Stack, Alert, AlertIcon, useToast, HStack, Icon, 
    Menu, MenuButton, MenuList, MenuItem, Badge, 
    ModalCloseButton
} from "@chakra-ui/react";
import { GrFormView, GrAdd } from "react-icons/gr";
import { GoXCircleFill, GoCheckCircleFill, GoFilter } from "react-icons/go";
import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { TiInputChecked } from "react-icons/ti";
import { useAllJobsCompany } from "@/services/hooks/Jobs/useAllJobsCompany";
import { useRouter } from "next/router";
import { useUpdateStatusJob } from "@/services/hooks/Jobs/useUpdateStatusJob";

interface IJobsCompanyProps {
    id: string;
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
    closing_date?: string;
}

export function MyVacancy({id}: IJobsCompanyProps) {
    const router = useRouter();
    const { data } = useAllJobsCompany(id);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const { updateStatusJob, isLoading } = useUpdateStatusJob();
    const toast = useToast();
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const handleValidate = async (jobId: string, validated: boolean) => {
        const success = await updateStatusJob(jobId, validated);
        if (success) {
            if (selectedJob?.id === jobId) {
                onClose();
            }
        }
    };

    const filteredJobs = data?.jobs?.filter(job => {
        if (filter === "open" && !job.vacancy_available) return false;
        if (filter === "closed" && job.vacancy_available) return false;
        if (filter === "month" && job.closing_date) {
            const closingDate = new Date(job.closing_date);
            const now = new Date();
            return closingDate.getMonth() === now.getMonth() && 
                   closingDate.getFullYear() === now.getFullYear();
        }
        if (searchTerm && !job.vacancy.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
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
                                    {data.jobs.filter(j => j.vacancy_available).length}
                                </Badge>
                            </MenuItem>
                            <MenuItem onClick={() => setFilter("closed")}>
                                Vagas Fechadas
                                <Badge ml="2" colorScheme="red">
                                    {data.jobs.filter(j => !j.vacancy_available).length}
                                </Badge>
                            </MenuItem>
                            <MenuItem onClick={() => setFilter("month")}>
                                Vagas que fecham este mês
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
                {filteredJobs?.map(job => (
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
                                    </Box>
                                </Flex>
                                <Badge 
                                    colorScheme={job.vacancy_available ? "green" : "red"}
                                    alignSelf="flex-start"
                                    ml="2"
                                >
                                    {job.vacancy_available ? "Aberta" : "Fechada"}
                                </Badge>
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
                                    onClick={() => router.push(`jobs-company-genereted/edit?id=${job.id}`)}
                                >
                                    Editar
                                </Button>
                                <Button
                                    variant="ghost"
                                    leftIcon={<GoXCircleFill color={job.vacancy_available ? "red" : "green"} />}
                                    size="xs"
                                    onClick={() => handleValidate(job.id, !job.vacancy_available)}
                                    isLoading={isLoading}
                                >
                                    {job.vacancy_available ? "Fechar" : "Reabrir"}
                                </Button>
                                <Button
                                    variant="ghost"
                                    leftIcon={<TiInputChecked color="green" />}
                                    size="xs"
                                    onClick={() => router.push(`/jobs/${job.id}/applications`)}
                                >
                                    Candidaturas
                                </Button>
                            </SimpleGrid>
                        </CardFooter>
                    </Card>
                ))}
            </SimpleGrid>

            {/* Modal mantendo o estilo original */}
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
                                <Badge 
                                    ml="auto"
                                    colorScheme={selectedJob.vacancy_available ? "green" : "red"}
                                >
                                    {selectedJob.vacancy_available ? "Aberta" : "Fechada"}
                                </Badge>
                            </Flex>
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody overflowY="auto" maxH="500px" bg="gray.50" p="6" borderRadius="md">
                            <VStack align="start" spacing="6">
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
                                colorScheme={selectedJob.vacancy_available ? "red" : "green"}
                                leftIcon={<Icon as={selectedJob.vacancy_available ? GoXCircleFill : GoCheckCircleFill} />}
                                onClick={() => handleValidate(selectedJob.id, !selectedJob.vacancy_available)}
                                isLoading={isLoading}
                                mr={3}
                            >
                                {selectedJob.vacancy_available ? "Fechar Vaga" : "Reabrir Vaga"}
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