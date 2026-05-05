import React, { useState } from "react";
import {
    Badge,
    Box,
    Button,
    Flex,
    FormLabel,
    Icon,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Stack,
    Tab,
    TabList,
    Tabs,
    Text,
    useDisclosure,
    useToast,
    useColorModeValue,
    Alert,
    AlertIcon,
} from "@chakra-ui/react";
import { Input } from "@/components/Form/Input";
import { Textarea } from "@/components/Form/TextArea";
import { Select } from "@/components/Form/SelectCategory";
import { Helmet } from "react-helmet";
import { Header } from "@/components/Header/Header";
import { Sidebar } from "@/components/Sidebar";
import { withSSRAuth } from "@/shared/withSSRAuth";
import { useAllApplicationsVacancy } from "@/services/hooks/applications/useAllApplicationsVacancyCompany";
import { useMyInterviews, IInterview } from "@/services/hooks/Interviews/useMyInterviews";
import { useMutation, useQueries } from "react-query";
import { api } from "@/services/apiClient";
import { queryClient } from "@/services/queryClient";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { GoCheckCircleFill, GoXCircleFill } from "react-icons/go";
import { MdOutlineEventAvailable } from "react-icons/md";
import { FiCalendar } from "react-icons/fi";
import { IApplicationsVacancyCompany } from "@/services/hooks/applications/useAllApplicationsVacancyCompany";

export const getServerSideProps = withSSRAuth(async () => {
    return { props: {} };
}, "company");

type FilterStatus = "all" | "scheduled" | "completed" | "cancelled";

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

interface IInterviewWithCandidate extends IInterview {
    candidate_name: string;
    candidate_email: string;
    application_id: string;
}

interface IRescheduleForm {
    scheduled_date: string;
    duration_minutes: number;
    interview_type: "presencial" | "online";
    location?: string;
    meeting_link?: string;
    interviewer_name: string;
    interviewer_email: string;
    notes: string;
    notice: string;
}

interface ICancelForm {
    notice: string;
}

// ── Modal de remarcar ──────────────────────────────────────────────────────────

interface RescheduleModalProps {
    interview: IInterviewWithCandidate;
    isOpen: boolean;
    onClose: () => void;
}

function RescheduleModal({ interview, isOpen, onClose }: RescheduleModalProps) {
    const toast = useToast();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<IRescheduleForm>({
        defaultValues: {
            scheduled_date: interview.scheduled_date.slice(0, 16),
            duration_minutes: interview.duration_minutes,
            interview_type: interview.interview_type,
            location: interview.location ?? "",
            meeting_link: interview.meeting_link ?? "",
            interviewer_name: interview.interviewer_name,
            interviewer_email: interview.interviewer_email,
            notes: "",
            notice: "",
        },
    });

    const interviewType = watch("interview_type");

    const reschedule = useMutation(
        async (data: IRescheduleForm) => {
            await api.patch("interview/rescheduleInterview", {
                interview_id: interview.id,
                scheduled_date: data.scheduled_date,
                duration_minutes: Number(data.duration_minutes),
                interview_type: data.interview_type,
                location: data.interview_type === "presencial" ? data.location : null,
                meeting_link: data.interview_type === "online" ? data.meeting_link : null,
                interviewer_name: data.interviewer_name,
                interviewer_email: data.interviewer_email,
                notes: data.notes,
                notice: data.notice,
            });
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["interview/searchAllInterview", interview.application_id]);
                toast({
                    description: "Entrevista remarcada com sucesso",
                    status: "success",
                    position: "top",
                    duration: 4000,
                    isClosable: true,
                });
                onClose();
            },
            onError: (error: any) => {
                toast({
                    description: error?.response?.data?.message ?? "Erro ao remarcar entrevista",
                    status: "error",
                    position: "top",
                    duration: 4000,
                    isClosable: true,
                });
            },
        }
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Remarcar entrevista</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text fontSize="sm" color="gray.500" mb="4">
                        Candidato: <strong>{interview.candidate_name}</strong>
                    </Text>
                    <Stack spacing="4">
                        <Box>
                            <FormLabel color="blue.600" fontSize="sm">Nova data e hora</FormLabel>
                            <Input
                                type="datetime-local"
                                border="1px solid"
                                borderColor="rgba(0, 0, 255, 0.2)"
                                error={errors.scheduled_date}
                                {...register("scheduled_date", { required: "Campo obrigatório" })}
                            />
                        </Box>
                        <Box>
                            <FormLabel color="blue.600" fontSize="sm">Duração (minutos)</FormLabel>
                            <Input
                                type="number"
                                border="1px solid"
                                borderColor="rgba(0, 0, 255, 0.2)"
                                error={errors.duration_minutes}
                                {...register("duration_minutes", { required: "Campo obrigatório", min: 1 })}
                            />
                        </Box>
                        <Box>
                            <FormLabel color="blue.600" fontSize="sm">Tipo de entrevista</FormLabel>
                            <Select
                                border="1px solid"
                                borderColor="rgba(0, 0, 255, 0.2)"
                                error={errors.interview_type}
                                options={[
                                    { value: "presencial", label: "Presencial" },
                                    { value: "online", label: "Online" },
                                ]}
                                {...register("interview_type", { required: "Campo obrigatório" })}
                            />
                        </Box>
                        {interviewType === "presencial" && (
                            <Box>
                                <FormLabel color="blue.600" fontSize="sm">Local</FormLabel>
                                <Input
                                    border="1px solid"
                                    borderColor="rgba(0, 0, 255, 0.2)"
                                    error={errors.location}
                                    {...register("location", { required: "Informe o local" })}
                                />
                            </Box>
                        )}
                        {interviewType === "online" && (
                            <Box>
                                <FormLabel color="blue.600" fontSize="sm">Link da reunião</FormLabel>
                                <Input
                                    border="1px solid"
                                    borderColor="rgba(0, 0, 255, 0.2)"
                                    error={errors.meeting_link}
                                    {...register("meeting_link", { required: "Informe o link" })}
                                />
                            </Box>
                        )}
                        <Box>
                            <FormLabel color="blue.600" fontSize="sm">Nome do entrevistador</FormLabel>
                            <Input
                                border="1px solid"
                                borderColor="rgba(0, 0, 255, 0.2)"
                                error={errors.interviewer_name}
                                {...register("interviewer_name", { required: "Campo obrigatório" })}
                            />
                        </Box>
                        <Box>
                            <FormLabel color="blue.600" fontSize="sm">E-mail do entrevistador</FormLabel>
                            <Input
                                type="email"
                                border="1px solid"
                                borderColor="rgba(0, 0, 255, 0.2)"
                                error={errors.interviewer_email}
                                {...register("interviewer_email", { required: "Campo obrigatório" })}
                            />
                        </Box>
                        <Box>
                            <FormLabel color="blue.600" fontSize="sm">Observação</FormLabel>
                            <Input
                                border="1px solid"
                                borderColor="rgba(0, 0, 255, 0.2)"
                                error={errors.notes}
                                {...register("notes")}
                            />
                        </Box>
                        <Box>
                            <FormLabel color="blue.600" fontSize="sm">
                                Aviso ao candidato{" "}
                                <Text as="span" color="red.500" fontSize="xs">*</Text>
                            </FormLabel>
                            <Textarea
                                placeholder="Descreva o motivo do reagendamento para o candidato..."
                                error={errors.notice}
                                {...register("notice", { required: "Informe o motivo do reagendamento" })}
                            />
                        </Box>
                    </Stack>
                </ModalBody>
                <ModalFooter gap="3">
                    <Button
                        colorScheme="blue"
                        isLoading={reschedule.isLoading}
                        onClick={handleSubmit((data) => reschedule.mutate(data))}
                    >
                        Confirmar
                    </Button>
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

// ── Modal de cancelar ─────────────────────────────────────────────────────────

interface CancelModalProps {
    interview: IInterviewWithCandidate;
    isOpen: boolean;
    onClose: () => void;
}

function CancelModal({ interview, isOpen, onClose }: CancelModalProps) {
    const toast = useToast();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ICancelForm>();

    const cancel = useMutation(
        async (data: ICancelForm) => {
            await api.patch("interview/cancelInterview", {
                interview_id: interview.id,
                notice: data.notice,
            });
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["interview/searchAllInterview", interview.application_id]);
                toast({
                    description: "Entrevista cancelada com sucesso",
                    status: "success",
                    position: "top",
                    duration: 4000,
                    isClosable: true,
                });
                reset();
                onClose();
            },
            onError: (error: any) => {
                toast({
                    description: error?.response?.data?.message ?? "Erro ao cancelar entrevista",
                    status: "error",
                    position: "top",
                    duration: 4000,
                    isClosable: true,
                });
            },
        }
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Cancelar entrevista</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text fontSize="sm" color="gray.500" mb="4">
                        Candidato: <strong>{interview.candidate_name}</strong>
                    </Text>
                    <Box>
                        <FormLabel color="blue.600" fontSize="sm">
                            Motivo do cancelamento{" "}
                            <Text as="span" color="red.500" fontSize="xs">*</Text>
                        </FormLabel>
                        <Textarea
                            placeholder="Descreva o motivo do cancelamento para o candidato..."
                            error={errors.notice}
                            {...register("notice", { required: "Informe o motivo do cancelamento" })}
                        />
                    </Box>
                </ModalBody>
                <ModalFooter gap="3">
                    <Button
                        colorScheme="red"
                        isLoading={cancel.isLoading}
                        onClick={handleSubmit((data) => cancel.mutate(data))}
                    >
                        Confirmar cancelamento
                    </Button>
                    <Button variant="outline" onClick={onClose}>
                        Voltar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

// ── Card de entrevista ─────────────────────────────────────────────────────────

interface InterviewCardProps {
    interview: IInterviewWithCandidate;
}

function InterviewCard({ interview }: InterviewCardProps) {
    const router = useRouter();
    const toast = useToast();
    const cardBg = useColorModeValue("gray.50", "gray.800");
    const { isOpen: isRescheduleOpen, onOpen: onRescheduleOpen, onClose: onRescheduleClose } = useDisclosure();
    const { isOpen: isCancelOpen, onOpen: onCancelOpen, onClose: onCancelClose } = useDisclosure();

    const updateStatus = useMutation(
        async ({ interview_id, status }: { interview_id: string; status: string }) => {
            await api.patch("interview/updateStatus", { interview_id, status });
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["interview/searchAllInterview", interview.application_id]);
                toast({
                    description: "Status atualizado com sucesso",
                    status: "success",
                    position: "top",
                    duration: 4000,
                    isClosable: true,
                });
            },
            onError: (error: any) => {
                toast({
                    description: error?.response?.data?.message ?? "Erro ao atualizar status",
                    status: "error",
                    position: "top",
                    duration: 4000,
                    isClosable: true,
                });
            },
        }
    );

    return (
        <>
            <Box
                p="5"
                borderWidth="1px"
                borderRadius="lg"
                boxShadow="sm"
                _hover={{ boxShadow: "md" }}
                transition="box-shadow 0.2s"
                opacity={interview.status === "cancelled" ? 0.6 : 1}
                borderLeft="3px solid"
                borderLeftColor={`${statusColor[interview.status] ?? "gray"}.400`}
                bg={cardBg}
            >
                <Flex justify="space-between" align="flex-start" flexWrap="wrap" gap="4">
                    <Box flex="1">
                        <Flex align="center" gap="2" mb="2">
                            <Text fontWeight="bold" color="gray.700">
                                {interview.candidate_name}
                            </Text>
                            <Badge
                                colorScheme={interview.interview_type === "online" ? "purple" : "orange"}
                                borderRadius="full"
                                fontSize="xs"
                            >
                                {interview.interview_type}
                            </Badge>
                            <Badge
                                colorScheme={statusColor[interview.status] ?? "gray"}
                                borderRadius="full"
                                fontSize="xs"
                            >
                                {statusLabel[interview.status] ?? interview.status}
                            </Badge>
                        </Flex>

                        <Text fontSize="sm" color="gray.500" mb="1">
                            {interview.candidate_email}
                        </Text>

                        <Text fontSize="sm" color="blue.600" fontWeight="medium">
                            {new Date(interview.scheduled_date).toLocaleString("pt-BR", {
                                dateStyle: "short",
                                timeStyle: "short",
                            })}
                            {" · "}
                            {interview.duration_minutes} min
                            {" · "}
                            Entrevistador: {interview.interviewer_name}
                        </Text>

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
                        {interview.notes && (
                            <Text fontSize="xs" color="gray.400" fontStyle="italic" mt="1">
                                Obs: {interview.notes}
                            </Text>
                        )}
                        {interview.notice && (
                            <Text fontSize="xs" color="orange.500" fontStyle="italic" mt="1">
                                Aviso: {interview.notice}
                            </Text>
                        )}
                    </Box>

                    <Flex direction="column" gap="2" minW="150px">
                        {(interview.status === "scheduled" || interview.status === "rescheduled") && (
                            <>
                                <Button
                                    variant="ghost"
                                    leftIcon={<Icon as={FiCalendar} color="blue" />}
                                    size="xs"
                                    onClick={onRescheduleOpen}
                                >
                                    Remarcar
                                </Button>
                                <Button
                                    variant="ghost"
                                    leftIcon={<Icon as={GoCheckCircleFill} color="green" />}
                                    size="xs"
                                    isLoading={updateStatus.isLoading}
                                    onClick={() =>
                                        updateStatus.mutate({ interview_id: interview.id, status: "completed" })
                                    }
                                >
                                    Marcar como realizada
                                </Button>
                                <Button
                                    variant="ghost"
                                    leftIcon={<Icon as={GoXCircleFill} color="red" />}
                                    size="xs"
                                    onClick={onCancelOpen}
                                >
                                    Cancelar entrevista
                                </Button>
                            </>
                        )}
                        {interview.status === "cancelled" && (
                            <Button
                                variant="ghost"
                                leftIcon={<Icon as={MdOutlineEventAvailable} color="blue" />}
                                size="xs"
                                onClick={() => router.push("/interviews/create")}
                            >
                                Reagendar
                            </Button>
                        )}
                    </Flex>
                </Flex>
            </Box>

            <RescheduleModal interview={interview} isOpen={isRescheduleOpen} onClose={onRescheduleClose} />
            <CancelModal interview={interview} isOpen={isCancelOpen} onClose={onCancelClose} />
        </>
    );
}

// ── Página ─────────────────────────────────────────────────────────────────────

export default function ManageInterviews(): JSX.Element {
    const router = useRouter();
    const cardBg = useColorModeValue("gray.50", "gray.800");
    const { job_id } = router.query;
    const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");

    const { data: applicationsData, isLoading: isLoadingApps } = useAllApplicationsVacancy(
        job_id as string
    );

    const approvedApplications = applicationsData?.filter(
        (a) => a.application_approved === true
    ) ?? [];

    const interviewQueries = useQueries(
        approvedApplications.map((app) => ({
            queryKey: ["interview/searchAllInterview", app.id],
            queryFn: () =>
                api
                    .get("interview/searchAllInterview", { params: { application_id: app.id } })
                    .then((r) => r.data),
            enabled: approvedApplications.length > 0,
            staleTime: 1000 * 60 * 5,
        }))
    );

    const isLoadingInterviews = interviewQueries.some((q) => q.isLoading);
    const isLoading = isLoadingApps || isLoadingInterviews;

    const allInterviews: IInterviewWithCandidate[] = interviewQueries.flatMap((q, i) => {
        const data: any[] = Array.isArray(q.data) ? q.data : [];
        const app = approvedApplications[i];
        return data.map((interview) => ({
            ...interview,
            candidate_name: app?.user?.name ?? "—",
            candidate_email: app?.user?.email ?? "",
            application_id: app?.id ?? "",
        }));
    });

    const sorted = [...allInterviews].sort(
        (a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime()
    );

    const counts = {
        all: sorted.length,
        scheduled: sorted.filter((i) => i.status === "scheduled" || i.status === "rescheduled").length,
        completed: sorted.filter((i) => i.status === "completed").length,
        cancelled: sorted.filter((i) => i.status === "cancelled").length,
    };

    const filtered =
        activeFilter === "all"
            ? sorted
            : activeFilter === "scheduled"
            ? sorted.filter((i) => i.status === "scheduled" || i.status === "rescheduled")
            : sorted.filter((i) => i.status === activeFilter);

    const filterTabs: { key: FilterStatus; label: string }[] = [
        { key: "all", label: `Todas (${counts.all})` },
        { key: "scheduled", label: `Agendadas (${counts.scheduled})` },
        { key: "completed", label: `Realizadas (${counts.completed})` },
        { key: "cancelled", label: `Canceladas (${counts.cancelled})` },
    ];

    return (
        <Flex direction="column" minH="100vh">
            <Helmet>
                <title>Gerenciar entrevistas</title>
                <link rel="icon" href="/Img/logos/GoodworkSSlogan.png" type="image/png" />
            </Helmet>
            <Header />

            <Flex w="100%" my="8" maxWidth={1480} mx="auto" px="4">
                <Sidebar />

                <Box w="100%">
                    <Flex justify="space-between" align="center" mb="6">
                        <Text fontSize="2xl" fontWeight="bold" color="gray.700">
                            Gerenciar entrevistas
                        </Text>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push("/interviews/my-interviews")}
                        >
                            ← Voltar para vagas
                        </Button>
                    </Flex>

                    <Tabs
                        mb="6"
                        colorScheme="blue"
                        onChange={(index) => setActiveFilter(filterTabs[index].key)}
                    >
                        <TabList>
                            {filterTabs.map((tab) => (
                                <Tab key={tab.key}>{tab.label}</Tab>
                            ))}
                        </TabList>
                    </Tabs>

                    {isLoading && (
                        <Flex justify="center" mt="16">
                            <Spinner size="xl" color="blue.500" />
                        </Flex>
                    )}

                    {!isLoading && filtered.length === 0 && (
                        <Alert status="info">
                            <AlertIcon />
                            Nenhuma entrevista encontrada.
                        </Alert>
                    )}

                    {!isLoading && (
                        <Stack spacing="4">
                            {filtered.map((interview) => (
                                <InterviewCard key={interview.id} interview={interview} />
                            ))}
                        </Stack>
                    )}
                </Box>
            </Flex>
        </Flex>
    );
}
