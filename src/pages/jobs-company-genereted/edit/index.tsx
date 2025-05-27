import React, { useEffect, useState } from 'react';
import { 
    Flex, 
    FormControl, 
    FormLabel, 
    Input, 
    SimpleGrid, 
    Text, 
    Box, 
    Button, 
    useToast, 
    Spinner, 
    Textarea,
    Select,
    Divider,
    Avatar
} from '@chakra-ui/react';
import { LuSaveAll } from 'react-icons/lu';
import { useMutation } from 'react-query';
import { api } from '@/services/apiClient';
import { queryClient } from '@/services/queryClient';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { Helmet } from "react-helmet";
import { Header } from '@/components/Header/Header';
import { Sidebar } from '@/components/Sidebar';
import { useCategories } from '@/services/hooks/Categories/useCategories';
import { parseCookies } from 'nookies';
import decode from "jwt-decode";
import Image from 'next/image';

interface IJob {
    id: string;
    vacancy: string;
    contractor: string;
    description_vacancy: string;
    requirements: string;
    workload: string;
    location: string;
    category_id: string;
    benefits: string;
    banner?: File | string | null;
    vacancy_available: boolean;
    amount_vacancy: number;
    closing_date: string;
}

interface DecodedToken {
    sub: string;
}

export default function EditJob(): JSX.Element {
    const router = useRouter();
    const { id } = router.query;
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const { handleSubmit, register, reset, watch, setValue } = useForm<IJob>();
    const { data } = useCategories(); 
    const [userId, setUserId] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        
        const cookies = parseCookies();
        const token = cookies["token.token"];

        if (token) {
            try {
                const decoded = decode<DecodedToken>(token);
                setUserId(decoded.sub);
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
            }
        }
    }, []);

    useEffect(() => {
        if (id) {
            const fetchJob = async () => {
                try {
                    const response = await api.get(`/jobs/getJob?id=${id}`);
                    const jobData = response.data;
                    
                    const closingDateBR = jobData.closing_date 
                        ? new Date(jobData.closing_date).toLocaleString('pt-BR', {
                            timeZone: 'America/Sao_Paulo',
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                          }).split(',')[0].split('/').reverse().join('-')
                        : '';
    
                    reset({
                        ...jobData,
                        closing_date: closingDateBR
                    });
                    
                    setIsLoading(false);
                } catch (error) {
                    console.error("Erro ao resgatar dados:", error);
                    toast({
                        description: "Erro ao carregar dados da vaga",
                        status: "error",
                        position: "top",
                        duration: 5000,
                        isClosable: true,
                    });
                }
            };
            fetchJob();
        }
    }, [id, reset, toast]);

    const updateJob = useMutation(
        async (formData: FormData) => {
            console.log("Dados para atualização");
            console.log(formData);
            const response = await api.patch(`/jobs/updateJob`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['job', id]);
                queryClient.invalidateQueries(["jobs/listJobsCompany", userId]); 
                toast({
                    description: "Vaga atualizada com sucesso!",
                    status: "success",
                    position: "top",
                    duration: 5000,
                    isClosable: true,
                });
                setTimeout(() => router.back(), 1000);
            },
            onError: (error: any) => {
                toast({
                    description: error.response?.data?.message || "Erro ao atualizar a vaga",
                    status: "error",
                    position: "top",
                    duration: 5000,
                    isClosable: true,
                });
            },
        },
    );
      
    const handleSubmitForm: SubmitHandler<IJob> = async (data) => {
        if (!id) {
            toast({
                description: "ID da vaga não encontrado",
                status: "error",
                position: "top",
                duration: 5000,
                isClosable: true,
            });
            return;
        }
    
        try {
            const formData = new FormData();
            const agoraBR = new Date();
            const agoraISO = agoraBR.toISOString();

            for(const [key, value] of Object.entries(data)){
                if (value === undefined || value === null) continue;
                
                if (key === "banner") {
                    if (value instanceof File) {
                        console.log("Tem um novo arquivo")
                        formData.append(key, value);
                    } else if (typeof value === "string") {
                        console.log("Não tem um novo arquivo")
                        console.log(value)
                        formData.append(key, value);
                    }
                } else if (key === "closing_date") {
                    const date = new Date(`${value}T00:00:00-00:00`);
                    formData.append(key, date.toISOString());
                } else if (key === "vacancy_available") {
                    formData.append(key, value ? "true" : "false");
                } else {
                    formData.append(key, value.toString());
                }
            }

            formData.append("job_id", id as string);    
            formData.append("updated_at", agoraISO);

            await updateJob.mutateAsync(formData);
        } catch (error) {
            console.error("Erro na submissão:", error);
            toast({
                description: "Erro ao atualizar a vaga",
                status: "error",
                position: "top",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleCancel = () => {
        router.back();
    };

    if (isLoading) {
        return (
            <Flex justify="center" align="center" h="100vh">
                <Spinner size="xl" color="blue.500" />
            </Flex>
        );
    }

    return (
        <Flex direction="column" h="100vh" as="form" onSubmit={handleSubmit(handleSubmitForm)}>
            <Helmet>
                <title>Dashboard</title>
                <link rel="icon" href="/Img/logos/GoodworkSSlogan.png" type="image/png"/>
            </Helmet>
            <Header/>

            <Flex w="100%" my="8" maxWidth={1480} mx="auto" px="4">
                <Sidebar/>
                <SimpleGrid
                    gap="2"
                    w="100%"
                    flex="1"
                    minChildWidth={[200, 250]}
                >
                    <Flex
                        width="100%"
                        maxWidth={1050}
                        bg="white"
                        p="8"
                        borderRadius={10}
                        boxShadow="dark-lg"
                        flexDirection="column"
                        mx="auto"
                        my={8}
                    >
                        <Flex align="center" mb={8}>
                            <Box position="relative" w="200px" h="200px">
                                {watch("banner") && typeof watch("banner") === "string" ? (
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_API_URL}/banners/${watch("banner")}`}
                                        alt="Banner atual"
                                        layout="fill"
                                        objectFit="cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = "/Img/icons/bannerVaga.png";
                                        }}
                                    />
                                ) : (
                                    <Avatar
                                        size="full"
                                        src="/Img/icons/bannerVaga.png"
                                        boxShadow="lg"
                                    />
                                )}
                            </Box>
                            <Box ml={4} flex={1}>
                                <Input
                                    {...register("vacancy")}
                                    fontSize="4xl"
                                    fontWeight="bold"
                                    color="blue.800"
                                    variant="unstyled"
                                    placeholder="Título da vaga"
                                    mb={2}
                                />
                                <Select
                                    {...register("vacancy_available", { setValueAs: (v) => v === "true" })}
                                    width="150px"
                                    bg="white"
                                    borderColor="blue.300"
                                    focusBorderColor="blue.500"
                                >
                                    <option value="true">Vaga Ativa</option>
                                    <option value="false">Vaga Inativa</option>
                                </Select>
                            </Box>
                        </Flex>

                        <Divider mb={8} />

                        <Flex direction="column" gap={6} mb={8}>
                            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                                <FormControl>
                                    <FormLabel color="blue.600">Empresa Contratante</FormLabel>
                                    <Input
                                        {...register("contractor")}
                                        bg="white"
                                        borderColor="blue.300"
                                        focusBorderColor="blue.500"
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel color="blue.600">Localização</FormLabel>
                                    <Input
                                        {...register("location")}
                                        bg="white"
                                        borderColor="blue.300"
                                        focusBorderColor="blue.500"
                                    />
                                </FormControl>
                            
                                <FormControl>
                                    <FormLabel color="blue.600">Categoria</FormLabel>
                                    <Select
                                        {...register("category_id")}
                                        bg="white"
                                        borderColor="blue.300"
                                        focusBorderColor="blue.500"
                                        placeholder="Selecione uma categoria"
                                    >
                                        {data?.categories?.map((category) => (
                                            <option 
                                                key={category.id} 
                                                value={category.id}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </Select>
                                </FormControl>
                            </SimpleGrid>
                            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                                <FormControl>
                                    <FormLabel color="blue.600">Carga Horária</FormLabel>
                                    <Input
                                        {...register("workload")}
                                        bg="white"
                                        borderColor="blue.300"
                                        focusBorderColor="blue.500"
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel color="blue.600">Quantidade de Vagas</FormLabel>
                                    <Input
                                        {...register("amount_vacancy")}
                                        type="number"
                                        bg="white"
                                        borderColor="blue.300"
                                        focusBorderColor="blue.500"
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel color="blue.600">Data de Encerramento</FormLabel>
                                    <Input
                                        {...register("closing_date")}
                                        type="date"
                                        bg="white"
                                        borderColor="blue.300"
                                        focusBorderColor="blue.500"
                                    />
                                </FormControl>
                            </SimpleGrid>
                        </Flex>

                        <FormControl mb={6}>
                            <FormLabel color="blue.600">Descrição da Vaga</FormLabel>
                            <Textarea
                                {...register("description_vacancy")}
                                bg="white"
                                borderColor="blue.300"
                                focusBorderColor="blue.500"
                                minH="150px"
                            />
                        </FormControl>

                        <FormControl mb={6}>
                            <FormLabel color="blue.600">Requisitos</FormLabel>
                            <Textarea
                                {...register("requirements")}
                                bg="white"
                                borderColor="blue.300"
                                focusBorderColor="blue.500"
                                minH="150px"
                                placeholder="Liste os requisitos separados por vírgula"
                            />
                        </FormControl>

                        <FormControl mb={6}>
                            <FormLabel color="blue.600">Benefícios</FormLabel>
                            <Textarea
                                {...register("benefits")}
                                bg="white"
                                borderColor="blue.300"
                                focusBorderColor="blue.500"
                                minH="150px"
                                placeholder="Liste os benefícios separados por vírgula"
                            />
                        </FormControl>

                        <FormControl mb={6}>
                            <FormLabel color="blue.600">Banner da Vaga</FormLabel>
                            <Box>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setValue("banner", file);
                                        }
                                    }}
                                    border="none"
                                    p={1}
                                />
                                <Text fontSize="sm" color="gray.500">
                                    {watch("banner") && typeof watch("banner") === "string" 
                                        ? "Selecione um novo arquivo para substituir o banner atual" 
                                        : "Deixe em branco para manter o banner atual"}
                                </Text>
                            </Box>
                        </FormControl>

                        <Flex justify="flex-end" mt={8} gap={4}>
                            <Button
                                onClick={handleCancel}
                                colorScheme="red"
                                size="lg"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                colorScheme="green"
                                leftIcon={<LuSaveAll />}
                                size="lg"
                                isLoading={updateJob.isLoading}
                            >
                                Salvar Vaga
                            </Button>
                        </Flex>
                    </Flex>
                </SimpleGrid>
            </Flex>
        </Flex>
    );
}