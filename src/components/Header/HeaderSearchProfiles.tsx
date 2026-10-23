import { Flex, Input, HStack, VStack, useBreakpointValue, IconButton, Image, useColorModeValue } from "@chakra-ui/react";
import { RiMenuLine, RiSearchLine } from "react-icons/ri";
import { GoXCircleFill } from "react-icons/go";
import { Profile } from "./Profile";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSidebarDrawer } from "@/contexts/SidebarDrawerContext";
import { NotificationBell } from "@/components/Notifications/NotificationBell";

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
    const headerBg = useColorModeValue("#0000CD", "gray.900");
    const searchBg = useColorModeValue("white", "whiteAlpha.200");
    const searchColor = useColorModeValue("black", "whiteAlpha.900");
    const { onOpen: onOpenSidebar } = useSidebarDrawer();

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
        router.push('/dashboard');
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
            px={{ base: "3", md: "6" }}
            align="center"
            bgColor={headerBg}
            boxShadow="dark-lg"
            borderRadius="full"
        >
            <IconButton                aria-label="Abrir menu"                icon={<RiMenuLine />}                onClick={onOpenSidebar}                display={{ base: "flex", lg: "none" }}                variant="unstyled"                color="white"                fontSize="24"                minW="8"            />

            <Image 
                src="/Img/logos/GoodWorkLogoBranco.png"
                alt="Logo GoodWork"
                w="auto"
                h={{ base: "48px", md: "75px" }}
                objectFit="contain"
                ml={{ base: "1", md: "4" }}
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
                px={{ base: "3", md: "8" }}
                ml={{ base: "2", md: "6" }}
                minW="0"
                maxWidth={1000}
                alignSelf="center"
                color="gray.50"
                position="relative"
                bg={searchBg}
                borderRadius="full"
            >
                <Input
                    color={searchColor}
                    variant="unstyled"
                    px={{ base: "1", md: "4" }}
                    mr={{ base: "1", md: "2" }}
                    minW="0"
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
                    mx={{ base: "2", md: "8" }}
                    pr={{ base: "2", md: "8" }}
                    py="3"
                    color="gray.50"
                    borderRightWidth={1}
                    borderColor="gray.100"
                >
                    <NotificationBell enabled />
                </HStack>
                <Flex align="center">
                    <Profile showProfileData={isWideVersion} />
                </Flex>
            </Flex>

            <Flex display={{ base: "none", lg: "flex" }}>
                <VStack 
                    w="100%"
                    mt="40"
                    spacing="10"
                    mx="8"
                    pr="8"
                    py="3"
                    color="gray.900"
                >
                </VStack>
            </Flex>
        </Flex>
    );
}

export { HeaderSearchProfiles };