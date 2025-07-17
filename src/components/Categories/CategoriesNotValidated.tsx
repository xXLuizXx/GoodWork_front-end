import { Avatar, Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, Heading, SimpleGrid, Text, VStack, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Alert, AlertIcon, useToast, Tooltip, Link } from "@chakra-ui/react";
import { GrFormView } from "react-icons/gr";
import { GoXCircleFill, GoCheckCircleFill } from "react-icons/go";
import { useState } from "react";
import { useCountCategoriesNotValidated } from "@/services/hooks/Categories/useCountCategoriesNotValidated";

interface CategoryWithUser {
    id: string;
    name: string;
    description: string;
    valid_category: boolean | null;
    created_at: Date;
    user: {
        id: string;
        name: string;
        avatar: string;
    } | null;
}

export function CategoriesNotValid() {
    const { data, isLoading, isError } = useCountCategoriesNotValidated();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedCategory, setSelectedCategory] = useState<CategoryWithUser | null>(null);
    const toast = useToast();

    const handleValidate = (categoryId: string, isValid: boolean) => {
        toast({
            title: isValid ? 'Categoria aprovada' : 'Categoria reprovada',
            status: isValid ? 'success' : 'error',
            duration: 3000,
            isClosable: true,
        });
        // Aqui você adicionaria a chamada à API para atualizar o status da categoria
    };

    const UserAvatar = ({ user }: { user: { id: string; name: string; avatar: string } | null }) => {
        const avatarUrl = user?.avatar 
            ? `${process.env.NEXT_PUBLIC_API_URL}/avatars/${user.avatar}`
            : "../../../Img/icons/avatarLogin.png";
        
        return (
            <Avatar 
                border="1px" 
                size="md" 
                src={avatarUrl} 
                name={user?.name || ''}
                _hover={{ transform: 'scale(1.1)', transition: 'all 0.2s' }}
                cursor="pointer"
            />
        );
    };

    if (isLoading) {
        return (
            <Stack>
                <Alert status="info">
                    <AlertIcon />
                    Carregando categorias...
                </Alert>
            </Stack>
        );
    }

    if (isError || !data) {
        return (
            <Stack>
                <Alert status="error">
                    <AlertIcon />
                    Ocorreu um erro ao carregar as categorias.
                </Alert>
            </Stack>
        );
    }

    if (data.length === 0) {
        return (
            <Stack>
                <Alert status="info">
                    <AlertIcon />
                    Nenhuma categoria para validação encontrada.
                </Alert>
            </Stack>
        );
    }

    return (
        <SimpleGrid columns={[1, 2, 3]} spacing={6} p={4}>
            {data.map((category: CategoryWithUser) => (
                <Card key={category.id} boxShadow="lg" maxW="sm">
                    <CardHeader>
                        <Flex alignItems="center" gap={3}>
                            <Tooltip label={`Ver perfil de ${category.user?.name || 'Solicitante'}`} hasArrow>
                                <Link href={`/perfil/${category.user?.id || 'unknown'}`} isExternal>
                                    <UserAvatar user={category.user} />
                                </Link>
                            </Tooltip>
                            <Box>
                                <Heading size="sm">{category.name}</Heading>
                                <Text fontSize="xs" color="gray.500">
                                    Solicitado por: {category.user?.name || 'Solicitante'}
                                </Text>
                            </Box>
                        </Flex>
                    </CardHeader>

                    <CardBody>
                        <VStack align="start" spacing={3}>
                            <Box>
                                <Text fontWeight="semibold" fontSize="sm">Descrição:</Text>
                                <Text fontSize="sm">{category.description || "Nenhuma descrição fornecida"}</Text>
                            </Box>
                            <Box>
                                <Text fontWeight="semibold" fontSize="sm">Data de criação:</Text>
                                <Text fontSize="sm">
                                    {new Date(category.created_at).toLocaleDateString('pt-BR')}
                                </Text>
                            </Box>
                        </VStack>
                    </CardBody>

                    <CardFooter>
                        <SimpleGrid columns={3} spacing={2} w="100%">
                            <Button
                                size="sm"
                                colorScheme="green"
                                leftIcon={<GoCheckCircleFill />}
                                onClick={() => handleValidate(category.id, true)}
                            >
                                Aprovar
                            </Button>
                            <Button
                                size="sm"
                                colorScheme="red"
                                leftIcon={<GoXCircleFill />}
                                onClick={() => handleValidate(category.id, false)}
                            >
                                Reprovar
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                leftIcon={<GrFormView />}
                                onClick={() => {
                                    setSelectedCategory(category);
                                    onOpen();
                                }}
                            >
                                Detalhes
                            </Button>
                        </SimpleGrid>
                    </CardFooter>
                </Card>
            ))}

            {selectedCategory && (
                <Modal isOpen={isOpen} onClose={onClose} size="xl">
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>
                            <Flex alignItems="center" gap={3}>
                                <UserAvatar user={selectedCategory.user} />
                                <Box>
                                    <Text>{selectedCategory.name}</Text>
                                    <Text fontSize="sm" color="gray.500">
                                        Solicitado por: {selectedCategory.user?.name || 'Solicitante'}
                                    </Text>
                                </Box>
                            </Flex>
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <VStack spacing={4} align="start">
                                <Box>
                                    <Text fontWeight="bold">Descrição:</Text>
                                    <Text>{selectedCategory.description || "Nenhuma descrição fornecida"}</Text>
                                </Box>
                                <Box>
                                    <Text fontWeight="bold">Data de criação:</Text>
                                    <Text>
                                        {new Date(selectedCategory.created_at).toLocaleString('pt-BR')}
                                    </Text>
                                </Box>
                                <Box>
                                    <Text fontWeight="bold">Solicitante:</Text>
                                    <Flex alignItems="center" mt={2}>
                                        <UserAvatar user={selectedCategory.user} />
                                        <Link 
                                            href={`/perfil/${selectedCategory.user?.id || 'unknown'}`} 
                                            isExternal
                                            color="blue.500"
                                            _hover={{ textDecoration: 'underline' }}
                                            ml={2}
                                        >
                                            {selectedCategory.user?.name || 'Solicitante'}
                                        </Link>
                                    </Flex>
                                </Box>
                            </VStack>
                        </ModalBody>
                        <ModalFooter>
                            <Button 
                                colorScheme="green" 
                                mr={3}
                                onClick={() => {
                                    handleValidate(selectedCategory.id, true);
                                    onClose();
                                }}
                            >
                                Aprovar Categoria
                            </Button>
                            <Button 
                                colorScheme="red" 
                                mr={3}
                                onClick={() => {
                                    handleValidate(selectedCategory.id, false);
                                    onClose();
                                }}
                            >
                                Reprovar Categoria
                            </Button>
                            <Button variant="ghost" onClick={onClose}>
                                Fechar
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </SimpleGrid>
    );
}