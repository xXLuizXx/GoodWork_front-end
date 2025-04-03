import { Badge, Box, Button, ChakraProvider, Icon, Link, Stack, StackDivider, Text } from "@chakra-ui/react";
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

interface DecodedToken {
    accessLevel: string;
}

interface CountData {
    count?: number;
}

export function Sidebar(){
    const [mounted, setMounted] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const { data, isLoading } = useCountJobsNotValidated({
        enabled: isAdmin
    });

    useEffect(() => {
        setMounted(true);
        
        const cookies = parseCookies();
        const token = cookies["token.token"];

        if (token) {
            try {
                const decoded = decode<DecodedToken>(token);
                setIsAdmin(!!decoded.accessLevel); // Define isAdmin baseado no token
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
            }
        }
    }, []);

    if (!mounted) return null;

    const count = isAdmin ? (isLoading ? 0 : (data?.count || 0)) : 0;

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
                        <AccordionItem>
                            {({ isOpen }) => (
                            <>
                            <AccordionButton pb="7" position="relative">
                                <Text textAlign="left" fontWeight="bold" color="gray.500" fontSize="small">
                                    EMPREGOS
                                </Text>
                                {isAdmin && !isOpen && count > 0 && (
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
                                <NextLink href="/jobs/create" legacyBehavior>
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
                                        Cadastrar nova vaga
                                    </ChakraLink>
                                </NextLink>
                                
                                {isAdmin && (
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
                            </>
                        )}
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionButton pb="7">
                                <Text textAlign="left" fontWeight="bold" color="gray.500" fontSize="small">
                                    CATEGORIAS
                                </Text>
                                <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel>
                                <Categories />
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