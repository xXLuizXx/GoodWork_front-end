import {Flex, Heading, Icon, SimpleGrid, Text, VStack, Box} from "@chakra-ui/react";
import {Sidebar} from "@/components/Sidebar";
import {Header} from "@/components/Header/Header";
import { Helmet } from "react-helmet";
import {useRouter} from "next/router";
import { JobsForUser } from "@/components/Jobs/JobsIndividual/jobsForUserLogged";
import { FiStar } from "react-icons/fi";

interface ICategoriId{
    category_id: string;
}

export default function ListJobsRecommended(): JSX.Element {
    const router = useRouter();

    return(
        <Flex direction="column" h="100vh">
            <Helmet>
                <title>Vagas</title>
                <link rel="icon" href="/Img/logos/GoodworkSSlogan.png" type="image/png"/>
            </Helmet>
            <Header/>

            <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
                <Box mr="8">
                    <Sidebar/>
                </Box>

                <Box flex="1">
                    <Flex justify="space-between" align="center" mb={6}>
                        <VStack align="start" spacing={1}>
                            <Heading size="lg" color="blue.800">
                                <Icon as={FiStar} color="yellow.400" mr={2} />
                                Vagas Recomendadas
                            </Heading>
                            <Text color="gray.600" fontSize="sm">
                                Vagas selecionadas especialmente para o seu perfil
                            </Text>
                        </VStack>
                    </Flex>
                    
                    <SimpleGrid
                        gap="6"
                        w="100%"
                        minChildWidth="300px"
                    >
                        <JobsForUser/>
                    </SimpleGrid>
                </Box>
            </Flex>
        </Flex>
    );
}