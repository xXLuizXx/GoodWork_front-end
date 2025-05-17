import { Flex, Input, HStack, VStack, useBreakpointValue, IconButton, Image } from "@chakra-ui/react";
import { RiSearchLine } from "react-icons/ri";
import { Profile } from "./Profile";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface IProfileProps {
    showProfileData: boolean;
}

interface IHeaderProps {
    id: string;
    searchValue?: string;
    onSearch?: (term: string) => void;
    onClearSearch?: () => void;
    onSearchComplete?: () => void; // Nova prop
}

function HeaderSearchProfiles({ searchValue, id, onSearch, onClearSearch, onSearchComplete }: IHeaderProps) {
    const [localSearchTerm, setLocalSearchTerm] = useState(searchValue || '');
    const router = useRouter();
    const isWideVersion = useBreakpointValue({
        base: false,
        lg: true,
    });

    useEffect(() => {
        setLocalSearchTerm(searchValue || '');
    }, [searchValue]);

    const handleSearch = async () => {
        const term = localSearchTerm.trim();
        if (!term) {
            if (onClearSearch) onClearSearch();
            return;
        }
        
        if (onSearch) {
            await onSearch(term);
        } else {
            await router.push({
                pathname: '/users/list-users/searchUsers',
                query: { search: term, userId: id }
            });
        }
        
        // Chama o callback de conclusão
        if (onSearchComplete) onSearchComplete();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    const handleLogoClick = () => {
        setLocalSearchTerm('');
        if (onClearSearch) onClearSearch();
        router.push('/');
    };

    return (
        <Flex
            as="header"
            w="100%"
            maxWidth={1680}
            h="20"
            mx="auto"
            mt="4"
            px="6"
            align="center"
            bgColor="#0000CD"
            boxShadow="dark-lg"
            borderRadius="full"
        >
            <Image 
                src="/Img/logos/GoodWorkLogoBranco.png"
                alt="Logo GoodWork"
                w="auto"
                h="75px"
                objectFit="contain"
                ml="4"
                loading="eager"
                transition="all 0.2s ease"
                _hover={{
                    transform: "scale(1.05)",
                    cursor: "pointer"
                }}
                onClick={handleLogoClick}
                draggable={false} 
                style={{
                    userSelect: "none"
                }}
            />
                
            <Flex
                flex="1"
                py="2"
                px="8"
                ml="6"
                maxWidth={1000}
                alignSelf="center"
                color="gray.50"
                position="relative"
                bg="gray.200"
                borderRadius="full"
            >
                <Input
                    color="black"
                    variant="unstyled"
                    px="4"
                    mr="4"
                    placeholder="Buscar perfis por nome, função ou habilidade"
                    _placeholder={{
                        color: "gray.500"
                    }}
                    value={localSearchTerm}
                    onChange={(e) => setLocalSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <IconButton
                    aria-label="Pesquisar perfis, funções ou habilidades"
                    icon={<RiSearchLine />}
                    onClick={handleSearch}
                    variant="unstyled"
                    color="gray.500"
                    _hover={{ color: "blue.500" }}
                />
            </Flex>

            <Flex align="center" ml="auto">
                <HStack 
                    spacing="4"
                    mx="8"
                    pr="8"
                    py="3"
                    color="gray.50"
                    borderRightWidth={1}
                    borderColor="gray.100"
                >
                </HStack>
                <Flex align="center">
                    <Profile showProfileData={isWideVersion} />
                </Flex>
            </Flex>

            <Flex>
                <VStack 
                    w="100%"
                    mt="40"
                    spacing="10"
                    mx="8"
                    pr="8"
                    py="3"
                    color="gray.900"
                    borderRightWidth={1}
                    borderColor="gray.100"
                >
                </VStack>
            </Flex>
        </Flex>
    );
}

export { HeaderSearchProfiles };