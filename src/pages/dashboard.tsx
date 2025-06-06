import { Header } from "@/components/Header/Header";
import { Sidebar } from "@/components/Sidebar";
import { Flex, SimpleGrid} from "@chakra-ui/react";
import { Home } from "@/components/Home/home";
import { Helmet } from "react-helmet";

export default function Dashboard(){
    return (


        <Flex direction="column" h="100vh">
            <Helmet>
                <title>Dashboard</title>
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
                        
                        <Home/>

                    </SimpleGrid>
            </Flex>
        </Flex>
    );
}