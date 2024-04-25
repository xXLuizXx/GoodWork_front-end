import { Header } from "@/components/Header/Header";
import { Sidebar } from "@/components/Sidebar";
import { Box,  Flex, SimpleGrid, Text, theme} from "@chakra-ui/react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});
const options = {
    chart: {
        toolbar: {
            show: false
        },
        zoom: {
            enabled: false
        },
        foreColor: theme.colors.gray[500]
    },
    grid: {
        show: false
    },
    dataLabels: {
        enabled: false
    },
    tooltip: {
        enabled: false
    },
    xaxis: {
        type: 'datetime',
        axisBorder: {
            color: theme.colors.gray[600]
        },
        axisTicks: {
            color: theme.colors.gray[600]
        },
        categories: [
            "2024-01-19T00:00:00.000Z",
            "2024-02-19T01:30:00.000Z", 
            "2024-03-19T02:30:00.000Z", 
            "2024-04-19T03:30:00.000Z", 
            "2024-05-19T04:30:00.000Z", 
            "2024-06-19T05:30:00.000Z", 
            "2024-07-19T06:30:00.000Z",
            "2024-08-19T06:30:00.000Z",
            "2024-09-19T06:30:00.000Z",
            "2024-10-19T06:30:00.000Z",
            "2024-11-19T06:30:00.000Z",
            "2024-12-19T06:30:00.000Z"
        ],
    }
}
const series = [
    {
        name: "Teste", data: [0,1, 2, 4, 5, 6, 8, 10, 3, 1, 0, 0]
    }
]

export default function Report(){
    return (
        <Flex direction="column" h="100vh">
            <Header/>

            <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
                <Sidebar/>

                <SimpleGrid flex="1" gap="4" minChildWidth="320px">
                    <Box
                        p="8"
                        bg="gray.200"
                        borderRadius={8}
                        pb="4"
                    >
                        <Text 
                            fontSize="lg"
                            mb="4"
                        >
                            Vagas Disputadas
                        </Text>
                        <Chart options={options} series={series} type="area" height={160}/>
                    </Box>
                </SimpleGrid>
                
            </Flex>
        </Flex>
    );
}