import { Avatar, Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, Heading, SimpleGrid, Text, VStack, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Alert, AlertIcon, useToast, Tooltip, Link } from "@chakra-ui/react";
import { GrFormView } from "react-icons/gr";
import { GoXCircleFill, GoCheckCircleFill } from "react-icons/go";
import { useState } from "react";
import { useCountCategoriesNotValidated } from "@/services/hooks/Categories/useCountCategoriesNotValidated";

export function CategoriesNotValid() {
    const { data } = useCountCategoriesNotValidated();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const toast = useToast();

    // Dados mockados para exemplo (substitua pelos seus dados reais)
    const mockCategories = [
        {
            id: '1',
            name: 'Design Gráfico',
            description: 'Design de logos, banners e materiais promocionais',
            created_at: '2023-10-15T10:30:00Z',
            user: {
                id: 'user1',
                name: 'Ana Silva',
                avatar: 'https://bit.ly/dan-abramov' // URL da imagem do usuário
            }
        },
        {
            id: '2',
            name: 'Desenvolvimento Web',
            description: 'Criação de sites e aplicações web responsivas',
            created_at: '2023-10-16T14:45:00Z',
            user: {
                id: 'user2',
                name: 'Carlos Oliveira',
                avatar: 'https://bit.ly/kent-c-dodds' // URL da imagem do usuário
            }
        }
    ];

    const handleValidate = (categoryId, isValid) => {
        // Lógica para validar/reprovar categoria
        toast({
            title: isValid ? 'Categoria aprovada' : 'Categoria reprovada',
            status: isValid ? 'success' : 'error',
            duration: 3000,
            isClosable: true,
        });
    };

    // if (!data?.categories || data?.categories.length === 0) {
    //     return (
    //         <Stack>
    //             <Alert status="info">
    //                 <AlertIcon />
    //                 Nenhuma categoria para validação encontrada.
    //             </Alert>
    //         </Stack>
    //     );
    // }

    return (
        <SimpleGrid columns={[1, 2, 3]} spacing={6} p={4}>
            {mockCategories.map(category => (
                <Card key={category.id} boxShadow="lg" maxW="sm">
                    <CardHeader>
                        <Flex alignItems="center" gap={3}>
                            <Tooltip label={`Ver perfil de ${category.user.name}`} hasArrow>
                                <Link href={`/perfil/${category.user.id}`} isExternal>
                                    <Avatar 
                                        name={category.user.name} 
                                        src={category.user.avatar} 
                                        size="md"
                                        _hover={{ transform: 'scale(1.1)', transition: 'all 0.2s' }}
                                        cursor="pointer"
                                    />
                                </Link>
                            </Tooltip>
                            <Box>
                                <Heading size="sm">{category.name}</Heading>
                                <Text fontSize="xs" color="gray.500">
                                    Solicitado por: {category.user.name}
                                </Text>
                            </Box>
                        </Flex>
                    </CardHeader>

                    <CardBody>
                        <VStack align="start" spacing={3}>
                            <Box>
                                <Text fontWeight="semibold" fontSize="sm">Descrição:</Text>
                                <Text fontSize="sm">{category.description}</Text>
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

            {/* Modal de Detalhes */}
            {selectedCategory && (
                <Modal isOpen={isOpen} onClose={onClose} size="xl">
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>
                            <Flex alignItems="center" gap={3}>
                                <Avatar 
                                    name={selectedCategory.user.name} 
                                    src={selectedCategory.user.avatar} 
                                    size="md"
                                />
                                <Box>
                                    <Text>{selectedCategory.name}</Text>
                                    <Text fontSize="sm" color="gray.500">
                                        Solicitado por: {selectedCategory.user.name}
                                    </Text>
                                </Box>
                            </Flex>
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <VStack spacing={4} align="start">
                                <Box>
                                    <Text fontWeight="bold">Descrição:</Text>
                                    <Text>{selectedCategory.description}</Text>
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
                                        <Avatar 
                                            name={selectedCategory.user.name} 
                                            src={selectedCategory.user.avatar} 
                                            size="sm"
                                            mr={2}
                                        />
                                        <Link 
                                            href={`/perfil/${selectedCategory.user.id}`} 
                                            isExternal
                                            color="blue.500"
                                            _hover={{ textDecoration: 'underline' }}
                                        >
                                            {selectedCategory.user.name}
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