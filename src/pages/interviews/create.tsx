import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Select as ChakraSelect,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/Header/Header";
import { Sidebar } from "@/components/Sidebar";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "@/components/Form/Input";
import { Textarea } from "@/components/Form/TextArea";
import { Select } from "@/components/Form/SelectCategory";
import { useMutation } from "react-query";
import { api } from "@/services/apiClient";
import { queryClient } from "@/services/queryClient";
import { withSSRAuth } from "@/shared/withSSRAuth";
import { useAllJobsCompany } from "@/services/hooks/Jobs/useAllJobsCompany";
import { useAllApplicationsVacancy } from "@/services/hooks/applications/useAllApplicationsVacancyCompany";
import { useInterviewsForApplications } from "@/services/hooks/Interviews/useInterviewsForApplications";
import { parseCookies } from "nookies";
import decode from "jwt-decode";
import Link from "next/link";

interface DecodedToken {
    sub: string;
}

interface ICreateInterview {
    application_id: string;
    interview_type: string;
    scheduled_date: string;
    duration_minutes: number;
    interviewer_name: string;
    interviewer_email: string;
    location?: string;
    meeting_link?: string;
    notes?: string;
}

const schema = yup.object().shape({
    application_id: yup.string().required("Selecione uma candidatura"),
    interview_type: yup.string().required("Campo obrigatório"),
    scheduled_date: yup.string().required("Data de agendamento é obrigatória"),
    duration_minutes: yup
        .number()
        .typeError("Informe um número válido")
        .required("Campo obrigatório")
        .min(1, "Mínimo 1 minuto"),
    location: yup.string().when("interview_type", {
        is: "presencial",
        then: (s) => s.required("Informe o local da entrevista"),
        otherwise: (s) => s.optional(),
    }),
    meeting_link: yup.string().when("interview_type", {
        is: "online",
        then: (s) => s.required("Informe o link da reunião"),
        otherwise: (s) => s.optional(),
    }),
    interviewer_name: yup.string().required("Campo obrigatório"),
    interviewer_email: yup
        .string()
        .email("E-mail inválido")
        .required("Campo obrigatório"),
    notes: yup.string().optional(),
});

export const getServerSideProps = withSSRAuth(async () => {
    return { props: {} };
}, "company");

export default function CreateInterview(): JSX.Element {
    const [isClient, setIsClient] = useState(false);
    const [userId, setUserId] = useState("");
    const [selectedJobId, setSelectedJobId] = useState("");
    const toast = useToast();

    const { register, formState, handleSubmit, watch, setValue, reset } = useForm({
        resolver: yupResolver(schema),
    });
    const { errors } = formState;
    const interviewType = watch("interview_type");

    const { data: jobsData, isLoading: isLoadingJobs } = useAllJobsCompany(userId);
    const { data: applications, isLoading: isLoadingApplications } = useAllApplicationsVacancy(selectedJobId);

    const approvedApplicationIds = applications
        ?.filter((a) => a.application_approved === true)
        .map((a) => a.id) ?? [];

    const { data: scheduledApplicationIds = new Set<string>() } = useInterviewsForApplications(approvedApplicationIds);

    useEffect(() => {
        setIsClient(true);
        const cookies = parseCookies();
        const token = cookies["token.token"];
        if (token) {
            try {
                const decoded = decode<DecodedToken>(token);
                setUserId(decoded.sub);
            } catch {}
        }
    }, []);

    const createInterview = useMutation(
        async (data: ICreateInterview) => {
            const response = await api.post("interview", data);
            return response.data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries("interview");
                reset();
                setSelectedJobId("");
                toast({
                    description: "Entrevista marcada com sucesso",
                    status: "success",
                    position: "top",
                    duration: 8000,
                    isClosable: true,
                });
            },
            onError: (error: any) => {
                toast({
                    description: error?.response?.data?.message ?? "Erro ao marcar entrevista",
                    status: "error",
                    position: "top",
                    duration: 8000,
                    isClosable: true,
                });
            },
        },
    );

    const handleCreate: SubmitHandler<ICreateInterview> = async (formData) => {
        await createInterview.mutateAsync(formData);
    };

    return (
        <Flex direction="column" minH="100vh" as="form" onSubmit={handleSubmit(handleCreate)}>
            <Helmet>
                <title>Marcar entrevista</title>
                <link rel="icon" href="/Img/logos/GoodworkSSlogan.png" type="image/png" />
            </Helmet>
            <Header />

            <Flex w="100%" my="8" maxWidth={1480} mx="auto" px="4">
                <Sidebar />
                <Flex justify="center" align="center" height="100%" width="100%">
                    <Box p={8} borderWidth="1px" borderRadius="lg" width="70%">
                        <VStack spacing={4}>
                            <Grid
                                pt="1%"
                                gap="4"
                                templateAreas={`
                                    "job job"
                                    "application application"
                                    "type type"
                                    "date duration"
                                    "location link"
                                    "name email"
                                    "notes notes"
                                `}
                                gridTemplateColumns="1fr 1fr"
                                w="100%"
                            >
                                <GridItem area="job">
                                    <FormLabel color="blue.600">Vaga</FormLabel>
                                    {isClient && (
                                        <ChakraSelect
                                            placeholder="Selecione uma vaga"
                                            borderColor="rgba(0, 0, 255, 0.2)"
                                            borderRadius="full"
                                            bgColor="gray.100"
                                            size="lg"
                                            isDisabled={isLoadingJobs || !userId}
                                            onChange={(e) => {
                                                setSelectedJobId(e.target.value);
                                                setValue("application_id", "");
                                            }}
                                        >
                                            {jobsData?.jobs.map((job) => (
                                                <option key={job.id} value={job.id}>
                                                    {job.vacancy}
                                                </option>
                                            ))}
                                        </ChakraSelect>
                                    )}
                                </GridItem>

                                <GridItem area="application">
                                    <FormControl isInvalid={!!errors.application_id}>
                                        <FormLabel color="blue.600">Candidato</FormLabel>
                                        {isClient && (
                                            <ChakraSelect
                                                placeholder={
                                                    !selectedJobId
                                                        ? "Selecione uma vaga primeiro"
                                                        : isLoadingApplications
                                                        ? "Carregando candidatos..."
                                                        : applications?.filter(a => a.application_approved === true && !scheduledApplicationIds.has(a.id)).length === 0
                                                        ? "Nenhum candidato disponível"
                                                        : "Selecione o candidato"
                                                }
                                                borderColor="rgba(0, 0, 255, 0.2)"
                                                borderRadius="full"
                                                bgColor="gray.100"
                                                size="lg"
                                                isDisabled={!selectedJobId || isLoadingApplications}
                                                {...register("application_id")}
                                            >
                                                {applications
                                                ?.filter((app) => app.application_approved === true && !scheduledApplicationIds.has(app.id))
                                                .map((app) => (
                                                    <option key={app.id} value={app.id}>
                                                        {app.user?.name} — {app.user?.email}
                                                    </option>
                                                ))}
                                            </ChakraSelect>
                                        )}
                                        {errors.application_id && (
                                            <FormErrorMessage>
                                                {errors.application_id.message}
                                            </FormErrorMessage>
                                        )}
                                    </FormControl>
                                </GridItem>

                                <GridItem area="type">
                                    <FormLabel color="blue.600">Tipo de entrevista</FormLabel>
                                    {isClient && (
                                        <Select
                                            border="1px solid"
                                            borderColor="rgba(0, 0, 255, 0.2)"
                                            error={errors.interview_type}
                                            options={[
                                                { key: "", value: "", label: "Selecione o tipo", disabled: true },
                                                { key: "presencial", value: "presencial", label: "Presencial" },
                                                { key: "online", value: "online", label: "Online" },
                                            ]}
                                            {...register("interview_type")}
                                        />
                                    )}
                                </GridItem>

                                <GridItem area="date">
                                    <FormLabel color="blue.600">Data e hora</FormLabel>
                                    <Input
                                        border="1px solid"
                                        borderColor="rgba(0, 0, 255, 0.2)"
                                        type="datetime-local"
                                        error={errors.scheduled_date}
                                        {...register("scheduled_date")}
                                    />
                                </GridItem>

                                <GridItem area="duration">
                                    <FormLabel color="blue.600">Duração (minutos)</FormLabel>
                                    <Input
                                        border="1px solid"
                                        borderColor="rgba(0, 0, 255, 0.2)"
                                        type="number"
                                        error={errors.duration_minutes}
                                        {...register("duration_minutes")}
                                    />
                                </GridItem>

                                <GridItem area="location">
                                    <FormLabel color="blue.600">Local</FormLabel>
                                    <Input
                                        border="1px solid"
                                        borderColor="rgba(0, 0, 255, 0.2)"
                                        isDisabled={interviewType === "online"}
                                        error={errors.location}
                                        {...register("location")}
                                    />
                                </GridItem>

                                <GridItem area="link">
                                    <FormLabel color="blue.600">Link da reunião</FormLabel>
                                    <Input
                                        border="1px solid"
                                        borderColor="rgba(0, 0, 255, 0.2)"
                                        isDisabled={interviewType === "presencial"}
                                        error={errors.meeting_link}
                                        {...register("meeting_link")}
                                    />
                                </GridItem>

                                <GridItem area="name">
                                    <FormLabel color="blue.600">Nome do entrevistador</FormLabel>
                                    <Input
                                        border="1px solid"
                                        borderColor="rgba(0, 0, 255, 0.2)"
                                        error={errors.interviewer_name}
                                        {...register("interviewer_name")}
                                    />
                                </GridItem>

                                <GridItem area="email">
                                    <FormLabel color="blue.600">E-mail do entrevistador</FormLabel>
                                    <Input
                                        border="1px solid"
                                        borderColor="rgba(0, 0, 255, 0.2)"
                                        type="email"
                                        error={errors.interviewer_email}
                                        {...register("interviewer_email")}
                                    />
                                </GridItem>

                                <GridItem area="notes">
                                    <FormLabel color="blue.600">Observações</FormLabel>
                                    <Textarea
                                        border="1px solid"
                                        borderColor="rgba(0, 0, 255, 0.2)"
                                        placeholder="Observações sobre a entrevista (opcional)"
                                        error={errors.notes}
                                        {...register("notes")}
                                    />
                                </GridItem>
                            </Grid>
                        </VStack>

                        <Flex width="100%" p="8" borderRadius={10} justify="center" gap={4}>
                            <Button
                                type="submit"
                                colorScheme="blue"
                                isLoading={formState.isSubmitting}
                                width="200px"
                            >
                                Marcar entrevista
                            </Button>
                            <Button as={Link} href="/dashboard" colorScheme="red" width="200px">
                                Cancelar
                            </Button>
                        </Flex>
                    </Box>
                </Flex>
            </Flex>
        </Flex>
    );
}
