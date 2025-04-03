import {Flex, SimpleGrid, Text} from "@chakra-ui/react";
import {Sidebar} from "@/components/Sidebar";
import {Header} from "@/components/Header/Header";
import { Helmet } from "react-helmet";
import { JobsNotValidated } from "@/components/Jobs/jobsNotValidated";
import {useRouter} from "next/router";

interface ICategoriId{
    category_id: string;
}

export default function JobsNotValidatedd(): JSX.Element {
    const router = useRouter();

    return(
        <Flex direction="column" h="100vh">
            <Helmet>
                <title>Empregos</title>
                <link rel="icon" href="/Img/logos/GoodworkSSlogan.png" type="image/png"/>
            </Helmet>
            <Header/>

            <Flex w="100%" my="8" maxWidth={1480} mx="auto" px="4">
                <Sidebar/>
                <SimpleGrid
                    gap="2"
                    w="100%"
                    flex="1"
                    minChildWidth={[200, 250]}
                >
                    <JobsNotValidated/>
                </SimpleGrid>
            </Flex>
        </Flex>
    );
}