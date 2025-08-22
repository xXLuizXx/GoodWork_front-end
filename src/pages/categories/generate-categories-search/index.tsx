import { Flex, SimpleGrid } from "@chakra-ui/react";
import { Sidebar } from "@/components/Sidebar";
import { Helmet } from "react-helmet";
import { useRouter } from "next/router";
import { HeaderAdminCategories } from "@/components/Header/HeaderAdminCategories";
import { SearchCategoryAdmin } from "@/components/Categories/SearchCategoryAdmin";
import { useState, useEffect } from "react";

export default function GenerateSearchCategories(): JSX.Element {
    const router = useRouter();
    const { search } = router.query;
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (search) {
            setSearchTerm(search as string);
        }
    }, [search]);

    return (
        <Flex direction="column" minH="100vh">
            <Helmet>
                <title>Gerenciamento de Categorias</title>
                <link rel="icon" href="/Img/logos/GoodworkSSlogan.png" type="image/png"/>
            </Helmet>
            
            <HeaderAdminCategories 
                redirectOnSearch={true}
                searchValue={searchTerm}
                onSearchChange={(value) => setSearchTerm(value)}
                onSearch={(searchValue) => {
                    router.push(`/categories/generate-categories-search?search=${encodeURIComponent(searchValue)}`);
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
                    <SearchCategoryAdmin search={searchTerm} />
                </SimpleGrid>
            </Flex>
        </Flex>
    );
}