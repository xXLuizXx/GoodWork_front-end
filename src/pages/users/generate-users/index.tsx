import { Flex, SimpleGrid } from "@chakra-ui/react";
import { Sidebar } from "@/components/Sidebar";
import { Helmet } from "react-helmet";
import { useRouter } from "next/router";
import { SearchCategoryAdmin } from "@/components/Categories/SearchCategoryAdmin";
import { useState, useEffect } from "react";
import { HeaderAdminUsers } from "@/components/Header/HeaderAdminUsers";
import { GenerateAllUsers } from "@/components/User/GenerateAllUsers";

export default function GenerateUsers(): JSX.Element {
    const router = useRouter();
    const { search } = router.query;
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        setSearchTerm(search ? (search as string) : "");
    }, [search]);

    return (
        <Flex direction="column" minH="100vh">
            <Helmet>
                <title>Gerenciamento de Usuários</title>
                <link rel="icon" href="/Img/logos/GoodworkSSlogan.png" type="image/png"/>
            </Helmet>
            
            <HeaderAdminUsers 
                redirectOnSearch={true}
                searchValue={searchTerm}
                onSearchChange={(value) => setSearchTerm(value)}
                onSearch={(searchValue) => {
                    const hasRealContent = searchValue.trim().length > 0;
                    
                    if (!hasRealContent) {
                        router.push('/users/generate-users');
                    } else {
                        router.push(`/users/generate-users?search=${encodeURIComponent(searchValue)}`);
                    }
                }}
            />

            <Flex w="100%" my="8" maxWidth={1480} mx="auto" px="4">
                <Sidebar/>
                <SimpleGrid
                    gap="2"
                    w="100%"
                    flex="1"
                    minChildWidth={[200, 250]}
                >
                    <GenerateAllUsers search={searchTerm} />
                </SimpleGrid>
            </Flex>
        </Flex>
    );
}