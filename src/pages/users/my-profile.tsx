import { Header } from "@/components/Header/Header";
import { Sidebar } from "@/components/Sidebar";
import { Flex, SimpleGrid} from "@chakra-ui/react";
import { MyProfile } from "@/components/User/DataProfileUser"
import { Helmet } from "react-helmet";

export default function Profile(){
    return (
        <Flex direction="column" h="100vh">
            <Helmet>
                <title>Perfil</title>
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
                        
                      <MyProfile/>

                    </SimpleGrid>
            </Flex>
        </Flex>
    );
}