import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormLabel,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useCategories } from "@/services/hooks/Categories/useCategories";
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
import { withSSRGuest } from "@/shared/withSSRGuest";

interface ICreateJob{
    vacancy: string;
    contractor: string;
    description_vacancy: string;
    requirements: string;
    workload: string;
    location: string;
    benefits: string;
    banner?: File;
    category_id: string;
}
const validMandatoryFields = yup.object().shape({
    vacancy: yup.string().required("Campo obrigatório"),
    contractor: yup.string().required("Campo obrigatório"),
    description_vacancy: yup.string().required("Campo obrigatório"),
    requirements: yup.string().required("Campo obrigatório"),
    workload: yup.string().required("Campo obrigatório"),
    location: yup.string().required("Campo obrigatório"),
    benefits: yup.string().required("Campo obrigatório"),
    category_id: yup.string().required("Campo obrigatório"),
});
const schema = yup.object().shape({
    banner: yup.mixed()
        .required("Campo obrigatório")
        .test("fileRequired", "Arquivo obrigatório", (value) => {
            return value instanceof File;
        }),
  });
const getServerSideProps = withSSRGuest(async ctx => {
    return {
        props: {},
    };
});
export default function CreateJob(): JSX.Element {
    const combinedSchema = validMandatoryFields.concat(schema);
    const { register, formState, handleSubmit, setValue } = useForm({
        resolver: yupResolver(combinedSchema),
    });
    useEffect(() => {
        register("banner", { required: true });
    }, [register]);

    const { errors } = formState;
    const toast = useToast();
    const { data } = useCategories(); 
    const createJob = useMutation(
        async (job: ICreateJob) => {
            api.post("jobs", job, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(response => {
                toast({
                    description: "Solicitação de criação de vaga efetuada com sucesso. Favor aguardar aprovação",
                    status: "success",
                    position: "top",
                    duration: 8000,
                    isClosable: true,
                });
                
                return response.data.job;
            }).catch(error => {
                toast({
                    description: error.response.data.message,
                    status: "error",
                    position: "top",
                    duration: 8000,
                    isClosable: true,
                });
            });
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries("jobs")
            }
        },
    );

    const createHandle: SubmitHandler<ICreateJob> = async (formData) => {
        const formDataToSend = new FormData();
      
        for (const [key, value] of Object.entries(formData)) {
            if (key === "banner") {
                if (value instanceof File) {
                    formDataToSend.append(key, value);
                }
            } else {
                formDataToSend.append(key, value as string);
            }
        }
      
        try {
            await createJob.mutateAsync(formDataToSend);
        } catch (error) {
            console.error("Erro no envio do formulário:", error);
        }
    };          
        
    return (
        <Flex 
            as="form"
            direction="column" 
            h="100vh"
            onSubmit={handleSubmit(createHandle)}
        >
            <Helmet>
                <title>Cadastrar vaga</title>
                <link rel="icon" href="/Img/logos/GoodworkSSlogan.png" type="image/png" />
            </Helmet>
            <Header />
    
            <Flex w="100%" my="8" maxWidth={1480} mx="auto" px="4">
                <Sidebar />
                <Flex 
                    justify="center" 
                    align="center"
                >
                    <Box
                        p={8} 
                        borderWidth="1px" 
                        borderRadius="lg" 
                        maxWidth="600px" 
                        width="100%" 
                    >
                        <VStack spacing={4}>
                            <FormLabel>Vaga</FormLabel>
                            <Input
                                border="1px solid"
                                borderColor="rgba(0, 0, 255, 0.2)"
                                name="vacancy"
                                type="vacancy"
                                error={errors.vacancy}
                                {...register("vacancy")}
                            />

                            <FormLabel>Contratante</FormLabel>
                            <Input 
                                border="1px solid"
                                borderColor="rgba(0, 0, 255, 0.2)"
                                name="contractor"
                                type="contractor"
                                error={errors.contractor}
                                {...register("contractor")}
                            />

                            <FormLabel>Descrição</FormLabel>
                            <Textarea 
                                border="1px solid"
                                borderColor="rgba(0, 0, 255, 0.2)"
                                name="description"
                                type="description"
                                error={errors.description_vacancy}
                                {...register("description_vacancy")}
                            />

                            <FormLabel>Requisitos</FormLabel>
                            <Textarea 
                                border="1px solid"
                                borderColor="rgba(0, 0, 255, 0.2)"
                                name="requirements"
                                type="requirements"
                                error={errors.requirements}
                                {...register("requirements")}
                            />

                            <FormLabel>Carga horaria de trabalho</FormLabel>
                            <Input 
                                border="1px solid"
                                borderColor="rgba(0, 0, 255, 0.2)"
                                name="workload"
                                type="workload"
                                error={errors.workload}
                                {...register("workload")}
                            />

                            <FormLabel>Localização</FormLabel>
                            <Input 
                                border="1px solid"
                                borderColor="rgba(0, 0, 255, 0.2)"
                                name="location"
                                type="location"
                                error={errors.location}
                                {...register("location")}
                            />

                            <FormLabel>Beneficios</FormLabel>
                            <Textarea
                                border="1px solid"
                                borderColor="rgba(0, 0, 255, 0.2)"
                                name="benefits"
                                type="benefits"
                                error={errors.benefits}
                                {...register("benefits")}
                            />

                            <FormLabel>Banner</FormLabel>
                            <Input
                                type="file"
                                name="banner"
                                accept="image/*"
                                onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    if (file) {
                                        setValue("banner", file, { shouldValidate: true });
                                    }
                                }}
                                error={errors.banner}
                            />

                            <FormLabel>Categoria</FormLabel>
                            <Select
                                border="1px solid"
                                borderColor="rgba(0, 0, 255, 0.2)"
                                name="category_id"
                                error={errors.category_id}
                                options={
                                    data?.categories
                                    .map((category) => ({
                                        key: category.id,
                                        value: category.id,
                                        label: category.name,
                                    })) || []
                                }
                                {...register("category_id")}
                                />
            
                            <Button type="submit" colorScheme="blue" width="full" isLoading={formState.isSubmitting}>
                                Cadastrar Vaga
                            </Button>
                        </VStack>
                    </Box>
                </Flex>
            </Flex>
        </Flex>
    );
  
};

export { getServerSideProps };
