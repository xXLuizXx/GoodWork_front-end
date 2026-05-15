import React, { useState } from 'react';
import {
    Flex,
    Card,
    CardBody,
    Heading,
    Text,
    Button,
    Box,
    Divider,
    VStack,
    HStack,
    Icon,
    useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { Jobs } from '../../Jobs/JobsIndividual/jobs';
import { JobsForUser } from '@/components/Jobs/JobsIndividual/jobsForUserLogged';
import {
    FiBriefcase,
    FiArrowRight,
    FiStar,
    FiTrendingUp,
    FiArrowUp,
    FiCalendar,
    FiBarChart2,
} from 'react-icons/fi';

export function HomeIndividual() {
    const router = useRouter();
    const [showAllJobs, setShowAllJobs] = useState(false);
    const headingColor = useColorModeValue("blue.800", "blue.200");
    const subtitleColor = useColorModeValue("gray.600", "gray.400");
    const cardBg = useColorModeValue("gray.50", "gray.700");
    const cardBorderColor = useColorModeValue("gray.200", "gray.600");
    const buttonHoverBg = useColorModeValue("blue.50", "blue.900");

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

            {/* Atalhos rápidos */}
            <HStack
                spacing={3}
                mb={8}
                flexWrap="wrap"
                gap={3}
            >
                <Button
                    variant="outline"
                    colorScheme="blue"
                    leftIcon={<Icon as={FiBriefcase} />}
                    _hover={{ bg: buttonHoverBg }}
                    onClick={() => router.push('/applications/my-applications')}
                >
                    Minhas Candidaturas
                </Button>
                <Button
                    variant="outline"
                    colorScheme="blue"
                    leftIcon={<Icon as={FiCalendar} />}
                    _hover={{ bg: buttonHoverBg }}
                    onClick={() => router.push('/interviews/my-interviews')}
                >
                    Minhas Entrevistas
                </Button>
                <Button
                    variant="outline"
                    colorScheme="blue"
                    leftIcon={<Icon as={FiBarChart2} />}
                    _hover={{ bg: buttonHoverBg }}
                    onClick={() => router.push('/report')}
                >
                    Meu Relatório
                </Button>
            </HStack>

            <Box mb={10}>
                <Flex justify="space-between" align="center" mb={6}>
                    <VStack align="start" spacing={1}>
                        <Heading size="lg" color={headingColor}>
                            <Icon as={FiStar} color="yellow.400" mr={2} />
                            Vagas Recomendadas
                        </Heading>
                        <Text color={subtitleColor} fontSize="sm">
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
                        bg={cardBg}
                        borderWidth="2px"
                        borderStyle="dashed"
                        borderColor={cardBorderColor}
                        _hover={{ borderColor: 'blue.300', transform: 'translateY(-2px)' }}
                        transition="all 0.3s ease"
                        cursor="pointer"
                        onClick={handleShowAllJobs}
                    >
                        <CardBody>
                            <VStack spacing={4} py={8} textAlign="center">
                                <Icon as={FiTrendingUp} boxSize={10} color="blue.500" />
                                <Heading size="md" color={headingColor}>
                                    Explore Todas as Vagas
                                </Heading>
                                <Text color={subtitleColor}>
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
                                <Heading size="lg" color={headingColor}>
                                    Todas as Vagas
                                </Heading>
                                <Text color={subtitleColor} fontSize="sm">
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