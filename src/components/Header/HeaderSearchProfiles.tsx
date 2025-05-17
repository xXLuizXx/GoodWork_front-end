import { Flex, Input, HStack, VStack, useBreakpointValue, IconButton, Image } from "@chakra-ui/react";
import { RiSearchLine } from "react-icons/ri";
import { GoXCircleFill } from "react-icons/go";
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
    onSearchComplete?: () => void;
}

function HeaderSearchProfiles({ searchValue, id, onSearch, onClearSearch, onSearchComplete }: IHeaderProps) {
    const [localSearchTerm, setLocalSearchTerm] = useState(searchValue || '');
    const [isSearching, setIsSearching] = useState(false);
    const router = useRouter();

    const handleSearch = async () => {
        const term = localSearchTerm.trim();
        if (!term) return;

        setIsSearching(true);
        
        try {
            if (onSearch) {
                await onSearch(term);
            }
            setLocalSearchTerm('');
            if (onSearchComplete) onSearchComplete();
        } finally {
            setIsSearching(false);
        }
    };

    const handleClear = () => {
        setLocalSearchTerm('');
        if (onClearSearch) onClearSearch();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    const handleLogoClick = () => {
        handleClear();
        router.push('/');
    };

    const isWideVersion = useBreakpointValue({
        base: false,
        lg: true,
    });

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
                    mr="2"
                    placeholder="Buscar perfis por nome, função ou habilidade"
                    _placeholder={{
                        color: "gray.500"
                    }}
                    value={localSearchTerm}
                    onChange={(e) => setLocalSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                {localSearchTerm && (
                    <IconButton
                        aria-label="Limpar pesquisa"
                        icon={<GoXCircleFill />}
                        onClick={handleClear}
                        variant="unstyled"
                        color="gray.500"
                        _hover={{ color: "red.500" }}
                        mr="2"
                        size="sm"
                    />
                )}

                <IconButton
                    aria-label="Pesquisar perfis"
                    icon={<RiSearchLine />}
                    onClick={handleSearch}
                    variant="unstyled"
                    color={localSearchTerm.trim() ? "blue.500" : "gray.500"}
                    _hover={{ color: "blue.600" }}
                    isLoading={isSearching}
                    isDisabled={!localSearchTerm.trim()}
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