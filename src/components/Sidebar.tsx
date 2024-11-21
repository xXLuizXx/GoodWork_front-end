import { Box, ChakraProvider, Icon, Link, Stack, StackDivider, Text } from "@chakra-ui/react";
import { RiDashboardLine } from "react-icons/ri";
import { Image } from '@chakra-ui/react';
import { TbReportAnalytics } from "react-icons/tb";
import { Categories } from "./Categories/Categories";
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react'
import { BsCardChecklist } from "react-icons/bs";

export function Sidebar(){
    return(
        <Box borderBlockEnd="1" as="aside" w="64" mr="8">
            <Stack spacing="12" align="flex-start" fontSize="14">
                <Box>
                    <Text fontWeight="bold" color="gray.500" fontSize="small">GERAL</Text>
                    <Stack spacing="4" mt="8" align="stretch">
                        <Stack borderRadius="full" h="10" w="100%" _hover={{ bgColor: 'gray.200' }} >
                            <Link display="flex" mt="2" ml="4" borderLeft="2" mr="4" alignItems="center" href="/dashboard">
                                <Icon as={RiDashboardLine} fontSize="20" w="6" h="6"/>
                                <Text ml="4" fontWeight="mediun">Dashboard</Text>
                            </Link>
                        </Stack>
                        
                        <Stack borderRadius="full" h="10" w="100%" _hover={{ bgColor: 'gray.200' }} >
                            <Link mt="2" ml="4" borderLeft="2" mr="4" display="flex" alignItems="center">
                                <ChakraProvider>
                                    <BsCardChecklist fontSize="20" w="6" h="6"/>
                                </ChakraProvider>
                                <Text ml="4" fontWeight="mediun">Empregos</Text>
                            </Link>
                        </Stack>
                    </Stack>
                </Box>
                <Box>

                    <Accordion allowMultiple>
                        <AccordionItem>
                                <AccordionButton>
                                    <Text textAlign="left" fontWeight="bold" color="gray.500" fontSize="small">CATEGORIAS</Text>
                                    <AccordionIcon />
                                </AccordionButton>
                            <AccordionPanel pb={4}>
                                <Categories/>
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion>

                </Box>
                <Box>
                    <Text fontWeight="bold" color="gray.500" fontSize="small">RELATORIOS</Text>
                    <Stack spacing="4" mt="8" align="stretch">
                        <Stack borderRadius="full" h="10" w="100%" _hover={{ bgColor: 'gray.200' }} >
                            <Link mt="2" ml="4" borderLeft="2" mr="4" display="flex" alignItems="center" href='/report'>
                                <Icon as={TbReportAnalytics} fontSize="20" w="6" h="6"/>
                                <Text ml="4" fontWeight="mediun">Relatorío</Text>
                            </Link>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
}