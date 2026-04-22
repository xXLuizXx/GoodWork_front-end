import {Flex, SimpleGrid, Text, VStack, Heading, Icon, Box} from "@chakra-ui/react";
import {Sidebar} from "@/components/Sidebar";
import {Header} from "@/components/Header/Header";
import { Helmet } from "react-helmet";
import {JobsCategory} from "@/components/Jobs/JobsIndividual/jobsCategories";
import {useRouter} from "next/router";
import { FiStar } from "react-icons/fi";

interface ICategoriId{
    category_id: string;
}

export default function Jobs({category_id: string}: ICategoriId): JSX.Element {
    const router = useRouter();
    const { category_id } = router.query;

    const getCategoryName = (id: string) => {
        const categories: {[key: string]: string} = {
            '1': 'Tecnologia',
            '2': 'Design',
            '3': 'Marketing',
            '4': 'Vendas',
            '5': 'Administrativo',
            '6': 'Atendimento',
            '7': 'Saúde',
            '8': 'Educação',
        };
        return categories[id] || 'Vagas';
    };

    return(
        <Flex direction="column" minH="100vh">
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
                                Vagas em Destaque
                            </Heading>
                            <Text color="gray.600" fontSize="sm">
                                As melhores oportunidades de vagas encontradas para a categoria selecionada
                            </Text>
                        </VStack>
                    </Flex>

                    {/* Grid de vagas */}
                    <SimpleGrid
                        gap="6"
                        w="100%"
                        minChildWidth="300px"
                    >
                        <JobsCategory category_id={category_id}/>
                    </SimpleGrid>
                </Box>
            </Flex>
        </Flex>
    );
}