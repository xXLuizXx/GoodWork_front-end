import { Avatar, Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, Heading, IconButton, Image, Text, VStack, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Alert, AlertIcon, Spinner, Grid, useBreakpointValue, HStack } from "@chakra-ui/react";
import {BsThreeDotsVertical} from "react-icons/bs";
import {GrFormView, GrUserAdd} from "react-icons/gr";
import { useJobsVacancy } from "@/services/hooks/Jobs/useJobsVacancy";
import React, { useEffect, useState } from 'react';

interface IJobsVacancyProps{
    vacancy: string;
}

export function JobsVacancy({vacancy}: IJobsVacancyProps) {
    const { data } = useJobsVacancy(vacancy);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [selectedJob, setSelectedJob] = useState(null);
    const [isChecking, setIsChecking] = useState(true);
    const [hasValidJobs, setHasValidJobs] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    useEffect(() => {
        if (data?.jobs) {
            const validJobsExist = data.jobs.some((job) => job.valid_vacancy);
            setHasValidJobs(validJobsExist);
            setIsChecking(false);
        } else if (data) {
            setHasValidJobs(false);
            setIsChecking(false);
        }
    }, [data]);

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

    const paginatedJobs = getPaginatedJobs();

    if (!data || isChecking) {
        return (
            <Flex justify="center" align="center" h="100vh">
                <Spinner size="xl" color="blue.500" />
            </Flex>
        );
    }

    if (!hasValidJobs) {
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
            <Grid 
                templateColumns={gridTemplateColumns}
                gap={6}
                width="100%"
            >
                {paginatedJobs.map(job => (
                    job.valid_vacancy && (
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
                    )
                ))}
            </Grid>

            {/* Paginação */}
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
                
            {/* Modal (mantido fora do grid) */}
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
        </>
    );
}