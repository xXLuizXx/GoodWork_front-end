import { Avatar, Box, Button, Flex, Icon, Input, InputGroup, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { useCategories } from "@/services/hooks/Categories/useCategories";
import { useEffect, useState } from "react";
import { FcNext } from "react-icons/fc";
import { CreateCategory } from "@/components/Categories/CreateCategory";
import { parseCookies } from "nookies";
import decode from "jwt-decode";

interface DecodedToken {
    accessLevel: string;
}

export function Categories() {
    const { data } = useCategories();
    const [search, setSearch] = useState("");
    const filteredCategories = data?.categories.filter(category =>
        category.name.toLowerCase().includes(search.toLowerCase()) ||
        category.description?.toLowerCase().includes(search.toLowerCase())
    );
    const { isOpen, onOpen, onClose } = useDisclosure(); 
    const [isAdmin, setIsAdmin] = useState(false); 

    useEffect(() => {
        const cookies = parseCookies();
        const token = cookies["token.token"];

        if (token) {
            try {
                const decoded = decode<DecodedToken>(token);
                if (decoded.accessLevel) {
                    setIsAdmin(true);
                }
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
            }
        }
    }, []);
    return (
        <>
        <Box>
            <Input
                placeholder="Pesquisar categorias..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                mb={4}
                borderColor="gray.300"
            />
            <Stack
                spacing="4"
                mt="2"
                align="stretch"
                maxH="300px"
                overflowY="auto"
                p="2"
            >
                {filteredCategories?.length === 0 && (
                    <Box textAlign="center" color="gray.500">Nenhuma categoria encontrada.</Box>
                )}
                {filteredCategories?.map(category => (
                    <Link
                        key={category.id}
                        mt="2"
                        ml="4"
                        borderLeft="2px solid"
                        borderColor="gray.200"
                        mr="4"
                        display="flex"
                        alignItems="center"
                        href={`/jobs-category?category_id=${category.id}`}
                        _hover={{ bgColor: 'gray.200' }}
                    >
                        <Icon as={FcNext} fontSize="20" w="6" h="6" />
                        {category.name}
                    </Link>
                ))}
                
                {isAdmin && (
                    <Button onClick={onOpen} colorScheme="blue">
                        Cadastrar categoria
                    </Button>
                )}
                <CreateCategory isOpen={isOpen} onClose={onClose} />

            </Stack>
        </Box>
        </>
    );
};
