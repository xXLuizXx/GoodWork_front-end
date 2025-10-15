import { 
  Avatar, Box, Button, Card, CardBody, CardFooter, CardHeader, 
  Flex, Heading, IconButton, Image, Text, VStack, 
  useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, 
  ModalFooter, ModalHeader, ModalOverlay, Stack, Alert, AlertIcon,
  Grid,
  useBreakpointValue,
  HStack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  useToast
} from "@chakra-ui/react";
import {BsThreeDotsVertical} from "react-icons/bs";
import {GrFormView, GrUserAdd} from "react-icons/gr";
import {useAllJobs} from "@/services/hooks/Jobs/useAllJobs";
import { useEffect, useState } from "react";
import decode from "jwt-decode";
import { parseCookies } from "nookies";
import { useForm } from "react-hook-form";
import { api } from "@/services/apiClient";
import { useMutation, useQueryClient } from "react-query";
import Router from "next/router";

interface DecodedToken {
    isAdmin: boolean;
    sub: string;
}

interface JobApplicationForm {
  curriculum_user: FileList;
}

interface IApplicationVancacy{
    user_id: string;
    job_id: string;
    curriculum_user: File;
}

export function Jobs() {
    const [admin, setAdmin] = useState(false); 
    const [userId, setUserId] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;
    const toast = useToast();
    const queryClient = useQueryClient();

    useEffect(() => {
        const cookies = parseCookies();
        const token = cookies["token.token"];

        if (token) {
            try {
                const decoded = decode<DecodedToken>(token);
                setUserId(decoded.sub);
                if (decoded.isAdmin) {
                    setAdmin(decoded.isAdmin);
                }
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
            }
        }
    }, []);

    const {data} = useAllJobs(admin);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { 
        isOpen: isApplyOpen, 
        onOpen: onApplyOpen, 
        onClose: onApplyClose 
    } = useDisclosure();
    
    const [selectedJob, setSelectedJob] = useState(null);
    const [selectedJobForApplication, setSelectedJobForApplication] = useState(null);
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch
    } = useForm<JobApplicationForm>();

    const applicationMutation = useMutation(
        async (formData: FormData) => {
            const response = await api.post("application", formData, {
                headers: { 
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        },
        {
            onSuccess: () => {
                toast({
                    title: "Candidatura enviada!",
                    description: "Sua candidatura foi enviada com sucesso. Agora só aguardar o processo de seleção da empresa.",
                    status: "success",
                    position: "top",
                    duration: 8000,
                    isClosable: true,
                });
                queryClient.invalidateQueries("application");
                Router.push("/");
            },
            onError: (error: any) => {
                toast({
                    title: "Erro ao enviar",
                    description: error.response?.data?.message || "Erro ao realizar candidatura",
                    status: "error",
                    position: "top",
                    duration: 8000,
                    isClosable: true,
                });
            }
        }
    );

    const getGridTemplateColumns = () => {
        if (!data?.jobs) return "1fr";
        
        const validJobs = data.jobs.filter(job => job.valid_vacancy);
        const count = validJobs.length;
        
        if (count === 1) return "1fr";
        if (count === 2 || count === 4) return "1fr 1fr";
        return "1fr 1fr 1fr";
    };
    
    const gridTemplateColumns = useBreakpointValue({
        base: "1fr",
        md: getGridTemplateColumns(),
        lg: getGridTemplateColumns()
    });

    const getPaginatedJobs = () => {
        if (!data?.jobs) return [];
        
        const validJobs = data.jobs.filter(job => job.valid_vacancy);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        return validJobs.slice(startIndex, endIndex);
    };

    const totalPages = Math.ceil(
        (data?.jobs ? data.jobs.filter(job => job.valid_vacancy).length : 0) / itemsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleApplyClick = (job) => {
        setSelectedJobForApplication(job);
        onApplyOpen();
    };

    const onSubmitApplication = async (data: JobApplicationForm) => {
        try {
            const file = data.curriculum_user[0];
            
            if (file.type !== 'application/pdf') {
                toast({
                    title: "Formato inválido",
                    description: "Por favor, envie um arquivo no formato PDF.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: "Arquivo muito grande",
                    description: "O arquivo deve ter no máximo 5MB.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            if (!userId) {
                toast({
                    title: "Usuário não autenticado",
                    description: "Por favor, faça login para concorrer à vaga.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            const formData = new FormData();
            formData.append("curriculum_user", file);
            formData.append("job_id", selectedJobForApplication.id);
            formData.append("user_id", userId);

            console.log("Enviando candidatura:", {
                jobId: selectedJobForApplication.id,
                userId: userId,
                fileName: file.name,
                fileSize: file.size
            });

            await applicationMutation.mutateAsync(formData);

            onApplyClose();
            reset();
            setSelectedJobForApplication(null);

        } catch (error) {
            console.error("Erro ao enviar aplicação:", error);
        }
    };

    const paginatedJobs = getPaginatedJobs();
    
    if(!data?.jobs || data.jobs.length === 0){
        return (
            <Stack>
                <Alert status="info">
                    <AlertIcon />
                    Nenhuma vaga encontrada.
                </Alert>
            </Stack>
        );
    } else {
        return (
            <>
                <Grid 
                    templateColumns={gridTemplateColumns}
                    gap={6}
                    width="100%"
                >
                    {paginatedJobs.map(job => (
                        <Card
                            boxShadow="dark-lg"
                            key={job.id}
                            display="flex"
                            flexDirection="column"
                            minWidth="300px"
                            height="400px"
                            overflow="hidden"
                        >
                            <CardHeader p="3" pb="2">
                                <Flex>
                                    <Flex flex="1" gap="3" alignItems="center">
                                        <Avatar size="sm" name="avatar" src={job?.user_avatar ? `${process.env.NEXT_PUBLIC_API_URL}/avatars/${job?.user_avatar}` : "./Img/icons/empresaTeste.jpg"}/>
                                        <Box>
                                            <Heading size="sm">
                                                <Text fontSize="13" noOfLines={1}>
                                                    {job.vacancy}
                                                </Text>
                                            </Heading>
                                            <Text fontSize="11" color="gray.600">
                                                {(job.contractor == null || job.contractor == "") ? job.user_name : job.contractor}
                                            </Text>
                                        </Box>
                                    </Flex>
                                    <IconButton
                                        variant="ghost"
                                        colorScheme="gray"
                                        aria-label="See menu"
                                        icon={<BsThreeDotsVertical size="14"/>}
                                        size="xs"
                                    />
                                </Flex>
                            </CardHeader>
                            
                            <CardBody flex="1" overflow="hidden" p="3" pt="0">
                                <VStack spacing="2" height="100%">
                                    <Text 
                                        textAlign="justify" 
                                        fontSize="12" 
                                        noOfLines={3}
                                        flex="1"
                                        overflow="hidden"
                                    >
                                        {job.description_vacancy.toString()}
                                    </Text>
                                    <Image
                                        maxH="120px"
                                        maxW="100%"
                                        objectFit="contain"
                                        src={job.banner ? `${process.env.NEXT_PUBLIC_API_URL}/banners/${job.banner}` : "./Img/icons/bannerVaga.png"}
                                        alt="Banner da vaga"
                                        fallbackSrc="./Img/icons/bannerVaga.png"
                                        onError={(e) => {
                                            e.currentTarget.src = "./Img/icons/bannerVaga.png";
                                        }}
                                    />
                                </VStack>
                            </CardBody>

                            <CardFooter p="3" pt="0">
                                <Grid
                                    templateColumns="1fr 1fr"
                                    gap="2"
                                    width="100%"
                                >
                                    <Button 
                                        variant="ghost" 
                                        colorScheme="green" 
                                        leftIcon={<GrUserAdd size="14"/>} 
                                        size="xs"
                                        height="28px"
                                        _hover={{
                                            bg: "green.50",
                                            transform: "translateY(-1px)",
                                            boxShadow: "sm"
                                        }}
                                        transition="all 0.2s ease"
                                        onClick={() => handleApplyClick(job)}
                                    >
                                        Concorrer
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        colorScheme="blue" 
                                        leftIcon={<GrFormView size="14"/>} 
                                        size="xs"
                                        height="28px"
                                        _hover={{
                                            bg: "blue.50",
                                            transform: "translateY(-1px)",
                                            boxShadow: "sm"
                                        }}
                                        transition="all 0.2s ease"
                                        onClick={() => {
                                            setSelectedJob(job);
                                            onOpen();
                                        }}
                                    >
                                        Visualizar
                                    </Button>
                                </Grid>
                            </CardFooter>
                        </Card>
                    ))}
                </Grid>
                {totalPages > 1 && (
                    <HStack spacing={2} mt={8} justify="center" flexWrap="wrap">
                        <Button
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            isDisabled={currentPage === 1}
                        >
                            Anterior
                        </Button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <Button
                                key={page}
                                size="sm"
                                colorScheme={currentPage === page ? "blue" : "gray"}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </Button>
                        ))}

                        <Button
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            isDisabled={currentPage === totalPages}
                        >
                            Próxima
                        </Button>
                    </HStack>
                )}
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
                                <Avatar name="avatar" src={selectedJob?.user_avatar ? `${process.env.NEXT_PUBLIC_API_URL}/avatars/${selectedJob?.user_avatar}` : "./Img/icons/empresaTeste.jpg"}/>
                                <Box>
                                    <Text fontWeight="bold" fontSize="xl">{selectedJob?.vacancy}</Text>
                                    <Text fontSize="sm" color="gray.500">
                                        {(selectedJob?.contractor == null || selectedJob?.contractor === "") ? selectedJob?.user_name : selectedJob?.contractor}
                                    </Text>
                                </Box>
                            </Flex>
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody 
                            overflowY="auto" 
                            maxH="500px" 
                            bg="gray.50" 
                            p="6" 
                            borderRadius="md"
                        >
                            {selectedJob ? (
                                <VStack align="start" spacing="6">
                                    <Box 
                                        p="4" 
                                        border="1px" 
                                        borderColor="blue.100" 
                                        borderRadius="md" 
                                        w="100%"
                                    >
                                        <Image 
                                            src={selectedJob.banner ? `${process.env.NEXT_PUBLIC_API_URL}/banners/${selectedJob.banner}` : "../Img/icons/bannerVaga.png"}
                                            borderRadius="md" 
                                            boxShadow="md"
                                            mb="4"
                                            w="100%"
                                        />
                                        <Box pl="4">{selectedJob.description_vacancy}</Box>
                                    </Box>
                                    <Box 
                                        p="4" 
                                        border="1px" 
                                        borderColor="blue.100" 
                                        borderRadius="md" 
                                        w="100%"
                                    >
                                        <Text fontWeight="bold" fontSize="lg" mb="2">Requisitos:</Text>
                                        <Box pl="4">
                                            {selectedJob.requirements.split(",").map((req, idx) => (
                                                <Text key={idx}>{req.trim()}</Text>
                                            ))}
                                        </Box>
                                    </Box>
                                    <Box 
                                        p="4" 
                                        border="1px" 
                                        borderColor="blue.100" 
                                        borderRadius="md" 
                                        w="100%"
                                    >
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
                                    <Box 
                                        p="4" 
                                        border="1px" 
                                        borderColor="blue.100" 
                                        borderRadius="md" 
                                        w="100%"
                                    >
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
                            ) : (
                                <Text>Carregando...</Text>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button 
                                colorScheme="blue" 
                                mr={3} 
                                onClick={() => {
                                    setSelectedJob(null);
                                    onClose();
                                }}
                            >
                                Fechar
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
                <Modal
                    isCentered
                    onClose={() => {
                        setSelectedJobForApplication(null);
                        onApplyClose();
                        reset();
                    }}
                    isOpen={isApplyOpen}
                    motionPreset="slideInBottom"
                    size="lg"
                >
                    <ModalOverlay />
                    <ModalContent borderRadius="lg" boxShadow="2xl">
                        <ModalHeader 
                            bg="green.50" 
                            borderTopRadius="lg"
                            alignItems="center"
                        >
                            <Flex flex="1" gap="4" alignItems="center">
                                <Avatar 
                                    size="sm" 
                                    name="avatar" 
                                    src={selectedJobForApplication?.user_avatar ? `${process.env.NEXT_PUBLIC_API_URL}/avatars/${selectedJobForApplication?.user_avatar}` : "./Img/icons/empresaTeste.jpg"}
                                />
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg">
                                        Concorrer à Vaga
                                    </Text>
                                    <Text fontSize="sm" color="gray.600">
                                        {selectedJobForApplication?.vacancy}
                                    </Text>
                                </Box>
                            </Flex>
                        </ModalHeader>
                        <ModalCloseButton />
                        
                        <form onSubmit={handleSubmit(onSubmitApplication)}>
                            <ModalBody p="6">
                                <VStack spacing="6" align="stretch">
                                    <Alert status="info" borderRadius="md">
                                        <AlertIcon />
                                        <Text fontSize="sm">
                                            Para concorrer a esta vaga, é obrigatório enviar seu currículo em formato PDF.
                                        </Text>
                                    </Alert>

                                    <FormControl isInvalid={!!errors.curriculum_user} isRequired>
                                        <FormLabel fontSize="sm" fontWeight="bold">
                                            Currículo (PDF)
                                        </FormLabel>
                                        <Input
                                            type="file"
                                            accept=".pdf"
                                            {...register("curriculum_user", {
                                                required: "O currículo é obrigatório",
                                                validate: {
                                                    isPDF: (files) => {
                                                        if (files && files[0]) {
                                                            return files[0].type === 'application/pdf' || 
                                                                   files[0].name.toLowerCase().endsWith('.pdf') ||
                                                                   "Apenas arquivos PDF são aceitos";
                                                        }
                                                        return true;
                                                    },
                                                    fileSize: (files) => {
                                                        if (files && files[0]) {
                                                            return files[0].size <= 5 * 1024 * 1024 || 
                                                                   "O arquivo deve ter no máximo 5MB";
                                                        }
                                                        return true;
                                                    }
                                                }
                                            })}
                                            p="1"
                                        />
                                        <FormErrorMessage>
                                            {errors.curriculum_user?.message}
                                        </FormErrorMessage>
                                        <Text fontSize="xs" color="gray.600" mt="2">
                                            Tamanho máximo: 5MB • Formato aceito: PDF
                                        </Text>
                                    </FormControl>

                                    {watch("curriculum_user")?.[0] && (
                                        <Alert status="success" borderRadius="md" size="sm">
                                            <AlertIcon />
                                            <Box>
                                                <Text fontSize="sm" fontWeight="medium">
                                                    Arquivo selecionado:
                                                </Text>
                                                <Text fontSize="xs">
                                                    {watch("curriculum_user")[0].name} 
                                                    ({(watch("curriculum_user")[0].size / 1024 / 1024).toFixed(2)} MB)
                                                </Text>
                                            </Box>
                                        </Alert>
                                    )}
                                </VStack>
                            </ModalBody>

                            <ModalFooter>
                                <Button 
                                    variant="outline" 
                                    mr={3} 
                                    onClick={() => {
                                        setSelectedJobForApplication(null);
                                        onApplyClose();
                                        reset();
                                    }}
                                    isDisabled={isSubmitting}
                                >
                                    Cancelar
                                </Button>
                                <Button 
                                    colorScheme="green" 
                                    type="submit"
                                    isLoading={isSubmitting || applicationMutation.isLoading}
                                    loadingText="Enviando..."
                                    isDisabled={!watch("curriculum_user")?.[0]}
                                >
                                    Enviar Candidatura
                                </Button>
                            </ModalFooter>
                        </form>
                    </ModalContent>
                </Modal>
            </>
        );
    }
}