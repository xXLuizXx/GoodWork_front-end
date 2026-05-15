import { Avatar, Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, Heading, Icon, Image, SimpleGrid, Text, VStack, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Alert, AlertIcon, useToast, useColorModeValue } from "@chakra-ui/react";
import { GrFormView } from "react-icons/gr";
import { GoXCircleFill, GoCheckCircleFill } from "react-icons/go";
import { FiBriefcase } from "react-icons/fi";
import { useJobsNotValidated } from "@/services/hooks/Jobs/useJobsNotValidated";
import type { IJobs } from "@/services/hooks/Jobs/useJobsNotValidated";
import { useState } from "react";
import { FiBriefcase } from "react-icons/fi";
import { useValidateJob } from "@/services/hooks/Jobs/useValidateJob";
import { queryClient } from "@/services/queryClient";
import { useRouter } from "next/router";

export function JobsNotValidated() {
    const router = useRouter();
    const { data, refetch } = useJobsNotValidated();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedJob, setSelectedJob] = useState<IJobs | null>(null);
    const modalBodyBg = useColorModeValue('gray.50', 'gray.700');
    const { validateJob, isLoading } = useValidateJob();
    const toast = useToast();

    const handleValidate = async (jobId: string, validated: boolean) => {
        const aprovateVacancy = true;
        const success = await validateJob(jobId, validated, aprovateVacancy);
        if (success) {
            if (selectedJob?.id === jobId) {
                onClose();
            }
        }
    };

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
            {data?.jobs.map(job => (
                <Card
                    boxShadow="dark-lg"
                    maxW="md"
                    h="96"
                    key={job.id}
                >
                    <CardHeader p="2.5">
                        <Flex>
                            <Flex flex="1" gap="4" alignItems="center">
                                <Avatar 
                                    name={(job.contractor && job.contractor !== "") ? job.contractor : job.user_name}
                                    src={job.user_avatar ? `${process.env.NEXT_PUBLIC_API_URL}/avatars/${job.user_avatar}` : undefined}
                                    _hover={{
                                        transform: 'scale(1.1)',
                                        transition: 'transform 0.2s ease-in-out',
                                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => router.push(`/profile?user=${job.user_id}`)}
                                />
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
                        </Flex>
                    </CardHeader>

                    <CardBody whiteSpace="1" h="10">
                        <VStack spacing="2" alignItems="center" height="100%">
                            <Text textAlign="justify" fontSize="12" maxW="100%" noOfLines={3}>
                                {job.description_vacancy.toString()}
                            </Text>
                            <Image maxW="40%" src={job.banner ? `${process.env.NEXT_PUBLIC_API_URL}/banners/${job.banner}` : undefined} alt="Banner da vaga" fallback={<Flex h="80px" w="40%" bgGradient="linear(to-r, blue.600, blue.400)" borderRadius="md" align="center" justify="center"><Icon as={FiBriefcase} boxSize="36px" color="whiteAlpha.800" /></Flex>} />
                        </VStack>
                    </CardBody>

                    <CardFooter alignItems="center" p="2.5" pt="1">
                        <SimpleGrid gap="2" w="100%" flex="1" minChildWidth="90px">
                            <Button
                                variant="ghost"
                                leftIcon={<GoCheckCircleFill color="green" />}
                                size="xs"
                                onClick={() => handleValidate(job.id, true)}
                                isLoading={isLoading}
                            >
                                Aprovar Vaga
                            </Button>
                            <Button
                                variant="ghost"
                                leftIcon={<GoXCircleFill color="red" />}
                                size="xs"
                                onClick={() => handleValidate(job.id, false)}
                                isLoading={isLoading}
                            >
                                Reprovar Vaga
                            </Button>
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
                        </SimpleGrid>
                    </CardFooter>
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
                                        <Avatar
                                            name={(job.contractor && job.contractor !== "") ? job.contractor : job.user_name}
                                            src={job.user_avatar ? `${process.env.NEXT_PUBLIC_API_URL}/avatars/${job.user_avatar}` : undefined}
                                            _hover={{
                                                transform: 'scale(1.1)',
                                                transition: 'transform 0.2s ease-in-out',
                                                boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => router.push(`/profile?user=${job.user_id}`)}
                                        />
                                        <Box>
                                            <Text fontWeight="bold" fontSize="xl">{selectedJob.vacancy}</Text>
                                            <Text fontSize="sm" color="gray.500">
                                                {(selectedJob.contractor == null || selectedJob.contractor === "") ? selectedJob.user_name : selectedJob.contractor}
                                            </Text>
                                        </Box>
                                    </Flex>
                                </ModalHeader>
                                <ModalCloseButton />
                                <ModalBody overflowY="auto" maxH="500px" bg={modalBodyBg} p="6" borderRadius="md">
                                    <VStack align="start" spacing="6">
                                        <Box p="4" border="1px" borderColor="blue.100" borderRadius="md" w="100%">
                                            <Image
                                                src={job.banner ? `${process.env.NEXT_PUBLIC_API_URL}/banners/${job.banner}` : undefined}
                                                borderRadius="md"
                                                boxShadow="md"
                                                mb="4"
                                                w="100%"
                                                alt="Banner da vaga"
                                                fallback={<Flex bgGradient="linear(to-r, blue.600, blue.400)" borderRadius="md" boxShadow="md" mb="4" w="100%" h="120px" align="center" justify="center"><Icon as={FiBriefcase} boxSize="48px" color="whiteAlpha.800" /></Flex>}
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
                                                        {(selectedJob.benefits ?? "").split(",").map((benefit, idx) => (
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
                                        colorScheme="green"
                                        mr={3}
                                        leftIcon={<GoCheckCircleFill />}
                                        onClick={() => handleValidate(selectedJob.id, true)}
                                        isLoading={isLoading}
                                    >
                                        Aprovar Vaga
                                    </Button>
                                    <Button
                                        colorScheme="red"
                                        mr={3}
                                        leftIcon={<GoXCircleFill />}
                                        onClick={() => handleValidate(selectedJob.id, false)}
                                        isLoading={isLoading}
                                    >
                                        Reprovar Vaga
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
                </Card>
            ))}
        </>
    );
}