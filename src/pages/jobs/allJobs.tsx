import {Box, Flex, Heading, Icon, SimpleGrid, Text, VStack} from "@chakra-ui/react";
import {Sidebar} from "@/components/Sidebar";
import {Header} from "@/components/Header/Header";
import { Helmet } from "react-helmet";
import {useRouter} from "next/router";
import { Jobs } from "@/components/Jobs/JobsIndividual/jobs";
import { FiStar } from "react-icons/fi";

interface ICategoriId{
    category_id: string;
}

export default function AllJobs(): JSX.Element {
    const router = useRouter();

    return(
        <Flex direction="column" h="100vh">
            <Helmet>
                <title>Vagas</title>
                <link rel="icon" href="/Img/logos/GoodworkSSlogan.png" type="image/png"/>
            </Helmet>
            <Header/>

            <Flex w="100%" my="8" maxWidth={1480} mx="auto" px="4">
                <Box mr="8">
                    <Sidebar/>
                </Box>
                
                <Box flex="1">
                    <Flex justify="space-between" align="center" mb={6}>
                        <VStack align="start" spacing={1}>
                            <Heading size="lg" color="blue.800">
                                <Icon as={FiStar} color="yellow.400" mr={2} />
                                Todas as vagas
                            </Heading>
                            <Text color="gray.600" fontSize="sm">
                                Encontre a vaga desejada
                            </Text>
                        </VStack>
                    </Flex>
                    <SimpleGrid
                        gap="2"
                        w="100%"
                        flex="1"
                        minChildWidth={[200, 250]}
                    >
                        <Jobs/>
                    </SimpleGrid>
                </Box>
            </Flex>
        </Flex>
    );
}