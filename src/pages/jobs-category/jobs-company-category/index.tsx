import {Flex, Box, Text} from "@chakra-ui/react";
import {Sidebar} from "@/components/Sidebar";
import {Header} from "@/components/Header/Header";
import { Helmet } from "react-helmet";
import { MyJobsVacancy } from "@/components/Jobs/JobsCompany/jobsCategory";
import {useRouter} from "next/router";

interface ICategoriId{
    category_id: string;
}

export default function JobsCompany({category_id: string}: ICategoriId): JSX.Element {
    const router = useRouter();
    const { category_id } = router.query;

    return(
        <Flex direction="column" minH="100vh">
            <Helmet>
                <title>Vagas</title>
                <link rel="icon" href="/Img/logos/GoodworkSSlogan.png" type="image/png"/>
            </Helmet>
            <Header/>

            <Flex w="100%" my="8" maxWidth={1480} mx="auto" px="4">
                <Sidebar/>
                <Box w="100%" flex="1">
                    <MyJobsVacancy category_id={category_id}/>
                </Box>
            </Flex>
        </Flex>
    );
}