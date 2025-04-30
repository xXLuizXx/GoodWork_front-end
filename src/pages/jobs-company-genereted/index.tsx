import React from 'react';
import {
  Flex
} from '@chakra-ui/react';
import { Helmet } from "react-helmet";
import { MyVacancy } from '@/components/Jobs/JobsCompany/myVancancys';
import { Header } from '@/components/Header/Header';
import { Sidebar } from '@/components/Sidebar';
import { useRouter } from 'next/router';

interface IUser{
    id: string;
}
export default function GeneretedVancancys({id: string}: IUser): JSX.Element {
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
                     <MyVacancy id={id}/>
                </Flex>
            </Flex>
        </Flex>
    );
}