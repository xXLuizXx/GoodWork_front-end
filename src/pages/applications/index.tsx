import React from 'react';
import {
  Flex
} from '@chakra-ui/react';
import { Helmet } from "react-helmet";
import { Header } from '@/components/Header/Header';
import { Sidebar } from '@/components/Sidebar';
import { useRouter } from 'next/router';
import { MyApplications } from '@/components/Applications/applicationsMyVacancy';

interface IJob{
    id: string;
}
export default function GeneretedVancancys({id: string}: IJob): JSX.Element {
    const router = useRouter();
    const { id } = router.query;

    return (
        <Flex 
            as="form"
            direction="column" 
            h="100vh"
        >
            <Helmet>
                <title>Gerenciar vagas</title>
                <link rel="icon" href="/Img/logos/GoodworkSSlogan.png" type="image/png" />
            </Helmet>
            <Header />
    
            <Flex w="100%" my="8" maxWidth={1480} mx="auto" px="4">
                <Sidebar />
                <Flex 
                    justify="center" 
                    align="center"
                    height="100%"
                    width="100%"
                >
                     <MyApplications id={id}/>
                </Flex>
            </Flex>
        </Flex>
    );
}