import { Box, Flex, SimpleGrid, Spinner, Text, Button, useColorModeValue } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { MdPictureAsPdf } from "react-icons/md";
import { RiFileExcel2Line } from "react-icons/ri";
import { useAdminOverview, useAdminJobsByCategory } from "@/services/hooks/Reports/useReports";
import { StatCard } from "./StatCard";
import { exportAdminPDF, exportAdminExcel } from "./exportUtils";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function AdminReport() {
    const { data: overview, isLoading: loadingOverview } = useAdminOverview();
    const { data: byCategory, isLoading: loadingCategory } = useAdminJobsByCategory();
    const cardBg = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.700", "gray.100");

    if (loadingOverview || loadingCategory) {
        return <Flex justify="center" align="center" flex="1"><Spinner size="xl" color="blue.500" /></Flex>;
    }

    const categoryLabels = byCategory?.chart.map(d => d.label) ?? [];
    const categoryValues = byCategory?.chart.map(d => d.value) ?? [];

    return (
        <Flex direction="column" gap={8} flex="1">
            <Flex justify="space-between" align="center">
                <Text fontSize="xl" fontWeight="bold" color={textColor}>Visão Geral</Text>
                <Flex gap={2}>
                    <Button
                        size="sm"
                        colorScheme="red"
                        variant="outline"
                        leftIcon={<MdPictureAsPdf />}
                        onClick={() => overview && byCategory && exportAdminPDF(overview, byCategory)}
                        isDisabled={!overview || !byCategory}
                    >
                        PDF
                    </Button>
                    <Button
                        size="sm"
                        colorScheme="green"
                        variant="outline"
                        leftIcon={<RiFileExcel2Line />}
                        onClick={() => overview && byCategory && exportAdminExcel(overview, byCategory)}
                        isDisabled={!overview || !byCategory}
                    >
                        Excel
                    </Button>
                </Flex>
            </Flex>

            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                <StatCard
                    label="Total de usuários"
                    value={overview?.users.total ?? 0}
                    helpText={`${overview?.users.individual ?? 0} individuais · ${overview?.users.company ?? 0} empresas`}
                />
                <StatCard
                    label="Vagas ativas"
                    value={overview?.jobs.active ?? 0}
                    helpText={`${overview?.jobs.total ?? 0} total · ${overview?.jobs.pendingValidation ?? 0} pendentes`}
                />
                <StatCard label="Candidaturas" value={overview?.applications.total ?? 0} />
                <StatCard
                    label="Taxa de contratação"
                    value={`${overview?.applications.hiredRate ?? 0}%`}
                    helpText={`${overview?.applications.hired ?? 0} contratados`}
                />
            </SimpleGrid>

            <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md">
                <Text fontSize="lg" fontWeight="semibold" color={textColor} mb={4}>Vagas por categoria</Text>
                <Chart
                    type="bar"
                    height={260}
                    series={[{ name: "Vagas", data: categoryValues }]}
                    options={{
                        chart: { toolbar: { show: false } },
                        plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
                        dataLabels: { enabled: true },
                        xaxis: { categories: categoryLabels },
                        colors: ["#3182CE"],
                        grid: { borderColor: "#E2E8F0" },
                    }}
                />
            </Box>
        </Flex>
    );
}
