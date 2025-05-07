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
    vacancy_available: boolean;
    amount_vacancy: number;
    closing_date: string;
}

export default function EditJob({id:string}:IJob): JSX.Element  {
    const router = useRouter();
    const { id } = router.query;
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const { handleSubmit, register, reset } = useForm<IJob>();
    const { data } = useCategories(); 

    useEffect(() => {
        if (id) {
            const fetchJob = async () => {
                try {
                    const response = await api.get(`/jobs/getJob?id=${id}`);
                    const jobData = response.data;
                    reset({
                        ...jobData,
                        closing_date: jobData.closing_date ? jobData.closing_date.split('T')[0] : ''
                    });
                    setIsLoading(false);
                } catch (error) {
                    toast({
                        description: "Erro ao carregar os dados da vaga.",
                        status: "error",
                        position: "top",
                        duration: 5000,
                        isClosable: true,
                    });
                    setIsLoading(false);
                }
            };
            fetchJob();
        }
    }, [id, reset, toast]);

    const updateJob = useMutation(
        async (formData: IJob) => {
            const payload = {
                ...formData,
                id: id as string
            };
            const response = await api.patch(`/jobs/updateJob`, payload);
            return response.data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['job', id]);
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
        }
    );
    
    const handleSubmitForm: SubmitHandler<IJob> = async (formData) => {
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
            await updateJob.mutateAsync(formData);
        } catch (error) {
            console.error("Erro na submissão:", error);
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
                            <Avatar
                                size="2xl"
                                src="../../../Img/icons/bannerVaga.png"
                                boxShadow="lg"
                                w="200px"
                                h="200px"
                            />
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
                                            selected={data?.category_id === category.id}
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