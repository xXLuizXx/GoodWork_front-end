import { Flex, SimpleGrid } from "@chakra-ui/react";
import { Sidebar } from "@/components/Sidebar";
import { Helmet } from "react-helmet";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { GenerateAllJobs } from "@/components/Jobs/JobsGenerate/GenerateAllJobs";
import { HeaderAdminJobs } from "@/components/Header/HeaderAdminJobs";

export default function GenerateJobs(): JSX.Element {
    const router = useRouter();
    const { search } = router.query;
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (search !== undefined) {
            setSearchTerm(search as string);
        } else {
            setSearchTerm("");
        }
    }, [search]);

    const handleSearch = (searchValue: string) => {
        setSearchTerm(searchValue);
        
        if (searchValue.trim().length > 0) {
            router.push(`/jobs/generate-jobs?search=${encodeURIComponent(searchValue)}`);
        } else {
            router.push('/jobs/generate-jobs');
        }
    };

    return (
        <Flex direction="column" minH="100vh">
            <Helmet>
                <title>Gerenciamento de Vagas</title>
                <link rel="icon" href="/Img/logos/GoodworkSSlogan.png" type="image/png"/>
            </Helmet>
            
            <HeaderAdminJobs 
                redirectOnSearch={true}
                searchValue={searchTerm}
                onSearchChange={(value) => setSearchTerm(value)}
                onSearch={handleSearch}
            />

            <Flex w="100%" my="8" maxWidth={1480} mx="auto" px="4">
                <Sidebar/>
                <SimpleGrid
                    gap="2"
                    w="100%"
                    flex="1"
                    minChildWidth={[200, 250]}
                >
                    <GenerateAllJobs search={searchTerm}/>
                </SimpleGrid>
            </Flex>
        </Flex>
    );
}