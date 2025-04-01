import { Box, Button, ChakraProvider, Icon, Link, Stack, StackDivider, Text } from "@chakra-ui/react";
import { RiDashboardLine } from "react-icons/ri";
import { Image } from '@chakra-ui/react';
import { TbReportAnalytics } from "react-icons/tb";
import { Categories } from "./Categories/Categories";
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Link as ChakraLink } from '@chakra-ui/react';

export function Sidebar(){
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);
  
    if (!mounted) return null;
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
                <Box >
                    <Accordion allowMultiple marginBottom={50}>
                        <AccordionItem>
                            <AccordionButton pb="7">
                                <Text textAlign="left" fontWeight="bold" color="gray.500" fontSize="small">
                                    EMPREGOS
                                </Text>
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
                            </AccordionPanel>
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