import { Badge, Box, Button, ChakraProvider, Icon, Link, Stack, StackDivider, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { RiDashboardLine } from "react-icons/ri";
import { Image } from '@chakra-ui/react';
import { TbReportAnalytics } from "react-icons/tb";
import { Categories } from "./Categories/Categories";
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Link as ChakraLink } from '@chakra-ui/react';
import { useCountJobsNotValidated } from '@/services/hooks/Jobs/useCountJobsValidated';
import { parseCookies } from "nookies";
import decode from "jwt-decode";
import { queryClient } from "@/services/queryClient";
import { useCountCategoriesNotValidated } from "@/services/hooks/Categories/useCountCategoriesNotValidated";
import { CreateCategory } from "./Categories/CreateCategory";

interface DecodedToken {
    accessLevel: string;
    isAdmin: boolean;
    sub: string;
}

interface CountData {
    count?: number;
}

export function Sidebar(){
    const [mounted, setMounted] = useState(false);
    const [admin, setAdmin] = useState(false);
    const [ typeUser, setTypeUser ] = useState("");
    const [ userId, setUserId ] = useState("");
    const { data, isLoading } = useCountJobsNotValidated({
        enabled: admin
    });
    const { data: categoriesData, isLoading: isLoadingCategories } = useCountCategoriesNotValidated({
        enabled: admin
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const categoriesCount = Array.isArray(categoriesData) 
        ? categoriesData.length 
        : categoriesData?.categories?.length || 0;
    
    useEffect(() => {
        setMounted(true);
        
        const cookies = parseCookies();
        const token = cookies["token.token"];

        if (token) {
            try {
                const decoded = decode<DecodedToken>(token);
                setAdmin(!!decoded.isAdmin);
                setTypeUser(decoded.accessLevel);
                setUserId(decoded.sub);
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
            }
        }
    }, []);

    if (!mounted) return null;
    const count = admin ? (isLoading ? 0 : (data?.count || 0)) : 0;

    return(
        <Box borderBlockEnd="1" as="aside" w="64" mr="8">
            <ChakraProvider>
            </ChakraProvider>
            <Stack spacing="12" align="flex-start" fontSize="14">
                <Box>
                    <Text fontWeight="bold" color="gray.500" fontSize="small">GERAL</Text>
                    <Stack spacing="4" mt="8" align="stretch">
                        <Stack borderRadius="full" h="10" w="100%" _hover={{ bgColor: 'gray.200' }} >
                            <NextLink href="/dashboard" legacyBehavior>
                                <ChakraLink display="flex" mt="2" ml="4" borderLeft="2" mr="4" alignItems="center">
                                    <Icon as={RiDashboardLine} fontSize="20" w="6" h="6" />
                                    <Text ml="4" fontWeight="medium">Dashboard</Text>
                                </ChakraLink>
                            </NextLink>
                        </Stack>
                    </Stack>
                </Box>
                <Box>
                    <Accordion allowMultiple marginBottom={50}>
                        {admin &&(
                            <AccordionItem>
                                {({ isOpen }) => (
                                <>
                                <AccordionButton pb="7" position="relative">
                                    <Text textAlign="left" fontWeight="bold" color="gray.500" fontSize="small">
                                        USUÁRIOS
                                    </Text>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel>
                                    <NextLink href="/users/generate-users" legacyBehavior>
                                        <ChakraLink
                                            display="inline-flex"
                                            alignItems="center"
                                            color="gray.500"
                                            fontSize="sm"
                                            fontWeight="bold"
                                            py={2}
                                            px={4}
                                            _hover={{
                                            color: "gray.600",
                                            transform: "scale(1.05)",
                                            }}
                                            transition="all 0.3s ease"
                                            textDecoration="none"
                                            position="relative"
                                        >
                                            Gerenciar Usuários
                                        </ChakraLink>
                                    </NextLink>
                                </AccordionPanel>
                                </>
                            )}
                            </AccordionItem>
                        )}
                        <AccordionItem>
                            {({ isOpen }) => (
                            <>
                            <AccordionButton pb="7" position="relative">
                                <Text textAlign="left" fontWeight="bold" color="gray.500" fontSize="small">
                                    VAGAS
                                </Text>
                                {admin && !isOpen && count > 0 && (
                                    <Box
                                        position="absolute"
                                        right="2"
                                        top="2"
                                        bg="red.600"
                                        borderRadius="full"
                                        w="12px"
                                        h="12px"
                                        border="2px solid white"
                                        boxShadow="md"
                                        animation="pulse 1.5s infinite"
                                        css={{
                                            "@keyframes pulse": {
                                                "0%": { transform: "scale(0.95)", opacity: 0.8 },
                                                "70%": { transform: "scale(1.1)", opacity: 1 },
                                                "100%": { transform: "scale(0.95)", opacity: 0.8 },
                                            },
                                        }}
                                    />
                                )}
                                <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel>
                                {typeUser?.toString() === "company" && [
                                    {
                                        href: "/jobs/create",
                                        text: "Cadastrar nova vaga"
                                    },
                                    {
                                        href: `/jobs-company-genereted?id=${userId}`,
                                        text: "Ver minhas vagas"
                                    }
                                    ].map((link) => (
                                    <NextLink key={link.href} href={link.href} legacyBehavior passHref>
                                        <ChakraLink
                                        display="inline-block"
                                        color="gray.500"
                                        fontSize="sm"
                                        fontWeight="bold"
                                        py={2}
                                        px={4}
                                        _hover={{
                                            color: "gray.600",
                                            transform: "scale(1.05)",
                                        }}
                                        transition="all 0.3s ease"
                                        textDecoration="none"
                                        >
                                        {link.text}
                                        </ChakraLink>
                                    </NextLink>
                                ))}
                                {(typeUser?.toString() === "individual") && (!admin) && (
                                    <VStack align="start" spacing={2}>
                                        {[
                                            {
                                                href: "/jobs/jobsRecommended",
                                                text: "Recomendadas"
                                            },
                                            {
                                                href: `/jobs/allJobs`,
                                                text: "Todas"
                                            }
                                        ].map((link) => (
                                            <NextLink key={link.href} href={link.href} legacyBehavior passHref>
                                                <ChakraLink
                                                    color="gray.500"
                                                    fontSize="sm"
                                                    fontWeight="bold"
                                                    py={2}
                                                    px={4}
                                                    _hover={{
                                                        color: "gray.600",
                                                        transform: "scale(1.05)",
                                                    }}
                                                    transition="all 0.3s ease"
                                                    textDecoration="none"
                                                    display="block"
                                                    width="100%"
                                                >
                                                    {link.text}
                                                </ChakraLink>
                                            </NextLink>
                                        ))}
                                    </VStack>
                                )}
                                {admin && (
                                    <NextLink href="/jobs/jobsNotValidated" legacyBehavior>
                                        <ChakraLink
                                            display="inline-flex"
                                            alignItems="center"
                                            color="gray.500"
                                            fontSize="sm"
                                            fontWeight="bold"
                                            py={2}
                                            px={4}
                                            _hover={{
                                            color: "gray.600",
                                            transform: "scale(1.05)",
                                            }}
                                            transition="all 0.3s ease"
                                            textDecoration="none"
                                            position="relative"
                                        >
                                            Aprovar vagas
                                            {count > 0 && (
                                            <Badge
                                                ml={2}
                                                bg="red.600"
                                                color="black"
                                                borderRadius="full"
                                                boxSize="20px"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                fontSize="xs"
                                                fontWeight="extrabold"
                                                lineHeight="none"
                                                _hover={{
                                                bg: "red.500",
                                                }}
                                                transition="background 0.2s"
                                            >
                                                {count}
                                            </Badge>
                                            )}
                                        </ChakraLink>
                                    </NextLink>
                                )}
                            </AccordionPanel>
                            <AccordionPanel>
                                {admin && (
                                    <NextLink href="/jobs/generate-jobs" legacyBehavior>
                                        <ChakraLink
                                            display="inline-flex"
                                            alignItems="center"
                                            color="gray.500"
                                            fontSize="sm"
                                            fontWeight="bold"
                                            py={2}
                                            px={4}
                                            _hover={{
                                            color: "gray.600",
                                            transform: "scale(1.05)",
                                            }}
                                            transition="all 0.3s ease"
                                            textDecoration="none"
                                            position="relative"
                                        >
                                            Gerenciar Vagas
                                        </ChakraLink>
                                    </NextLink>
                                )}
                            </AccordionPanel>
                            </>
                        )}
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionButton pb="7" position="relative">
                                <Text textAlign="left" fontWeight="bold" color="gray.500" fontSize="small">
                                CATEGORIAS
                                </Text>
                                {admin && !isLoadingCategories && categoriesCount > 0 &&(
                                    <Box
                                        position="absolute"
                                        right="2"
                                        top="2"
                                        bg="red.600"
                                        borderRadius="full"
                                        w="12px"
                                        h="12px"
                                        border="2px solid white"
                                        boxShadow="md"
                                        animation="pulse 1.5s infinite"
                                        css={{
                                            "@keyframes pulse": {
                                                "0%": { transform: "scale(0.95)", opacity: 0.8 },
                                                "70%": { transform: "scale(1.1)", opacity: 1 },
                                                "100%": { transform: "scale(0.95)", opacity: 0.8 },
                                            },
                                        }}
                                    />
                                )}
                                <AccordionIcon />
                            </AccordionButton>
                            {!admin && (
                                <AccordionPanel>
                                    <Categories />
                                </AccordionPanel>
                            )}
                            

                            <AccordionPanel>
                                {!admin &&(
                                    <Box borderBottom="1px" borderColor="gray.200" my={2} />
                                )}
                                
                                {admin && (
                                    <NextLink href="/categories/generate-categories" legacyBehavior>
                                        <ChakraLink
                                            display="inline-flex"
                                            alignItems="center"
                                            color="gray.500"
                                            fontSize="sm"
                                            fontWeight="bold"
                                            py={2}
                                            px={4}
                                            _hover={{
                                            color: "gray.600",
                                            transform: "scale(1.05)",
                                            }}
                                            transition="all 0.3s ease"
                                            textDecoration="none"
                                            position="relative"
                                        >
                                            Gerenciar Categorias
                                        </ChakraLink>
                                    </NextLink>
                                    
                                )}
                            </AccordionPanel>
                            <AccordionPanel>
                                {admin && (
                                    <NextLink href="/categories/categoriesNotValidated" legacyBehavior>
                                        <ChakraLink
                                            display="inline-flex"
                                            alignItems="center"
                                            color="gray.500"
                                            fontSize="sm"
                                            fontWeight="bold"
                                            py={2}
                                            px={4}
                                            _hover={{
                                            color: "gray.600",
                                            transform: "scale(1.05)",
                                            }}
                                            transition="all 0.3s ease"
                                            textDecoration="none"
                                            position="relative"
                                        >
                                            Aprovar Categorias
                                            {categoriesCount > 0 && (
                                            <Badge
                                                ml={2}
                                                bg="red.600"
                                                color="black"
                                                borderRadius="full"
                                                boxSize="20px"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                fontSize="xs"
                                                fontWeight="extrabold"
                                                lineHeight="none"
                                                _hover={{
                                                bg: "red.500",
                                                }}
                                                transition="background 0.2s"
                                            >
                                                {categoriesCount}
                                            </Badge>
                                            )}
                                        </ChakraLink>
                                    </NextLink>
                                )}
                            </AccordionPanel>
                            <AccordionPanel>
                                {admin && (
                                    <Button 
                                        onClick={onOpen}
                                        display="inline-flex"
                                        alignItems="center"
                                        color="gray.500"
                                        fontSize="sm"
                                        bgColor="white"
                                        fontWeight="bold"
                                        py={2}
                                        px={4}
                                        _hover={{
                                        color: "gray.600",
                                        transform: "scale(1.05)",
                                        }}
                                        transition="all 0.3s ease"
                                        textDecoration="none"
                                        position="relative"
                                    >
                                        Cadastrar Categoria
                                        <CreateCategory isOpen={isOpen} onClose={onClose} />
                                    </Button>
                                )}
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion>
                </Box>

                <Box>
                    <Text fontWeight="bold" color="gray.500" fontSize="small">RELATORIOS</Text>
                    <Stack spacing="4" mt="8" align="stretch">
                        <Stack borderRadius="full" h="10" w="100%" _hover={{ bgColor: 'gray.200' }} >
                            <NextLink href="/report" legacyBehavior>
                                <ChakraLink mt="2" ml="4" borderLeft="2" mr="4" display="flex" alignItems="center">
                                    <Icon as={TbReportAnalytics} fontSize="20" w="6" h="6" />
                                    <Text ml="4" fontWeight="medium">Relatório</Text>
                                </ChakraLink>
                            </NextLink>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
}