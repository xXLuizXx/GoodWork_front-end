import { Avatar, Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, Heading, Image, SimpleGrid, Text, VStack, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Alert, AlertIcon, useToast } from "@chakra-ui/react";
import { GrFormView } from "react-icons/gr";
import { GoXCircleFill, GoCheckCircleFill } from "react-icons/go";
import { useJobsNotValidated } from "@/services/hooks/Jobs/useJobsNotValidated";
import { useState } from "react";
import { useValidateJob } from "@/services/hooks/Jobs/useValidateJob";
import { queryClient } from "@/services/queryClient";

export function JobsNotValidated() {
    const { data, refetch } = useJobsNotValidated();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedJob, setSelectedJob] = useState(null);
    const { validateJob, isLoading } = useValidateJob();
    const toast = useToast();

    const handleValidate = async (jobId: string, validated: boolean) => {
        const success = await validateJob(jobId, validated);
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

                    {/* Modal de visualização */}
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
                                    </Flex>
                                </ModalHeader>
                                <ModalCloseButton />
                                <ModalBody overflowY="auto" maxH="500px" bg="gray.50" p="6" borderRadius="md">
                                    <VStack align="start" spacing="6">
                                        <Box p="4" border="1px" borderColor="blue.100" borderRadius="md" w="100%">
                                            <Image
                                                src={job.banner == null ? "../Img/icons/bannerVaga.png" : "../Img/icons/bannerVaga.png"}
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