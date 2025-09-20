import {Flex, SimpleGrid, Text, VStack, Heading, Icon, Box} from "@chakra-ui/react";
import {Sidebar} from "@/components/Sidebar";
import {Header} from "@/components/Header/Header";
import { Helmet } from "react-helmet";
import { JobsVacancy } from "@/components/Jobs/JobsIndividual/jobsVacancy";
import {useRouter} from "next/router";
import { FiSearch } from "react-icons/fi";

interface IVacancy{
    vacancy: string;
}

export default function Jobs({vacancy: string}: IVacancy): JSX.Element {
    const router = useRouter();
    const { vacancy } = router.query;

    return(
        <Flex direction="column" h="100vh">
            <Helmet>
                <title>Vagas</title>
                <link rel="icon" href="/Img/logos/GoodworkSSlogan.png" type="image/png"/>
            </Helmet>
            <Header/>

            <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
                {/* Sidebar */}
                <Box mr="8">
                    <Sidebar/>
                </Box>

                {/* Conteúdo principal */}
                <Box flex="1">
                    {/* Cabeçalho atrativo */}
                    <Flex justify="space-between" align="center" mb={6}>
                        <VStack align="start" spacing={1}>
                            <Heading size="lg" color="blue.800">
                                <Icon as={FiSearch} color="blue.500" mr={2} />
                                {vacancy ? `Resultados para "${vacancy}"` : "Buscar Vagas"}
                            </Heading>
                            <Text color="gray.600" fontSize="sm">
                                {vacancy ? 
                                    `Encontramos as melhores oportunidades relacionadas a "${vacancy}"` : 
                                    "Pesquise por vagas que combinam com seu perfil"
                                }
                            </Text>
                        </VStack>
                    </Flex>

                    {/* Grid de vagas */}
                    <SimpleGrid
                        gap="6"
                        w="100%"
                        minChildWidth="300px"
                    >
                        <JobsVacancy vacancy={vacancy}/>
                    </SimpleGrid>
                </Box>
            </Flex>
        </Flex>
    );
}