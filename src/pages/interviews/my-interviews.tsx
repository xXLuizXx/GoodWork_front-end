import React, { useState, useEffect } from "react";
import {
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    CardFooter,
    CardHeader,
    Flex,
    Heading,
    Icon,
    SimpleGrid,
    Spinner,
    Stack,
    Alert,
    AlertIcon,
    Text,
    Tooltip,
} from "@chakra-ui/react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/Header/Header";
import { Sidebar } from "@/components/Sidebar";
import { withSSRAuth } from "@/shared/withSSRAuth";
import { useAllJobsCompany } from "@/services/hooks/Jobs/useAllJobsCompany";
import { parseCookies } from "nookies";
import decode from "jwt-decode";
import { useRouter } from "next/router";
import { GrAdd } from "react-icons/gr";
import { MdOutlineEventAvailable } from "react-icons/md";

export const getServerSideProps = withSSRAuth(async () => {
    return { props: {} };
}, "company");

interface DecodedToken {
    sub: string;
}

export default function MyInterviews(): JSX.Element {
    const [userId, setUserId] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const router = useRouter();

    useEffect(() => {
        const cookies = parseCookies();
        const token = cookies["token.token"];
        if (token) {
            try {
                const decoded = decode<DecodedToken>(token);
                setUserId(decoded.sub);
            } catch {}
        }
    }, []);

    const { data, isLoading } = useAllJobsCompany(userId);

    return (
        <Flex direction="column" minH="100vh">
            <Helmet>
                <title>Minhas entrevistas</title>
                <link rel="icon" href="/Img/logos/GoodworkSSlogan.png" type="image/png" />
            </Helmet>
            <Header />

            <Flex w="100%" my="8" maxWidth={1480} mx="auto" px="4">
                <Sidebar />

                <Box w="100%">
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
                        <Text fontSize="xl" fontWeight="bold" color="gray.700">
                            Entrevistas por vaga
                        </Text>
                        <Button
                            leftIcon={<Icon as={GrAdd} />}
                            colorScheme="blue"
                            size="sm"
                            onClick={() => router.push("/interviews/create")}
                        >
                            Marcar entrevista
                        </Button>
                    </Flex>

                    {isLoading && (
                        <Flex justify="center" mt="16">
                            <Spinner size="xl" color="blue.500" />
                        </Flex>
                    )}

                    {!isLoading && (!data?.jobs || data.jobs.length === 0) && (
                        <Stack>
                            <Alert status="info">
                                <AlertIcon />
                                Nenhuma vaga encontrada.
                            </Alert>
                        </Stack>
                    )}

                    <SimpleGrid columns={{ base: 1, lg: Math.min(4, data?.jobs?.length || 1) }} spacing="6">
                        {data?.jobs?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((job) => {
                            const today = new Date();
                            const isClosedByDate = job.closing_date && new Date(job.closing_date) <= today;
                            const isClosed = !job.vacancy_available || isClosedByDate;
                            const closingDateFormatted = job.closing_date
                                ? new Date(job.closing_date).toLocaleDateString("pt-BR")
                                : "Sem data definida";

                            return (
                                <Card
                                    key={job.id}
                                    boxShadow="dark-lg"
                                    maxW="md"
                                    _hover={{
                                        transform: "translateY(-4px)",
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    <CardHeader p="3">
                                        <Flex align="center" justify="space-between" wrap="wrap" gap="2">
                                            <Flex flex="1" gap="3" alignItems="center" minW="0">
                                                <Avatar
                                                    size="sm"
                                                    name="avatar"
                                                    src={
                                                        job.user_avatar
                                                            ? `${process.env.NEXT_PUBLIC_API_URL}/avatars/${job.user_avatar}`
                                                            : "../../../Img/icons/avatarLogin.png"
                                                    }
                                                />
                                                <Box minW="0" flex="1">
                                                    <Heading size="sm">
                                                        <Text fontSize="14" noOfLines={1}>
                                                            {job.vacancy}
                                                        </Text>
                                                    </Heading>
                                                    <Text fontSize="12" noOfLines={1}>
                                                        {job.contractor || job.user_name}
                                                    </Text>
                                                    <Text fontSize="10" color="gray.500" mt="1">
                                                        {job.location} · Encerra: {closingDateFormatted}
                                                    </Text>
                                                </Box>
                                            </Flex>
                                            <Tooltip label={`Data de encerramento: ${closingDateFormatted}`}>
                                                <Badge
                                                    colorScheme={isClosed ? "red" : "green"}
                                                    fontSize="10px"
                                                    px={1.5}
                                                    py={0.5}
                                                    flexShrink={0}
                                                >
                                                    {isClosed ? "Fechada" : "Aberta"}
                                                </Badge>
                                            </Tooltip>
                                        </Flex>
                                    </CardHeader>

                                    <CardFooter p="3" pt="0">
                                        <SimpleGrid gap="2" w="100%" flex="1" minChildWidth="90px">
                                            <Button
                                                variant="ghost"
                                                leftIcon={<Icon as={MdOutlineEventAvailable} color="blue" />}
                                                size="xs"
                                                onClick={() =>
                                                    router.push(`/interviews/manage?job_id=${job.id}`)
                                                }
                                            >
                                                Gerenciar entrevistas
                                            </Button>
                                        </SimpleGrid>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </SimpleGrid>

                    {data?.jobs && data.jobs.length > itemsPerPage && (
                        <Flex justify="center" mt="8" gap="2">
                            <Button
                                size="sm"
                                onClick={() => setCurrentPage(1)}
                                isDisabled={currentPage === 1}
                            >
                                «
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                isDisabled={currentPage === 1}
                            >
                                ‹
                            </Button>

                            {Array.from(
                                { length: Math.ceil(data.jobs.length / itemsPerPage) },
                                (_, i) => i + 1
                            ).map((page) => (
                                <Button
                                    key={page}
                                    size="sm"
                                    colorScheme={currentPage === page ? "blue" : "gray"}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </Button>
                            ))}

                            <Button
                                size="sm"
                                onClick={() =>
                                    setCurrentPage((p) =>
                                        Math.min(Math.ceil(data.jobs.length / itemsPerPage), p + 1)
                                    )
                                }
                                isDisabled={currentPage === Math.ceil(data.jobs.length / itemsPerPage)}
                            >
                                ›
                            </Button>
                            <Button
                                size="sm"
                                onClick={() =>
                                    setCurrentPage(Math.ceil(data.jobs.length / itemsPerPage))
                                }
                                isDisabled={currentPage === Math.ceil(data.jobs.length / itemsPerPage)}
                            >
                                »
                            </Button>
                        </Flex>
                    )}
                </Box>
            </Flex>
        </Flex>
    );
}
