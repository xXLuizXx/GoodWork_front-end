import { Avatar, Box, Button, Flex, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, useToast } from "@chakra-ui/react";
import { Input } from "../Form/Input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { api } from "@/services/apiClient";
import { queryClient } from "@/services/queryClient";
import { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import decode from "jwt-decode";

interface CreateCategoryProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ICreateCategory {
    name: string;
    description: string;
}

interface DecodedToken {
    accessLevel: string;
    isAdmin: boolean;
}

const validMandatoryFields = yup.object().shape({
    name: yup.string().required("Campo obrigatório"),
    description: yup.string().required("Campo obrigatório"),
});

export function CreateCategory({ isOpen, onClose }: CreateCategoryProps) {
    const { register, formState, handleSubmit, reset} = useForm<ICreateCategory>({
        resolver: yupResolver(validMandatoryFields),
    });
    const { errors } = formState;
    const toast = useToast();
    const [admin, setAdmin] = useState(false); 
    const [ typeUser, setTypeUser ] = useState("");
    const createCategory = useMutation(
        async (category: ICreateCategory) => {
            const response = await api.post("categories", category);
            return response.data.category;
        },
        {
            onSuccess: () => {
                onClose();
                reset();
                
                toast({
                    description: admin 
                        ? "Categoria criada com sucesso." 
                        : "Solicitação de categoria enviada com sucesso. Aguarde validação do administrador.",
                    status: "success",
                    position: "top",
                    duration: 8000,
                    isClosable: true,
                });
                
                queryClient.invalidateQueries("categories");
            },
            onError: (error) => {
                toast({
                    description: error.response?.data?.message || "Erro ao criar categoria",
                    status: "error",
                    position: "top",
                    duration: 8000,
                    isClosable: true,
                });
            }
        }
    );

    const createHandle: SubmitHandler<ICreateCategory> = async (data) => {
        try {
            await createCategory.mutateAsync(data, admin);
        } catch (error) {
            console.error("Erro no envio do formulário:", error);
        }
    };

    useEffect(() => {
            const cookies = parseCookies();
            const token = cookies["token.token"];
    
            if (token) {
                try {
                    const decoded = decode<DecodedToken>(token);
    
                    if (decoded.accessLevel) {
                        setTypeUser(decoded.accessLevel);
                        setAdmin(decoded.isAdmin);
                    }
                } catch (error) {
                    console.error("Erro ao decodificar o token:", error);
                }
            }
        }, []);
    return (
        <Modal isCentered isOpen={isOpen} onClose={onClose} motionPreset="slideInRight">
            <ModalOverlay />
            <Flex
                as="form"
                onSubmit={handleSubmit(createHandle)}
            >
                <ModalContent maxW="400px" borderRadius="lg" boxShadow="2xl">
                    <ModalHeader>
                        <Flex gap="4" alignItems="center">
                            <Avatar name="avatar" src="/Img/logos/GoodworkSSlogan.png" />
                            <Box>
                                <Text fontWeight="bold" fontSize="xl" color="gray.500">
                                    {admin 
                                        ? "Criação de nova categoria"
                                        : typeUser?.toString() === "company" 
                                            ? "Solicitar criação de categoria"
                                            : "Acesso não autorizado"}
                                </Text>
                            </Box>
                        </Flex>
                    </ModalHeader>

                    <ModalBody overflowY="auto" maxH="500px" bg="gray.50" p="6" borderRadius="md">
                        <Stack>
                            <Input
                                name="name"
                                type="name"
                                error={errors.name}
                                boxShadow="2xl"
                                borderColor="blue.200"
                                borderRadius="full"
                                focusBorderColor="blue.400"
                                bgColor="gray.100"
                                variant="filled"
                                _hover={{ bgColor: "gray.200" }}
                                size="lg"
                                placeholder="Nome Categoria"
                                {...register("name")}
                            />
                        </Stack>
                        <Stack mt="5px">
                            <Input
                                name="description"
                                type="description"
                                error={errors.description}
                                boxShadow="2xl"
                                borderColor="blue.200"
                                borderRadius="full"
                                focusBorderColor="blue.400"
                                bgColor="gray.100"
                                variant="filled"
                                _hover={{ bgColor: "gray.200" }}
                                size="lg"
                                placeholder="Descrição"
                                {...register("description")}
                            />
                        </Stack>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="red" mr={3} onClick={onClose}>
                            Fechar
                        </Button>
                        <Button 
                            type="submit" 
                            colorScheme="blue" 
                            isLoading={formState.isSubmitting}
                            isDisabled={!admin && typeUser?.toString() !== "company"}
                        >
                            {admin 
                                ? "Cadastrar"
                                : typeUser?.toString() === "company"
                                    ? "Solicitar"
                                    : "Não autorizado"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Flex>
        </Modal>
    );
}
