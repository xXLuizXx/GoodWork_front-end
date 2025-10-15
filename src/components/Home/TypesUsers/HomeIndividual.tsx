import React, { useState } from 'react';
import {
    Flex,
    Card,
    CardHeader,
    CardBody,
    Heading,
    Text,
    Button,
    Box,
    Stack,
    Divider,
    useToast,
    VStack,
    HStack,
    Icon,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Input,
    InputGroup,
    InputLeftElement,
    Tag,
    TagLabel,
    Grid
} from '@chakra-ui/react';
import { Jobs } from '../../Jobs/JobsIndividual/jobs';
import { JobsForUser } from '@/components/Jobs/JobsIndividual/jobsForUserLogged';
import { 
    FiSearch, 
    FiFilter, 
    FiMapPin, 
    FiBriefcase, 
    FiDollarSign, 
    FiClock,
    FiArrowRight,
    FiStar,
    FiTrendingUp,
    FiArrowUp
} from 'react-icons/fi';

export function HomeIndividual() {
    const toast = useToast();
    const [showAllJobs, setShowAllJobs] = useState(false);

    const handleShowAllJobs = () => {
        setShowAllJobs(true);
        setTimeout(() => {
            document.getElementById('todas-vagas')?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
    };

    const handleHideAllJobs = () => {
        setShowAllJobs(false);
        setTimeout(() => {
            document.getElementById('todas-vagas')?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
    };

    return (
        <Box p={4} maxWidth="1200px" mx="auto">
            <Box 
                bgGradient="linear(to-r, blue.600, blue.400)"
                borderRadius="xl"
                p={8}
                mb={10}
                color="white"
                position="relative"
                overflow="hidden"
            >
                <Box position="absolute" top="-50px" right="-50px" opacity={0.1}>
                    <Icon as={FiBriefcase} boxSize="200px" />
                </Box>
                
                <VStack spacing={4} align="start" position="relative" zIndex={1}>
                    <Heading size="2xl" fontWeight="bold">
                        Encontre sua vaga{" "}
                        <Text as="span" color="yellow.300">perfeita</Text>
                    </Heading>
                    
                    <Text fontSize="lg" opacity={0.9}>
                        Conectamos talentos às melhores oportunidades do mercado
                    </Text>
                </VStack>
            </Box>

            <Box mb={10}>
                <Flex justify="space-between" align="center" mb={6}>
                    <VStack align="start" spacing={1}>
                        <Heading size="lg" color="blue.800">
                            <Icon as={FiStar} color="yellow.400" mr={2} />
                            Vagas Recomendadas
                        </Heading>
                        <Text color="gray.600" fontSize="sm">
                            Selecionadas especialmente para seu perfil
                        </Text>
                    </VStack>
                </Flex>
                <JobsForUser />
            </Box>

            <Divider my={1} />

            <Box mb={10} id="todas-vagas">
                {!showAllJobs ? (
                    <Card 
                        bg="gray.50" 
                        borderWidth="2px" 
                        borderStyle="dashed" 
                        borderColor="gray.200"
                        _hover={{ borderColor: 'blue.300', transform: 'translateY(-2px)' }}
                        transition="all 0.3s ease"
                        cursor="pointer"
                        onClick={handleShowAllJobs}
                    >
                        <CardBody>
                            <VStack spacing={4} py={8} textAlign="center">
                                <Icon as={FiTrendingUp} boxSize={10} color="blue.500" />
                                <Heading size="md" color="blue.800">
                                    Explore Todas as Vagas
                                </Heading>
                                <Text color="gray.600">
                                    Descubra diversas oportunidades disponíveis no mercado
                                </Text>
                                <Button 
                                    colorScheme="blue" 
                                    size="lg"
                                    rightIcon={<FiArrowRight />}
                                >
                                    Ver Todas as Vagas
                                </Button>
                            </VStack>
                        </CardBody>
                    </Card>
                ) : (
                    <>
                        <Flex justify="space-between" align="center" mb={6}>
                            <VStack align="start" spacing={1}>
                                <Heading size="lg" color="blue.800">
                                    Todas as Vagas
                                </Heading>
                                <Text color="gray.600" fontSize="sm">
                                    Explore todas as oportunidades disponíveis
                                </Text>
                            </VStack>
                            <Button 
                                colorScheme="gray" 
                                variant="outline"
                                size="sm"
                                leftIcon={<FiArrowUp />}
                                onClick={handleHideAllJobs}
                            >
                                Recolher
                            </Button>
                        </Flex>
                        <Jobs />
                        <Flex justify="center" mt={6}>
                            <Button 
                                colorScheme="gray" 
                                variant="outline"
                                leftIcon={<FiArrowUp />}
                                onClick={handleHideAllJobs}
                            >
                                Recolher Vagas
                            </Button>
                        </Flex>
                    </>
                )}
            </Box>
        </Box>
    );
}