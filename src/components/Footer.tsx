import { Box, Flex, Text, Link } from "@chakra-ui/react";

export function Footer() {
    const year = new Date().getFullYear();

    return (
        <Box
            as="footer"
            w="100%"
            borderTop="1px solid"
            borderColor="gray.100"
            mt="auto"
            py={4}
            px={8}
            bg="white"
        >
            <Flex
                maxWidth={1480}
                mx="auto"
                justify="space-between"
                align="center"
                flexWrap="wrap"
                gap={2}
            >
                <Text fontSize="sm" color="gray.400">
                    © {year} <strong>GoodWork</strong> — Conectando talentos às melhores oportunidades.
                </Text>
                <Text fontSize="sm" color="gray.300">
                    Todos os direitos reservados.
                </Text>
            </Flex>
        </Box>
    );
}
