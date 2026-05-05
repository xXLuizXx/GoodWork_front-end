import { Badge, Box, Button, Icon, Stack, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { RiDashboardLine } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";
import { Categories } from "./Categories/Categories";
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Link as ChakraLink } from '@chakra-ui/react';
import { useCountJobsNotValidated } from '@/services/hooks/Jobs/useCountJobsValidated';
import { parseCookies } from "nookies";
import decode from "jwt-decode";
import { useCountCategoriesNotValidated } from "@/services/hooks/Categories/useCountCategoriesNotValidated";
import { useMyApplicationsCandidate } from "@/services/hooks/applications/useMyApplicationsCandidate";
import { usePendingInterviewsCount } from "@/services/hooks/Interviews/usePendingInterviewsCount";
import { CreateCategory } from "./Categories/CreateCategory";

interface DecodedToken {
    accessLevel: string;
    isAdmin: boolean;
    sub: string;
}

const linkStyle = {
    display: "block" as const,
    color: "gray.500",
    fontSize: "sm",
    fontWeight: "bold",
    py: 2,
    px: 4,
    _hover: { color: "gray.600", transform: "scale(1.05)" },
    transition: "all 0.3s ease",
    textDecoration: "none",
};

export function Sidebar() {
    const [mounted, setMounted] = useState(false);
    const [admin, setAdmin] = useState(false);
    const [typeUser, setTypeUser] = useState("");
    const [userId, setUserId] = useState("");

    const { data: jobsData, isLoading: isLoadingJobs } = useCountJobsNotValidated({ enabled: admin });
    const { data: categoriesData, isLoading: isLoadingCategories } = useCountCategoriesNotValidated({ enabled: admin });
    const { isOpen: isCategoryModalOpen, onOpen: onCategoryModalOpen, onClose: onCategoryModalClose } = useDisclosure();

    const isIndividual = mounted && typeUser === "individual" && !admin;
    const { data: myApplications } = useMyApplicationsCandidate(userId, { enabled: isIndividual && !!userId });
    const candidateAppIds = myApplications?.map((a) => a.id) ?? [];
    const { count: pendingInterviewsCount } = usePendingInterviewsCount(candidateAppIds, userId, {
        enabled: isIndividual && candidateAppIds.length > 0,
    });

    const categoriesCount = categoriesData?.length || 0;
    const jobsCount = admin ? (isLoadingJobs ? 0 : jobsData?.count || 0) : 0;

    useEffect(() => {
        setMounted(true);
        const cookies = parseCookies();
        const token = cookies["token.token"];
        if (token) {
            try {
                const decoded = decode<DecodedToken>(token);
                setAdmin(!!decoded.isAdmin);
                setTypeUser(decoded.accessLevel);
                setUserId(decoded.sub);
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
            }
        }
    }, []);

    if (!mounted) return null;

    return (
        <Box as="aside" w="64" mr="8">
            <Stack spacing="12" align="flex-start" fontSize="14">

                {/* GERAL */}
                <Box>
                    <Text fontWeight="bold" color="gray.500" fontSize="small">GERAL</Text>
                    <Stack spacing="4" mt="8" align="stretch">
                        <Stack borderRadius="full" h="10" w="100%" _hover={{ bgColor: 'gray.200' }}>
                            <NextLink href="/dashboard" legacyBehavior>
                                <ChakraLink display="flex" mt="2" ml="4" mr="4" alignItems="center">
                                    <Icon as={RiDashboardLine} fontSize="20" w="6" h="6" />
                                    <Text ml="4" fontWeight="medium">Dashboard</Text>
                                </ChakraLink>
                            </NextLink>
                        </Stack>
                    </Stack>
                </Box>

                <Box>
                    <Accordion allowMultiple marginBottom={50}>

                        {/* USUÁRIOS — só admin */}
                        {admin && (
                            <AccordionItem>
                                <AccordionButton pb="7">
                                    <Text flex="1" textAlign="left" fontWeight="bold" color="gray.500" fontSize="small">
                                        USUÁRIOS
                                    </Text>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel>
                                    <NextLink href="/users/generate-users" legacyBehavior passHref>
                                        <ChakraLink {...linkStyle}>
                                            Gerenciar Usuários
                                        </ChakraLink>
                                    </NextLink>
                                </AccordionPanel>
                            </AccordionItem>
                        )}

                        {/* VAGAS */}
                        <AccordionItem>
                            {({ isExpanded }) => (
                                <>
                                    <AccordionButton pb="7" position="relative">
                                        <Text flex="1" textAlign="left" fontWeight="bold" color="gray.500" fontSize="small">
                                            VAGAS
                                        </Text>
                                        {admin && !isExpanded && jobsCount > 0 && (
                                            <Box
                                                position="absolute"
                                                right="2"
                                                top="2"
                                                bg="red.600"
                                                borderRadius="full"
                                                w="12px"
                                                h="12px"
                                                border="2px solid white"
                                                boxShadow="md"
                                                animation="pulse 1.5s infinite"
                                                css={{
                                                    "@keyframes pulse": {
                                                        "0%": { transform: "scale(0.95)", opacity: 0.8 },
                                                        "70%": { transform: "scale(1.1)", opacity: 1 },
                                                        "100%": { transform: "scale(0.95)", opacity: 0.8 },
                                                    },
                                                }}
                                            />
                                        )}
                                        <AccordionIcon />
                                    </AccordionButton>

                                    <AccordionPanel>
                                        <VStack align="start" spacing={1}>

                                            {/* Empresa */}
                                            {typeUser === "company" && !admin && (
                                                <>
                                                    <NextLink href="/jobs/create" legacyBehavior passHref>
                                                        <ChakraLink {...linkStyle}>Cadastrar nova vaga</ChakraLink>
                                                    </NextLink>
                                                    <NextLink href={`/jobs-company-genereted?id=${userId}`} legacyBehavior passHref>
                                                        <ChakraLink {...linkStyle}>Minhas vagas</ChakraLink>
                                                    </NextLink>
                                                </>
                                            )}

                                            {/* Individual */}
                                            {typeUser === "individual" && !admin && (
                                                <>
                                                    <NextLink href="/jobs/jobsRecommended" legacyBehavior passHref>
                                                        <ChakraLink {...linkStyle}>Recomendadas</ChakraLink>
                                                    </NextLink>
                                                    <NextLink href="/jobs/allJobs" legacyBehavior passHref>
                                                        <ChakraLink {...linkStyle}>Todas</ChakraLink>
                                                    </NextLink>
                                                </>
                                            )}

                                            {/* Admin */}
                                            {admin && (
                                                <>
                                                    <NextLink href="/jobs/jobsNotValidated" legacyBehavior passHref>
                                                        <ChakraLink {...linkStyle} display="inline-flex" alignItems="center">
                                                            Aprovar vagas
                                                            {jobsCount > 0 && (
                                                                <Badge
                                                                    ml={2}
                                                                    bg="red.600"
                                                                    color="black"
                                                                    borderRadius="full"
                                                                    boxSize="20px"
                                                                    display="flex"
                                                                    alignItems="center"
                                                                    justifyContent="center"
                                                                    fontSize="xs"
                                                                    fontWeight="extrabold"
                                                                >
                                                                    {jobsCount}
                                                                </Badge>
                                                            )}
                                                        </ChakraLink>
                                                    </NextLink>
                                                    <NextLink href="/jobs/generate-jobs" legacyBehavior passHref>
                                                        <ChakraLink {...linkStyle}>Gerenciar Vagas</ChakraLink>
                                                    </NextLink>
                                                </>
                                            )}

                                            {/* Por categoria — empresa e individual */}
                                            {!admin && (
                                                <Accordion allowMultiple w="100%">
                                                    <AccordionItem border="none">
                                                        <AccordionButton px={4} py={2} _hover={{ bg: "transparent" }}>
                                                            <Text
                                                                flex="1"
                                                                textAlign="left"
                                                                color="gray.500"
                                                                fontSize="sm"
                                                                fontWeight="bold"
                                                            >
                                                                Por categoria
                                                            </Text>
                                                            <AccordionIcon />
                                                        </AccordionButton>
                                                        <AccordionPanel px={0} pb={2}>
                                                            <Categories />
                                                        </AccordionPanel>
                                                    </AccordionItem>
                                                </Accordion>
                                            )}

                                        </VStack>
                                    </AccordionPanel>
                                </>
                            )}
                        </AccordionItem>

                        {/* CATEGORIAS — só admin */}
                        {admin && (
                            <AccordionItem>
                                {({ isExpanded }) => (
                                    <>
                                        <AccordionButton pb="7" position="relative">
                                            <Text flex="1" textAlign="left" fontWeight="bold" color="gray.500" fontSize="small">
                                                CATEGORIAS
                                            </Text>
                                            {!isExpanded && !isLoadingCategories && categoriesCount > 0 && (
                                                <Box
                                                    position="absolute"
                                                    right="2"
                                                    top="2"
                                                    bg="red.600"
                                                    borderRadius="full"
                                                    w="12px"
                                                    h="12px"
                                                    border="2px solid white"
                                                    boxShadow="md"
                                                    animation="pulse 1.5s infinite"
                                                    css={{
                                                        "@keyframes pulse": {
                                                            "0%": { transform: "scale(0.95)", opacity: 0.8 },
                                                            "70%": { transform: "scale(1.1)", opacity: 1 },
                                                            "100%": { transform: "scale(0.95)", opacity: 0.8 },
                                                        },
                                                    }}
                                                />
                                            )}
                                            <AccordionIcon />
                                        </AccordionButton>
                                        <AccordionPanel>
                                            <VStack align="start" spacing={1}>
                                                <NextLink href="/categories/generate-categories" legacyBehavior passHref>
                                                    <ChakraLink {...linkStyle}>Gerenciar Categorias</ChakraLink>
                                                </NextLink>
                                                <NextLink href="/categories/categoriesNotValidated" legacyBehavior passHref>
                                                    <ChakraLink {...linkStyle} display="inline-flex" alignItems="center">
                                                        Aprovar Categorias
                                                        {categoriesCount > 0 && (
                                                            <Badge
                                                                ml={2}
                                                                bg="red.600"
                                                                color="black"
                                                                borderRadius="full"
                                                                boxSize="20px"
                                                                display="flex"
                                                                alignItems="center"
                                                                justifyContent="center"
                                                                fontSize="xs"
                                                                fontWeight="extrabold"
                                                            >
                                                                {categoriesCount}
                                                            </Badge>
                                                        )}
                                                    </ChakraLink>
                                                </NextLink>
                                                <Button
                                                    onClick={onCategoryModalOpen}
                                                    {...linkStyle}
                                                    bgColor="transparent"
                                                    _hover={{ color: "gray.600", transform: "scale(1.05)", bgColor: "transparent" }}
                                                    fontWeight="bold"
                                                    h="auto"
                                                >
                                                    Cadastrar Categoria
                                                    <CreateCategory isOpen={isCategoryModalOpen} onClose={onCategoryModalClose} />
                                                </Button>
                                            </VStack>
                                        </AccordionPanel>
                                    </>
                                )}
                            </AccordionItem>
                        )}

                        {/* CANDIDATURAS — apenas individual */}
                        {typeUser === "individual" && !admin && (
                            <AccordionItem>
                                {({ isExpanded }) => (
                                    <>
                                        <AccordionButton pb="7" position="relative">
                                            <Text flex="1" textAlign="left" fontWeight="bold" color="gray.500" fontSize="small">
                                                CANDIDATURAS
                                            </Text>
                                            {!isExpanded && pendingInterviewsCount > 0 && (
                                                <Box
                                                    position="absolute"
                                                    right="2"
                                                    top="2"
                                                    bg="red.600"
                                                    borderRadius="full"
                                                    w="12px"
                                                    h="12px"
                                                    border="2px solid white"
                                                    boxShadow="md"
                                                    animation="pulse 1.5s infinite"
                                                    css={{
                                                        "@keyframes pulse": {
                                                            "0%": { transform: "scale(0.95)", opacity: 0.8 },
                                                            "70%": { transform: "scale(1.1)", opacity: 1 },
                                                            "100%": { transform: "scale(0.95)", opacity: 0.8 },
                                                        },
                                                    }}
                                                />
                                            )}
                                            <AccordionIcon />
                                        </AccordionButton>
                                        <AccordionPanel>
                                            <VStack align="start" spacing={1}>
                                                <NextLink href="/applications/my-applications" legacyBehavior passHref>
                                                    <ChakraLink {...linkStyle}>Minhas candidaturas</ChakraLink>
                                                </NextLink>
                                                <NextLink href="/interviews/candidate" legacyBehavior passHref>
                                                    <ChakraLink {...linkStyle} display="inline-flex" alignItems="center">
                                                        Acompanhamento de entrevista
                                                        {pendingInterviewsCount > 0 && (
                                                            <Badge
                                                                ml={2}
                                                                bg="red.600"
                                                                color="white"
                                                                borderRadius="full"
                                                                boxSize="20px"
                                                                display="flex"
                                                                alignItems="center"
                                                                justifyContent="center"
                                                                fontSize="xs"
                                                                fontWeight="extrabold"
                                                            >
                                                                {pendingInterviewsCount}
                                                            </Badge>
                                                        )}
                                                    </ChakraLink>
                                                </NextLink>
                                            </VStack>
                                        </AccordionPanel>
                                    </>
                                )}
                            </AccordionItem>
                        )}

                        {/* ENTREVISTAS — apenas empresa */}
                        {typeUser === "company" && !admin && (
                            <AccordionItem>
                                <AccordionButton pb="7">
                                    <Text flex="1" textAlign="left" fontWeight="bold" color="gray.500" fontSize="small">
                                        ENTREVISTAS
                                    </Text>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel>
                                    <VStack align="start" spacing={1}>
                                        <NextLink href="/interviews/create" legacyBehavior passHref>
                                            <ChakraLink {...linkStyle}>Marcar entrevista</ChakraLink>
                                        </NextLink>
                                        <NextLink href="/interviews/my-interviews" legacyBehavior passHref>
                                            <ChakraLink {...linkStyle}>Minhas entrevistas</ChakraLink>
                                        </NextLink>
                                    </VStack>
                                </AccordionPanel>
                            </AccordionItem>
                        )}

                    </Accordion>
                </Box>

                {/* RELATÓRIOS */}
                <Box>
                    <Text fontWeight="bold" color="gray.500" fontSize="small">RELATÓRIOS</Text>
                    <Stack spacing="4" mt="8" align="stretch">
                        <Stack borderRadius="full" h="10" w="100%" _hover={{ bgColor: 'gray.200' }}>
                            <NextLink href="/report" legacyBehavior>
                                <ChakraLink mt="2" ml="4" mr="4" display="flex" alignItems="center">
                                    <Icon as={TbReportAnalytics} fontSize="20" w="6" h="6" />
                                    <Text ml="4" fontWeight="medium">Relatório</Text>
                                </ChakraLink>
                            </NextLink>
                        </Stack>
                    </Stack>
                </Box>

            </Stack>
        </Box>
    );
}
