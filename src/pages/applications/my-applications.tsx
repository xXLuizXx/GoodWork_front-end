import React, { useEffect, useState } from "react";
import {
    Alert,
    AlertIcon,
    Badge,
    Box,
    Flex,
    Spinner,
    Stack,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/Header/Header";
import { Sidebar } from "@/components/Sidebar";
import { withSSRAuth } from "@/shared/withSSRAuth";
import { useMyApplicationsCandidate, IMyApplication } from "@/services/hooks/applications/useMyApplicationsCandidate";
import { parseCookies } from "nookies";
import decode from "jwt-decode";

export const getServerSideProps = withSSRAuth(async () => {
    return { props: {} };
}, "individual");

interface DecodedToken {
    sub: string;
}

interface IProcessStage {
    label: string;
    color: string;
}

function getProcessStage(application: IMyApplication): IProcessStage {
    const { application_approved, hired, interview } = application;

    if (application_approved === false) {
        return { label: "Reprovado", color: "red" };
    }

    if (application_approved === null) {
        return { label: "Aguardando análise", color: "gray" };
    }

    if (!interview) {
        return { label: "Aprovado — aguardando entrevista", color: "blue" };
    }

    if (interview.status === "cancelled") {
        return { label: "Entrevista cancelada", color: "orange" };
    }

    if (interview.status === "scheduled" || interview.status === "rescheduled") {
        return { label: "Entrevista agendada", color: "blue" };
    }

    if (interview.status === "completed") {
        if (hired === true)  return { label: "Contratado", color: "green" };
        if (hired === false) return { label: "Não contratado", color: "red" };
        return { label: "Entrevista realizada — aguardando decisão", color: "yellow" };
    }

    return { label: "Aguardando análise", color: "gray" };
}

// ── Card de candidatura ────────────────────────────────────────────────────────

interface ApplicationCardProps {
    application: IMyApplication;
}

function ApplicationCard({ application }: ApplicationCardProps) {
    const cardBg = useColorModeValue("white", "gray.800");

    const { label, color } = getProcessStage(application);
    const companyName = application.job?.contractor ?? application.job?.user?.name ?? "—";
    const createdAt = new Date(application.created_at).toLocaleDateString("pt-BR");

    const showInterviewDate =
        application.interview &&
        (application.interview.status === "scheduled" ||
            application.interview.status === "rescheduled");

    const interviewDateFmt = showInterviewDate
        ? new Date(application.interview!.scheduled_date).toLocaleString("pt-BR", {
              dateStyle: "short",
              timeStyle: "short",
          })
        : null;

    return (
        <Box
            p="5"
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="sm"
            bg={cardBg}
            _hover={{ boxShadow: "md" }}
            transition="box-shadow 0.2s"
            borderLeft="3px solid"
            borderLeftColor={`${color}.400`}
        >
            <Flex justify="space-between" align="flex-start" flexWrap="wrap" gap="3">
                <Box flex="1">
                    <Text fontWeight="bold" color="gray.700" fontSize="md">
                        {application.job?.vacancy ?? "Vaga"}
                    </Text>
                    <Text fontSize="sm" color="gray.500" mt="1">
                        {companyName}
                    </Text>
                    <Text fontSize="xs" color="gray.400" mt="2">
                        Candidatado em {createdAt}
                    </Text>
                    {interviewDateFmt && (
                        <Text fontSize="xs" color="blue.500" mt="1" fontWeight="medium">
                            Entrevista: {interviewDateFmt}
                        </Text>
                    )}
                </Box>

                <Badge
                    colorScheme={color}
                    borderRadius="full"
                    fontSize="xs"
                    px="3"
                    py="1"
                    alignSelf="center"
                    textAlign="center"
                >
                    {label}
                </Badge>
            </Flex>
        </Box>
    );
}

// ── Página ─────────────────────────────────────────────────────────────────────

export default function MyApplications(): JSX.Element {
    const [userId, setUserId] = useState("");

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

    const { data: applications = [], isLoading } = useMyApplicationsCandidate(userId, {
        enabled: !!userId,
    });

    return (
        <Flex direction="column" minH="100vh">
            <Helmet>
                <title>Minhas candidaturas</title>
                <link rel="icon" href="/Img/logos/GoodworkSSlogan.png" type="image/png" />
            </Helmet>
            <Header />

            <Flex w="100%" my="8" maxWidth={1480} mx="auto" px="4">
                <Sidebar />

                <Box w="100%">
                    <Text fontSize="2xl" fontWeight="bold" color="gray.700" mb="6">
                        Minhas candidaturas
                    </Text>

                    {isLoading && (
                        <Flex justify="center" mt="16">
                            <Spinner size="xl" color="blue.500" />
                        </Flex>
                    )}

                    {!isLoading && applications.length === 0 && (
                        <Alert status="info" borderRadius="md">
                            <AlertIcon />
                            Você ainda não se candidatou a nenhuma vaga.
                        </Alert>
                    )}

                    {!isLoading && (
                        <Stack spacing="4">
                            {applications.map((application) => (
                                <ApplicationCard key={application.id} application={application} />
                            ))}
                        </Stack>
                    )}
                </Box>
            </Flex>
        </Flex>
    );
}
