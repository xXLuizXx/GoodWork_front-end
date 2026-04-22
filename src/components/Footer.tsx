import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";

export function Footer() {
    const year = new Date().getFullYear();
    const bg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.100", "gray.700");

    return (
        <Box
            as="footer"
            w="100%"
            borderTop="1px solid"
            borderColor={borderColor}
            mt="auto"
            py={4}
            px={8}
            bg={bg}
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
