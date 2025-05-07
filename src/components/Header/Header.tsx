import { Flex, Input, Text, Icon, HStack, VStack, useBreakpointValue, IconButton, Image } from "@chakra-ui/react";
import { RiSearchLine } from "react-icons/ri";
import { Profile } from "./Profile";
import { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import decode from "jwt-decode";
import { useRouter } from "next/router";

interface IProfileProps {
    showProfileData: boolean;
}

interface DecodedToken {
    accessLevel: string;
    isAdmin: boolean;
}

function Header(): JSX.Element {
    const [admin, setAdmin] = useState(false); 
    const [typeUser, setTypeUser] = useState("");
    const [vacancy, setVacancy] = useState('');
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
                if (decoded.accessLevel) {
                    setTypeUser(decoded.accessLevel);
                    setAdmin(decoded.isAdmin);
                }
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
            }
        }
    }, []);

    const handleSearch = () => {
        if (!vacancy.trim()) return;
        
        if (admin) {
            router.push(`/jobs-vacancy?vacancy=${encodeURIComponent(vacancy)}`);
        } else if (typeUser === "company") {
            router.push(`/jobs-vacancy/jobs-company-vacancy?vacancy=${encodeURIComponent(vacancy)}`);
        } else if (typeUser === "individual") {
            router.push(`/jobs-vacancy?vacancy=${encodeURIComponent(vacancy)}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
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
                alt="Logo GoodWork"
                objectFit="contain"
                ml="4"
                loading="eager"
                transition="all 0.2s ease"
                _hover={{
                    transform: "scale(1.05)",
                    cursor: "pointer"
                }}
                onClick={() => router.push("/")}
                quality={100}
                priority
                draggable={false} 
                style={{
                    userSelect: "none"
                }}
            />
                
            <Flex
                as="form"
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
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                }}
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
                    value={vacancy}
                    onChange={(e) => setVacancy(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <IconButton
                    aria-label="Pesquisar vagas"
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

export { Header };