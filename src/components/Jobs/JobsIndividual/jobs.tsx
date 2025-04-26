import { Avatar, Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, Heading, IconButton, Image, SimpleGrid, Text, VStack, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Alert, AlertIcon } from "@chakra-ui/react";
import {BsThreeDotsVertical} from "react-icons/bs";
import {GrFormView, GrUserAdd} from "react-icons/gr";
import {useAllJobs} from "@/services/hooks/Jobs/useAllJobs";
import { useState } from "react";

export function Jobs() {
    const {data} = useAllJobs();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [selectedJob, setSelectedJob] = useState(null);
    
    if(!data?.jobs || data.jobs.length === 0){
        return (
            <Stack>
                <Alert status="info">
                    <AlertIcon />
                    Nenhuma vaga encontrada.
                </Alert>
            </Stack>
        );
    }else{
        return (
            <>
                {data?.jobs.map(job => (
                    job.valid_vacancy && (
                        <Card
                            boxShadow="dark-lg"
                            maxW="md"
                            h="96"
                            key={job.id}
                        >
                            <CardHeader p="2.5">
                                <Flex>
                                    <Flex flex="1" gap="4" alignItems="center">
                                        <Avatar name="avatar" src="./Img/icons/empresaTeste.jpg"/>
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
                                    <IconButton
                                        variant="ghost"
                                        colorScheme="gray"
                                        aria-label="See menu"
                                        icon={<BsThreeDotsVertical/>}
                                    />
                                </Flex>
                            </CardHeader>
                            <CardBody whiteSpace="1" h="10">
                                <VStack spacing="2"
                                        alignItems="center"
                                        height="100%"
                                >
                                    <Text textAlign="justify" fontSize="12" maxW="100%" noOfLines={3}>
                                        {job.description_vacancy.toString()}
                                    </Text>
                                    {job.banner == null ? (
                                            <Image
                                                maxW="40%"
                                                src="./Img/icons/bannerVaga.png"
                                            />
                                        ) :
                                        <Image
                                            maxW="40%"
                                            src="./Img/icons/bannerVaga.png"
                                        />
                                    }
                                </VStack>

                            </CardBody>

                            <CardFooter
                                alignItems="center"
                                p="2.5"
                                pt="1"
                            >
                                <SimpleGrid
                                    gap="2"
                                    w="100%"
                                    flex="1"
                                    minChildWidth="90px"
                                >
                                    <Button variant="ghost" leftIcon={<GrUserAdd color="green"/>} size='xs'>Concorrer</Button>
                                    <Button variant="ghost" leftIcon={<GrFormView color="blue"/>} 
                                        onClick={() => {
                                                        setSelectedJob(job);
                                                        onOpen();
                                                    }
                                                }  size='xs'
                                    >
                                        Visualizar
                                    </Button>
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
                                                    <Avatar name="avatar" src="./Img/icons/empresaTeste.jpg" />
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
                                                                src={job.banner == null ? "./Img/icons/bannerVaga.png" : "./Img/icons/bannerVaga.png"} 
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
                                </SimpleGrid>
                            </CardFooter>
                        </Card>
                    )
                ))}
            </>
        );
    }
}