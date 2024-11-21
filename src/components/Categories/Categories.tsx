import { Box, Icon, Input, Link, Stack } from "@chakra-ui/react";
import { useCategories } from "@/services/hooks/Categories/useCategories";
import { useState } from "react";
import { FcNext } from "react-icons/fc";

export function Categories() {
    const { data } = useCategories();
    const [search, setSearch] = useState("");

    const filteredCategories = data?.categories.filter(category =>
        category.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
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
            </Stack>
        </Box>
    );
};
