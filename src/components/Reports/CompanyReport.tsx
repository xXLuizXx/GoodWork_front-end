import { useState } from "react";
import {
    Box, Flex, SimpleGrid, Spinner, Text, Select, Button, Divider, useColorModeValue,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { MdPictureAsPdf } from "react-icons/md";
import { RiFileExcel2Line } from "react-icons/ri";
import { useCompanyOverview, useCompanyFunnel, useCompanyFunnelAll } from "@/services/hooks/Reports/useReports";
import { useAllJobsCompany } from "@/services/hooks/Jobs/useAllJobsCompany";
import { StatCard } from "./StatCard";
import {
    exportCompanyOverviewPDF,
    exportCompanyOverviewExcel,
    exportCompanyFunnelPDF,
    exportCompanyFunnelExcel,
    exportCompanyFunnelAllPDF,
    exportCompanyFunnelAllExcel,
} from "./exportUtils";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface CompanyReportProps {
    userId: string;
}

export function CompanyReport({ userId }: CompanyReportProps) {
    const [selectedJobId, setSelectedJobId] = useState("all");
    const isAll = selectedJobId === "all";

    const { data: overview, isLoading: loadingOverview } = useCompanyOverview();
    const { data: jobs } = useAllJobsCompany(userId);
    const { data: funnelAll, isLoading: loadingAll } = useCompanyFunnelAll(isAll);
    const { data: funnelSingle, isLoading: loadingSingle } = useCompanyFunnel(selectedJobId, !isAll);

    const cardBg = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.700", "gray.100");
    const selectedJobName = isAll
        ? "Todas as vagas"
        : jobs?.jobs.find(j => j.id === selectedJobId)?.vacancy ?? "";

    const loadingFunnel = isAll ? loadingAll : loadingSingle;

    if (loadingOverview) {
        return <Flex justify="center" align="center" flex="1"><Spinner size="xl" color="blue.500" /></Flex>;
    }

    return (
        <Flex direction="column" gap={8} flex="1">
            {/* Exportar tudo */}
            <Flex justify="flex-end" gap={2}>
                <Button
                    size="sm"
                    colorScheme="red"
                    leftIcon={<MdPictureAsPdf />}
                    isDisabled={!overview || (isAll ? !funnelAll : !funnelSingle)}
                    onClick={() => {
                        if (!overview) return;
                        if (isAll && funnelAll) exportCompanyFunnelAllPDF(overview, funnelAll);
                        else if (!isAll && funnelSingle) exportCompanyFunnelPDF(funnelSingle, selectedJobName);
                    }}
                >
                    Exportar tudo (PDF)
                </Button>
                <Button
                    size="sm"
                    colorScheme="green"
                    leftIcon={<RiFileExcel2Line />}
                    isDisabled={!overview || (isAll ? !funnelAll : !funnelSingle)}
                    onClick={() => {
                        if (!overview) return;
                        if (isAll && funnelAll) exportCompanyFunnelAllExcel(overview, funnelAll);
                        else if (!isAll && funnelSingle) exportCompanyFunnelExcel(funnelSingle, selectedJobName);
                    }}
                >
                    Exportar tudo (Excel)
                </Button>
            </Flex>

            {/* Overview */}
            <Flex justify="space-between" align="center">
                <Text fontSize="xl" fontWeight="bold" color={textColor}>Minhas Vagas</Text>
                <Flex gap={2}>
                    <Button
                        size="sm" colorScheme="red" variant="outline" leftIcon={<MdPictureAsPdf />}
                        isDisabled={!overview}
                        onClick={() => overview && exportCompanyOverviewPDF(overview)}
                    >
                        PDF
                    </Button>
                    <Button
                        size="sm" colorScheme="green" variant="outline" leftIcon={<RiFileExcel2Line />}
                        isDisabled={!overview}
                        onClick={() => overview && exportCompanyOverviewExcel(overview)}
                    >
                        Excel
                    </Button>
                </Flex>
            </Flex>

            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                <StatCard label="Total de vagas" value={overview?.total ?? 0} />
                <StatCard label="Vagas ativas" value={overview?.active ?? 0} />
                <StatCard label="Vagas fechadas" value={overview?.closed ?? 0} />
                <StatCard label="Duração média" value={`${overview?.avgDays ?? 0} dias`} />
            </SimpleGrid>

            <Divider />

            {/* Funil */}
            <Box>
                <Text fontSize="xl" fontWeight="bold" color={textColor} mb={4}>Funil por Vaga</Text>

                <Select
                    value={selectedJobId}
                    onChange={e => setSelectedJobId(e.target.value)}
                    maxW="400px"
                    mb={6}
                    borderColor="blue.300"
                    focusBorderColor="blue.500"
                >
                    <option value="all">Todas as vagas</option>
                    {jobs?.jobs.map(job => (
                        <option key={job.id} value={job.id}>{job.vacancy}</option>
                    ))}
                </Select>

                {loadingFunnel ? (
                    <Flex justify="center"><Spinner color="blue.500" /></Flex>
                ) : isAll ? (
                    /* Renderiza um card por vaga */
                    <Flex direction="column" gap={6}>
                        {funnelAll?.jobs.map(job => (
                            <Box key={job.job_id} bg={cardBg} p={6} borderRadius="lg" boxShadow="md">
                                <Text fontSize="md" fontWeight="bold" color="blue.600" mb={4}>
                                    {job.vacancy}
                                </Text>
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                    <Box>
                                        <Text fontSize="sm" fontWeight="semibold" color={textColor} mb={2}>Candidatos</Text>
                                        <Chart
                                            type="bar"
                                            height={180}
                                            series={[{ name: "Candidatos", data: job.candidates.chart.map(d => d.value) }]}
                                            options={{
                                                chart: { toolbar: { show: false } },
                                                plotOptions: { bar: { borderRadius: 3, columnWidth: "50%" } },
                                                dataLabels: { enabled: true },
                                                xaxis: { categories: job.candidates.chart.map(d => d.label) },
                                                colors: ["#3182CE"],
                                                grid: { borderColor: "#E2E8F0" },
                                            }}
                                        />
                                    </Box>
                                    <Box>
                                        <Text fontSize="sm" fontWeight="semibold" color={textColor} mb={2}>Entrevistas</Text>
                                        {job.interviews.chart.some(d => d.value > 0) ? (
                                            <Chart
                                                type="donut"
                                                height={180}
                                                series={job.interviews.chart.map(d => d.value)}
                                                options={{
                                                    labels: job.interviews.chart.map(d => d.label),
                                                    colors: ["#3182CE", "#38A169", "#E53E3E", "#ED8936"],
                                                    legend: { position: "bottom" },
                                                    dataLabels: { enabled: true },
                                                    plotOptions: { pie: { donut: { size: "60%" } } },
                                                }}
                                            />
                                        ) : (
                                            <Flex justify="center" align="center" h="100px">
                                                <Text color="gray.400" fontSize="sm">Sem entrevistas</Text>
                                            </Flex>
                                        )}
                                    </Box>
                                </SimpleGrid>
                            </Box>
                        ))}
                    </Flex>
                ) : (
                    /* Funil de vaga única */
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md">
                            <Text fontSize="lg" fontWeight="semibold" color={textColor} mb={4}>Candidatos</Text>
                            <Chart
                                type="bar"
                                height={220}
                                series={[{ name: "Candidatos", data: funnelSingle?.candidates.chart.map(d => d.value) ?? [] }]}
                                options={{
                                    chart: { toolbar: { show: false } },
                                    plotOptions: { bar: { borderRadius: 4, columnWidth: "50%" } },
                                    dataLabels: { enabled: true },
                                    xaxis: { categories: funnelSingle?.candidates.chart.map(d => d.label) ?? [] },
                                    colors: ["#3182CE", "#38A169", "#E53E3E", "#805AD5"],
                                    grid: { borderColor: "#E2E8F0" },
                                }}
                            />
                        </Box>

                        <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md">
                            <Text fontSize="lg" fontWeight="semibold" color={textColor} mb={4}>Entrevistas</Text>
                            <Chart
                                type="donut"
                                height={220}
                                series={funnelSingle?.interviews.chart.map(d => d.value) ?? []}
                                options={{
                                    labels: funnelSingle?.interviews.chart.map(d => d.label) ?? [],
                                    colors: ["#3182CE", "#38A169", "#E53E3E", "#ED8936"],
                                    legend: { position: "bottom" },
                                    dataLabels: { enabled: true },
                                    plotOptions: { pie: { donut: { size: "60%" } } },
                                }}
                            />
                        </Box>
                    </SimpleGrid>
                )}
            </Box>
        </Flex>
    );
}
