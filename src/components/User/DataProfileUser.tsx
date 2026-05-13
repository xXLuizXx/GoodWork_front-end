import React, { useContext, useEffect, useState, useRef } from 'react';
import {
    Avatar,
    Flex,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    SimpleGrid,
    Text,
    Box,
    Button,
    useToast,
    Spinner,
    Textarea,
    IconButton,
    useColorModeValue,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
} from '@chakra-ui/react';
import { LuSaveAll } from 'react-icons/lu';
import { MdEdit, MdCameraAlt, MdVisibility, MdVisibilityOff, MdLock } from 'react-icons/md';
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
    business_area: string;
}

interface IChangePassword {
    current_password: string;
    new_password: string;
    confirm_password: string;
}

export function MyProfile(): JSX.Element {
    const { user } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const containerBg = useColorModeValue('white', 'gray.800');
    const inputBg = useColorModeValue('white', 'gray.700');
    const fieldBg = useColorModeValue('gray.100', 'gray.700');
    const fieldColor = useColorModeValue('blue.800', 'whiteAlpha.900');
    const selectBg = useColorModeValue('white', '#2D3748');
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [showCurrentPwd, setShowCurrentPwd] = useState(false);
    const [showNewPwd, setShowNewPwd] = useState(false);
    const [showConfirmPwd, setShowConfirmPwd] = useState(false);
    const { isOpen: isPwdOpen, onOpen: onPwdOpen, onClose: onPwdClose } = useDisclosure();
    const { handleSubmit, register, setValue, reset } = useForm<IUpdateUser>();
    const {
        handleSubmit: handleSubmitPassword,
        register: registerPassword,
        watch: watchPassword,
        reset: resetPassword,
        formState: { errors: passwordErrors },
    } = useForm<IChangePassword>();
    const toast = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                toast({
                    description: "A imagem deve ter menos de 10MB",
                    status: "error",
                    position: "top",
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);

            try {
                const formData = new FormData();
                formData.append('avatar', file);

                await api.patch('users/avatar', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                toast({
                    description: "Avatar atualizado com sucesso!",
                    status: "success",
                    position: "top",
                    duration: 3000,
                    isClosable: true,
                });

                queryClient.invalidateQueries("users");
            } catch (error) {
                toast({
                    description: "Erro ao atualizar o avatar",
                    status: "error",
                    position: "top",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    };

    useEffect(() => {
        if (user) {
            reset({
                road: user.road ?? "",
                number: user.number ?? "",
                neighborhood: user.neighborhood ?? "",
                telephone: user.telephone ?? "",
                functionn: user.user_type === "individual" ? user.individualData?.functionn ?? "" : "",
                ability: user.user_type === "individual" ? user.individualData?.ability ?? "" : "",
                is_employee: user.user_type === "individual" ? user.individualData?.is_employee ?? false : false,
                business_area: user.user_type === "company" ? user.companyData?.business_area ?? "" : "",
            });
        }
    }, [user, reset]);

    const toggleEditing = () => setIsEditing(!isEditing);

    const updateUser = useMutation(
        async (data: IUpdateUser) => {
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
            is_employee: user?.user_type === "individual" ? data.is_employee : undefined,
            functionn: user.user_type === "individual" ? data.functionn : undefined,
            ability: user.user_type === "individual" ? data.ability : undefined,
            business_area: user.user_type === "company" ? data.business_area : undefined,
        };
        try {
            await updateUser.mutateAsync(updateData);
        } catch (error) {
            console.error("Erro ao salvar dados:", error);
        }
    };

    const changePasswordMutation = useMutation(
        async (data: { current_password: string; new_password: string }) => {
            await api.patch("users/profile/changePassword", data);
        },
        {
            onSuccess: () => {
                toast({
                    description: "Senha alterada com sucesso.",
                    status: "success",
                    position: "top",
                    duration: 5000,
                    isClosable: true,
                });
                resetPassword();
                onPwdClose();
            },
            onError: (error: any) => {
                const status = error?.response?.status;
                const message =
                    status === 400 || status === 401 || status === 404 || status === 422
                        ? error?.response?.data?.message ?? "Não foi possível alterar a senha."
                        : "Erro ao alterar senha. Tente novamente.";
                toast({
                    description: message,
                    status: "error",
                    position: "top",
                    duration: 5000,
                    isClosable: true,
                });
            },
        }
    );

    const handleChangePassword: SubmitHandler<IChangePassword> = async (data) => {
        await changePasswordMutation.mutateAsync({
            current_password: data.current_password,
            new_password: data.new_password,
        });
    };

    if (!user) {
        return (
            <Flex justify="center" align="center" h="100vh">
                <Spinner size="xl" color="blue.500" />
            </Flex>
        );
    }

    return (
        <>
        <Flex
            as="form"
            onSubmit={handleSubmit(handleUpdate)}
            width="100%"
            maxWidth={1050}
            bg={containerBg}
            p="8"
            borderRadius={10}
            boxShadow="dark-lg"
            flexDirection="column"
        >
            <Flex align="center" mb={8}>
                <Box position="relative">
                    <Avatar
                        size="2xl"
                        src={user.avatar ? `${process.env.NEXT_PUBLIC_API_URL}/avatars/${user.avatar}` : "../../../Img/icons/avatarLogin.png"}
                        boxShadow="lg"
                        w="200px"
                        h="200px"
                    />
                    <IconButton
                        aria-label="Upload avatar"
                        icon={<MdCameraAlt />}
                        position="absolute"
                        bottom="0"
                        right="0"
                        colorScheme="blue"
                        borderRadius="full"
                        onClick={handleAvatarClick}
                    />
                    <Input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarUpload}
                        accept="image/*"
                        display="none"
                    />
                </Box>
                <Box ml={4}>
                    <Text fontSize="4xl" fontWeight="bold" color="blue.800">
                        {user.name}
                    </Text>
                    <FormControl>
                        {isEditing && user.user_type === "individual" ? (
                            <Textarea
                                {...register("ability")}
                                bg={inputBg}
                                borderColor="blue.300"
                                focusBorderColor="blue.500"
                                _hover={{ borderColor: "blue.400" }}
                            />
                        ) : (
                            <Text fontSize="17px" color="blue.800">
                                {user.user_type === "individual"
                                    ? user.individualData?.ability
                                    : null}
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
                    { label: "Função", field: "functionn", isIndividual: true },
                    { label: "Área de Negócio", field: "business_area", isCompany: true },
                ].map(({ label, field, isIndividual, isCompany }) => (
                    (user.user_type === "individual" && isCompany) || (user.user_type === "company" && isIndividual) ? null :
                    <FormControl key={field}>
                        <FormLabel color="blue.600">{label}</FormLabel>
                        {isEditing ? (
                            <Input
                                {...register(field as keyof IUpdateUser)}
                                defaultValue={user[field as keyof typeof user]}
                                bg={inputBg}
                                borderColor="blue.300"
                                focusBorderColor="blue.500"
                                _hover={{ borderColor: "blue.400" }}
                            />
                        ) : (
                            <Text
                                bg={fieldBg}
                                p={2}
                                borderRadius="md"
                                border="1px solid"
                                borderColor="blue.300"
                                color={fieldColor}
                            >
                                {
                                    user.user_type === "individual" && isIndividual
                                    ? user.individualData?.[field as keyof typeof user.individualData]
                                    : user.user_type === "company" && isCompany
                                    ? user.companyData?.[field as keyof typeof user.companyData]
                                    : user[field as keyof typeof user]
                                }
                            </Text>
                        )}
                    </FormControl>
                ))}

                {user.user_type === "individual" && (
                    <FormControl>
                        <FormLabel color="blue.600">Está empregado</FormLabel>
                        {isEditing ? (
                            <select
                                {...register("is_employee", { setValueAs: (v) => v === "true" })}
                                style={{
                                    background: selectBg,
                                    border: "1px solid #63B3ED",
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
                                bg={fieldBg}
                                p={2}
                                borderRadius="md"
                                border="1px solid"
                                borderColor="blue.300"
                                color={fieldColor}
                            >
                                {user.individualData?.is_employee ? "Sim" : "Não"}
                            </Text>
                        )}
                    </FormControl>
                )}
            </SimpleGrid>

            <Flex mt={8} justify="center" gap={3}>
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
                        <Button
                            onClick={() => {
                                reset({
                                    road: user.road ?? "",
                                    number: user.number ?? "",
                                    neighborhood: user.neighborhood ?? "",
                                    telephone: user.telephone ?? "",
                                    functionn: user.user_type === "individual" ? user.individualData?.functionn ?? "" : "",
                                    ability: user.user_type === "individual" ? user.individualData?.ability ?? "" : "",
                                    is_employee: user.user_type === "individual" ? user.individualData?.is_employee ?? false : false,
                                    business_area: user.user_type === "company" ? user.companyData?.business_area ?? "" : "",
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
                    <>
                        <Button
                            onClick={toggleEditing}
                            type="button"
                            colorScheme="blue"
                            leftIcon={<MdEdit />}
                        >
                            Editar
                        </Button>
                        <Button
                            onClick={onPwdOpen}
                            type="button"
                            colorScheme="gray"
                            leftIcon={<MdLock />}
                        >
                            Alterar senha
                        </Button>
                    </>
                )}
            </Flex>
        </Flex>

        <Modal
            isOpen={isPwdOpen}
            onClose={() => {
                resetPassword();
                setShowCurrentPwd(false);
                setShowNewPwd(false);
                setShowConfirmPwd(false);
                onPwdClose();
            }}
            isCentered
        >
            <ModalOverlay />
            <ModalContent
                as="form"
                onSubmit={handleSubmitPassword(handleChangePassword)}
            >
                <ModalHeader>Alterar senha</ModalHeader>
                <ModalCloseButton />
                <ModalBody display="flex" flexDirection="column" gap={4}>
                    <FormControl isInvalid={!!passwordErrors.current_password}>
                        <FormLabel color="blue.600">Senha atual</FormLabel>
                        <InputGroup>
                            <Input
                                {...registerPassword("current_password", {
                                    required: "Informe a senha atual",
                                })}
                                type={showCurrentPwd ? "text" : "password"}
                                borderColor="blue.300"
                                focusBorderColor="blue.500"
                                _hover={{ borderColor: "blue.400" }}
                            />
                            <InputRightElement>
                                <IconButton
                                    aria-label="Mostrar senha atual"
                                    icon={showCurrentPwd ? <MdVisibilityOff /> : <MdVisibility />}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowCurrentPwd(v => !v)}
                                />
                            </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>{passwordErrors.current_password?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!passwordErrors.new_password}>
                        <FormLabel color="blue.600">Nova senha</FormLabel>
                        <InputGroup>
                            <Input
                                {...registerPassword("new_password", {
                                    required: "Informe a nova senha",
                                    minLength: { value: 6, message: "A senha deve ter no mínimo 6 caracteres" },
                                })}
                                type={showNewPwd ? "text" : "password"}
                                borderColor="blue.300"
                                focusBorderColor="blue.500"
                                _hover={{ borderColor: "blue.400" }}
                            />
                            <InputRightElement>
                                <IconButton
                                    aria-label="Mostrar nova senha"
                                    icon={showNewPwd ? <MdVisibilityOff /> : <MdVisibility />}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowNewPwd(v => !v)}
                                />
                            </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>{passwordErrors.new_password?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!passwordErrors.confirm_password}>
                        <FormLabel color="blue.600">Confirmar nova senha</FormLabel>
                        <InputGroup>
                            <Input
                                {...registerPassword("confirm_password", {
                                    required: "Confirme a nova senha",
                                    validate: (value) =>
                                        value === watchPassword("new_password") || "As senhas não coincidem",
                                })}
                                type={showConfirmPwd ? "text" : "password"}
                                borderColor="blue.300"
                                focusBorderColor="blue.500"
                                _hover={{ borderColor: "blue.400" }}
                            />
                            <InputRightElement>
                                <IconButton
                                    aria-label="Mostrar confirmação de senha"
                                    icon={showConfirmPwd ? <MdVisibilityOff /> : <MdVisibility />}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowConfirmPwd(v => !v)}
                                />
                            </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>{passwordErrors.confirm_password?.message}</FormErrorMessage>
                    </FormControl>
                </ModalBody>

                <ModalFooter gap={3}>
                    <Button
                        type="submit"
                        colorScheme="blue"
                        leftIcon={<LuSaveAll />}
                        isLoading={changePasswordMutation.isLoading}
                    >
                        Salvar
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                            resetPassword();
                            setShowCurrentPwd(false);
                            setShowNewPwd(false);
                            setShowConfirmPwd(false);
                            onPwdClose();
                        }}
                    >
                        Cancelar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    );
}
