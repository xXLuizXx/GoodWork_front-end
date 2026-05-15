import { Box, Flex, SimpleGrid, Spinner, Text, Button, useColorModeValue } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { MdPictureAsPdf } from "react-icons/md";
import { RiFileExcel2Line } from "react-icons/ri";
import { useIndividualOverview } from "@/services/hooks/Reports/useReports";
import { StatCard } from "./StatCard";
import { exportIndividualPDF, exportIndividualExcel } from "./exportUtils";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function IndividualReport() {
    const { data: overview, isLoading } = useIndividualOverview();
    const cardBg = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.700", "gray.100");

    if (isLoading) {
        return <Flex justify="center" align="center" flex="1"><Spinner size="xl" color="blue.500" /></Flex>;
    }

    const appLabels = overview?.applications.chart.map(d => d.label) ?? [];
    const appValues = overview?.applications.chart.map(d => d.value) ?? [];
    const intLabels = overview?.interviews.chart.map(d => d.label) ?? [];
    const intValues = overview?.interviews.chart.map(d => d.value) ?? [];

    return (
        <Flex direction="column" gap={8} flex="1">
            <Flex justify="space-between" align="center">
                <Text fontSize="xl" fontWeight="bold" color={textColor}>Minhas Candidaturas</Text>
                <Flex gap={2}>
                    <Button
                        size="sm"
                        colorScheme="red"
                        variant="outline"
                        leftIcon={<MdPictureAsPdf />}
                        onClick={() => overview && exportIndividualPDF(overview)}
                        isDisabled={!overview}
                    >
                        PDF
                    </Button>
                    <Button
                        size="sm"
                        colorScheme="green"
                        variant="outline"
                        leftIcon={<RiFileExcel2Line />}
                        onClick={() => overview && exportIndividualExcel(overview)}
                        isDisabled={!overview}
                    >
                        Excel
                    </Button>
                </Flex>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <StatCard label="Total de candidaturas" value={overview?.applications.total ?? 0} />
                <StatCard label="Taxa de aprovação" value={`${overview?.applications.approvalRate ?? 0}%`} />
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md">
                    <Text fontSize="lg" fontWeight="semibold" color={textColor} mb={4}>Status das Candidaturas</Text>
                    <Chart
                        type="bar"
                        height={220}
                        series={[{ name: "Candidaturas", data: appValues }]}
                        options={{
                            chart: { toolbar: { show: false } },
                            plotOptions: { bar: { borderRadius: 4, columnWidth: "50%" } },
                            dataLabels: { enabled: true },
                            xaxis: { categories: appLabels },
                            colors: ["#3182CE"],
                            grid: { borderColor: "#E2E8F0" },
                        }}
                    />
                </Box>

                <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md">
                    <Text fontSize="lg" fontWeight="semibold" color={textColor} mb={4}>Entrevistas</Text>
                    {intValues.length > 0 && intValues.some(v => v > 0) ? (
                        <Chart
                            type="donut"
                            height={220}
                            series={intValues}
                            options={{
                                labels: intLabels,
                                colors: ["#3182CE", "#38A169", "#E53E3E"],
                                legend: { position: "bottom" },
                                dataLabels: { enabled: true },
                                plotOptions: { pie: { donut: { size: "60%" } } },
                            }}
                        />
                    ) : (
                        <Flex justify="center" align="center" h="160px">
                            <Text color="gray.400">Nenhuma entrevista registrada</Text>
                        </Flex>
                    )}
                </Box>
            </SimpleGrid>
        </Flex>
    );
}
