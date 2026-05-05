import React, { useEffect, useState } from "react";
import {
    Alert,
    AlertIcon,
    Badge,
    Box,
    Divider,
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
import { useMyApplicationsCandidate } from "@/services/hooks/applications/useMyApplicationsCandidate";
import { useQueries } from "react-query";
import { api } from "@/services/apiClient";
import { parseCookies } from "nookies";
import decode from "jwt-decode";
import { markInterviewsAsSeen } from "@/utils/interviewSeenState";

export const getServerSideProps = withSSRAuth(async () => {
    return { props: {} };
}, "individual");

interface DecodedToken {
    sub: string;
}

interface IInterviewWithContext {
    id: string;
    application_id: string;
    interview_type: "presencial" | "online";
    scheduled_date: string;
    duration_minutes: number;
    location?: string;
    meeting_link?: string;
    interviewer_name: string;
    interviewer_email: string;
    notes?: string;
    notice?: string;
    status: "scheduled" | "rescheduled" | "completed" | "cancelled";
    created_at: string;
    application?: {
        application_approved: boolean | null;
        hired: boolean | null;
        job?: {
            vacancy: string;
            contractor: string | null;
            user?: { name: string };
        };
    };
}

const statusLabel: Record<string, string> = {
    scheduled: "Agendada",
    completed: "Realizada",
    cancelled: "Cancelada",
    rescheduled: "Reagendada",
};

const statusColor: Record<string, string> = {
    scheduled: "blue",
    completed: "green",
    cancelled: "red",
    rescheduled: "yellow",
};

async function getMyInterview(application_id: string): Promise<IInterviewWithContext | null> {
    const { data } = await api.get("interview/myInterview", {
        params: { application_id },
    });
    return data ?? null;
}

// ── Card de entrevista ─────────────────────────────────────────────────────────

interface InterviewCardProps {
    interview: IInterviewWithContext;
}

function InterviewCard({ interview }: InterviewCardProps) {
    const cardBg = useColorModeValue("white", "gray.800");

    const dateFmt = new Date(interview.scheduled_date).toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    });

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
            borderLeftColor={`${statusColor[interview.status] ?? "gray"}.400`}
        >
            {/* Cabeçalho */}
            <Flex justify="space-between" align="center" mb="3" flexWrap="wrap" gap="2">
                <Box>
                    <Text fontWeight="bold" color="gray.700" fontSize="md">
                        {interview.application?.job?.vacancy ?? "Vaga"}
                    </Text>
                    {(interview.application?.job?.contractor ?? interview.application?.job?.user?.name) && (
                        <Text fontSize="sm" color="gray.500">
                            {interview.application?.job?.contractor ?? interview.application?.job?.user?.name}
                        </Text>
                    )}
                </Box>
            </Flex>

            <Divider mb="3" />

            {/* Status e tipo */}
            <Flex align="center" gap="2" mb="2">
                <Badge
                    colorScheme={statusColor[interview.status] ?? "gray"}
                    borderRadius="full"
                    fontSize="xs"
                >
                    {statusLabel[interview.status] ?? interview.status}
                </Badge>
                <Badge
                    colorScheme={interview.interview_type === "online" ? "purple" : "orange"}
                    borderRadius="full"
                    fontSize="xs"
                >
                    {interview.interview_type}
                </Badge>
            </Flex>

            {/* Data, duração e entrevistador */}
            <Text fontSize="sm" color="blue.600" fontWeight="medium">
                {dateFmt} · {interview.duration_minutes} min · {interview.interviewer_name}
            </Text>

            {/* Local ou link */}
            {interview.location && (
                <Text fontSize="xs" color="gray.500" mt="1">
                    Local: {interview.location}
                </Text>
            )}
            {interview.meeting_link && (
                <Text fontSize="xs" color="gray.500" mt="1">
                    Link: {interview.meeting_link}
                </Text>
            )}

            {/* Observação interna */}
            {interview.notes && (
                <Text fontSize="xs" color="gray.400" fontStyle="italic" mt="2">
                    Observação: {interview.notes}
                </Text>
            )}

            {/* Aviso da empresa */}
            {interview.notice && (
                <Alert status="warning" borderRadius="md" mt="3" py="2" px="3">
                    <AlertIcon boxSize="4" />
                    <Text fontSize="xs">
                        <strong>Aviso da empresa:</strong> {interview.notice}
                    </Text>
                </Alert>
            )}

            {/* Resultado da entrevista */}
            {interview.status === "completed" && (
                <Alert
                    status={
                        interview.application?.hired === true
                            ? "success"
                            : interview.application?.hired === false
                            ? "error"
                            : "info"
                    }
                    borderRadius="md"
                    mt="3"
                    py="2"
                    px="3"
                >
                    <AlertIcon boxSize="4" />
                    <Text fontSize="xs" fontWeight="medium">
                        {interview.application?.hired === true
                            ? "Parabéns! Você foi contratado."
                            : interview.application?.hired === false
                            ? "Processo encerrado — não contratado."
                            : "Entrevista realizada — aguardando decisão da empresa."}
                    </Text>
                </Alert>
            )}
        </Box>
    );
}

// ── Página ─────────────────────────────────────────────────────────────────────

export default function CandidateInterviews(): JSX.Element {
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

    const { data: applications = [], isLoading: isLoadingApps } = useMyApplicationsCandidate(userId, {
        enabled: !!userId,
    });

    const interviewQueries = useQueries(
        applications.map((app) => ({
            queryKey: ["interview/myInterview", app.id],
            queryFn: () => getMyInterview(app.id),
            enabled: applications.length > 0,
            staleTime: 1000 * 60 * 5,
        }))
    );

    const isLoadingInterviews = interviewQueries.some((q) => q.isLoading);
    const isLoading = isLoadingApps || isLoadingInterviews;

    const interviews = interviewQueries
        .map((q) => q.data as IInterviewWithContext | null | undefined)
        .filter((item): item is IInterviewWithContext => !!item);

    useEffect(() => {
        if (!userId || isLoading || interviews.length === 0) return;
        markInterviewsAsSeen(userId, interviews);
    }, [userId, isLoading, interviews.length]);

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
                    <Text fontSize="2xl" fontWeight="bold" color="gray.700" mb="6">
                        Minhas entrevistas
                    </Text>

                    {isLoading && (
                        <Flex justify="center" mt="16">
                            <Spinner size="xl" color="blue.500" />
                        </Flex>
                    )}

                    {!isLoading && interviews.length === 0 && (
                        <Alert status="info" borderRadius="md">
                            <AlertIcon />
                            Você ainda não tem entrevistas agendadas.
                        </Alert>
                    )}

                    {!isLoading && (
                        <Stack spacing="4">
                            {interviews.map((interview) => (
                                <InterviewCard key={interview.id} interview={interview} />
                            ))}
                        </Stack>
                    )}
                </Box>
            </Flex>
        </Flex>
    );
}
