import { Flex, Text, useColorModeValue } from "@chakra-ui/react";

export function Footer() {
    const bg = useColorModeValue("transparent", "transparent");
    const color = useColorModeValue("gray.400", "gray.600");

    return (
        <Flex as="footer" w="100%" justify="center" py={4} bg={bg}>
            <Text fontSize="xs" color={color} textAlign="center">
                © 2026 GoodWork — Conectando talentos às melhores oportunidades.
                <br />
                Todos os direitos reservados.
            </Text>
        </Flex>
    );
}
