import React, { useContext, useEffect, useState } from 'react';
import { 
    Avatar, 
    Flex, 
    FormControl, 
    FormLabel, 
    Input, 
    Stack, 
    SimpleGrid, 
    Text, 
    Box, 
    Button, 
    useToast, 
    Spinner, 
    Textarea
} from '@chakra-ui/react';
import { LuSaveAll } from 'react-icons/lu';
import { MdEdit } from 'react-icons/md';
import { Divider } from '@chakra-ui/react';
import { AuthContext } from '@/contexts/AuthContext';
import { useMutation } from 'react-query';
import { api } from '@/services/apiClient';
import { queryClient } from '@/services/queryClient';
import { SubmitHandler, useForm } from 'react-hook-form';

interface IUpdateUser {
    id: string;
    road: string;
    number: string;
    neighborhood: string;
    telephone: string;
    functionn: string;
    ability: string;
    is_employee: boolean;
}

export function MyProfile(): JSX.Element {
    const { user } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const { handleSubmit, register, setValue, reset } = useForm<IUpdateUser>();
    const toast = useToast();

    useEffect(() => {
        if (user) {
            reset({
                road: user.road ?? "",
                number: user.number ?? "",
                neighborhood: user.neighborhood ?? "",
                telephone: user.telephone ?? "",
                functionn: user.functionn ?? "",
                ability: user.ability ?? "",
                is_employee: user.is_employee ?? ""
            });
        }
    }, [user, reset]);

    const toggleEditing = () => setIsEditing(!isEditing);

    const updateUser = useMutation(
        async (data: IUpdateUser) => {
            console.log(data);
            const response = await api.patch("users/profile/updateData", data);
            return response.data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries("users");
                toast({
                    description: "Dados alterados com sucesso.",
                    status: "success",
                    position: "top",
                    duration: 5000,
                    isClosable: true,
                });
                toggleEditing();
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            },
            onError: (error: any) => {
                toast({
                    description: error.response?.data?.message || "Erro ao atualizar os dados.",
                    status: "error",
                    position: "top",
                    duration: 5000,
                    isClosable: true,
                });
            },
        }
    );

    const handleUpdate: SubmitHandler<IUpdateUser> = async (data) => {
        const updateData = {
            ...data,
            id: user?.id,
        };
        try {
            await updateUser.mutateAsync(updateData);
        } catch (error) {
            console.error("Erro ao salvar dados:", error);
        }
    };

    if (!user) {
        return (
            <Flex justify="center" align="center" h="100vh">
                <Spinner size="xl" color="blue.500" />
            </Flex>
        );
    }
    const employeeOptions = ["Sim", "Não"];
    console.log("User: " + user.is_employee);
    return (
        <Flex
            as="form"
            onSubmit={handleSubmit(handleUpdate)}
            width="100%"
            maxWidth={1050}
            bg="white"
            p="8"
            borderRadius={10}
            boxShadow="dark-lg"
            flexDirection="column"
        >
            <Flex align="center" mb={8}>
                <Avatar
                    size="2xl"
                    src="../../../Img/icons/avatarLogin.png"
                    boxShadow="lg"
                    w="200px"
                    h="200px"
                />
                <Box ml={4}>
                    <Text fontSize="4xl" fontWeight="bold" color="blue.800">
                        {user.name}
                    </Text>
                    <FormControl>
                        {isEditing ? (
                            <Textarea
                                {...register("ability")}
                                bg="white"
                                borderColor="blue.300"
                                focusBorderColor="blue.500"
                                _hover={{ borderColor: "blue.400" }}
                            />
                        ) : (
                            <Text fontSize="17px" color="blue.800">
                                {user.ability ?? ""}
                            </Text>
                        )}
                    </FormControl>
                    <Text mt={2} fontSize="sm" color="gray.500">{user.email}</Text>
                </Box>
            </Flex>

            <Divider mb={8} />

            <SimpleGrid ml={10} mr={10} columns={{ base: 1, md: 2 }} spacing={6}>
                {[
                    { label: "Rua", field: "road" },
                    { label: "Número", field: "number" },
                    { label: "Bairro", field: "neighborhood" },
                    { label: "Telefone", field: "telephone" },
                    { label: "Função", field: "functionn" },
                ].map(({ label, field }) => (
                    <FormControl key={field}>
                        <FormLabel color="blue.600">{label}</FormLabel>
                        {isEditing ? (
                            <Input
                                {...register(field as keyof IUpdateUser)}
                                bg="white"
                                borderColor="blue.300"
                                focusBorderColor="blue.500"
                                _hover={{ borderColor: "blue.400" }}
                            />
                        ) : (
                            <Text
                                bg="gray.100"
                                p={2}
                                borderRadius="md"
                                border="1px solid"
                                borderColor="blue.300"
                                color="blue.800"
                            >
                                {user[field as keyof typeof user]}
                            </Text>
                        )}
                    </FormControl>
                ))}

                <FormControl>
                    <FormLabel color="blue.600">Está empregado</FormLabel>
                    {isEditing ? (
                        <select
                        {...register("is_employee")}
                        style={{
                            background: "white",
                            border: "1px solid",
                            borderColor: "blue.300",
                            padding: "8px",
                            borderRadius: "8px",
                            width: "100%",
                        }}
                    >
                        <option value={true}>Sim</option>
                        <option value={false}>Não</option>
                    </select>
                    ) : (
                        <Text
                            bg="gray.100"
                            p={2}
                            borderRadius="md"
                            border="1px solid"
                            borderColor="blue.300"
                            color="blue.800"
                        >
                            {user.is_employee ? "Sim" : "Não"}
                        </Text>
                    )}
                </FormControl>
            </SimpleGrid>


            <Flex mt={8} justify="center">
                {isEditing ? (
                <>
                    <Button
                        onClick={handleSubmit(handleUpdate)}
                        type="button"
                        colorScheme="green"
                        leftIcon={<LuSaveAll />}
                    >
                        Salvar
                    </Button>
                    <Button ml={2}
                        onClick={() => {
                            reset({
                                road: user.road ?? "",
                                number: user.number ?? "",
                                neighborhood: user.neighborhood ?? "",
                                telephone: user.telephone ?? "",
                                functionn: user.functionn ?? "",
                                ability: user.ability ?? "",
                                is_employee: user.is_employee ?? ""
                            });
                            setIsEditing(false);
                        }}
                        type="button"
                        colorScheme="red"
                    >
                        Cancelar
                    </Button>
                </>
            ) : (
                <Button
                    onClick={toggleEditing}
                    type="button"
                    colorScheme="blue"
                    leftIcon={<MdEdit />}
                >
                    Editar
                </Button>
            )}

            </Flex>
        </Flex>
    );
}
