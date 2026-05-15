import { Box, Stat, StatLabel, StatNumber, StatHelpText, useColorModeValue } from "@chakra-ui/react";

interface StatCardProps {
    label: string;
    value: string | number;
    helpText?: string;
}

export function StatCard({ label, value, helpText }: StatCardProps) {
    const bg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");

    return (
        <Box bg={bg} p={5} borderRadius="lg" boxShadow="md" border="1px solid" borderColor={borderColor}>
            <Stat>
                <StatLabel color="gray.500" fontSize="sm">{label}</StatLabel>
                <StatNumber fontSize="2xl" color="blue.600">{value}</StatNumber>
                {helpText && <StatHelpText>{helpText}</StatHelpText>}
            </Stat>
        </Box>
    );
}
