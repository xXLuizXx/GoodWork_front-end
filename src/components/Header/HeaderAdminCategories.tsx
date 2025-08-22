import { Flex, Input, HStack, VStack, useBreakpointValue, IconButton, Image } from "@chakra-ui/react";
import { RiSearchLine } from "react-icons/ri";
import { Profile } from "./Profile";
import { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import decode from "jwt-decode";
import { useRouter } from "next/router";


interface DecodedToken {
    isAdmin: boolean;
}

interface HeaderProps {
    onSearch?: (searchTerm: string) => void;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    redirectOnSearch?: boolean;
}

function HeaderAdminCategories({ onSearch, searchValue, onSearchChange, redirectOnSearch = true }: HeaderProps): JSX.Element {
    const [admin, setAdmin] = useState(false); 
    const [typeUser, setTypeUser] = useState("");
    const [localCategory, setLocalCategory] = useState('');
    const router = useRouter();
    const isWideVersion = useBreakpointValue({
        base: false,
        lg: true,
    });

    useEffect(() => {
        const cookies = parseCookies();
        const token = cookies["token.token"];

        if (token) {
            try {
                const decoded = decode<DecodedToken>(token);
                if (decoded.isAdmin) {
                    setAdmin(decoded.isAdmin);
                }
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
            }
        }
    }, []);

    const handleSearch = () => {
        const currentCategory = searchValue !== undefined ? searchValue : localCategory;
        if (!currentCategory.trim()) return;
        
        if (onSearch) {
            onSearch(currentCategory);
        }

        if (redirectOnSearch) {
            router.push(`/categories/generate-categories-search?search=${encodeURIComponent(currentCategory)}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
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
                onClick={() => router.push("/")}
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
                    placeholder="Buscar"
                    _placeholder={{
                        color: "gray.500"
                    }}
                    value={searchValue !== undefined ? searchValue : localCategory}
                    onChange={(e) => onSearchChange ? onSearchChange(e.target.value) : setLocalCategory(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <IconButton
                    aria-label="Buscar"
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

export { HeaderAdminCategories };