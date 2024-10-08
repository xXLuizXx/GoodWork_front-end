import { Avatar, Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, Heading, IconButton, Image, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import {BsThreeDotsVertical} from "react-icons/bs";
import {GrFormView, GrUserAdd} from "react-icons/gr";
import { useJobsCategories } from "@/services/hooks/Jobs/useJobsCategories";
import React, { useEffect, useState } from 'react';

interface IJobsCategoriesProps{
    category_id: string;
}

export function JobsCategory({category_id}: IJobsCategoriesProps) {
    const { data } = useJobsCategories(category_id);

    return (
        <>
            {data?.jobs.map(job => (
                job.valid_vacancy && (
                    <Card
                        boxShadow="dark-lg"
                        maxW="md"
                        h="96"
                        key={job.id}
                    >
                        <CardHeader p="2.5">
                            <Flex>
                                <Flex flex="1" gap="4" alignItems="center">
                                    <Avatar name="avatar" src="./Img/icons/empresaTeste.jpg"/>
                                    <Box>
                                        <Heading size="sm">
                                            <Text fontSize="14">
                                                {job.vacancy}
                                            </Text>
                                        </Heading>
                                        <Text fontSize="12">
                                            {(job.contractor == null || job.contractor == "") ? job.user_name : job.contractor}
                                        </Text>
                                    </Box>
                                </Flex>
                                <IconButton
                                    variant="ghost"
                                    colorScheme="gray"
                                    aria-label="See menu"
                                    icon={<BsThreeDotsVertical/>}
                                />
                            </Flex>
                        </CardHeader>
                        <CardBody whiteSpace="1" h="10">
                            <VStack spacing="2"
                                    alignItems="center"
                                    height="100%"
                            >
                                <Text textAlign="justify" fontSize="12" maxW="100%" noOfLines={3}>
                                    {job.description_vacancy.toString()}
                                </Text>
                                {job.banner == null ? (
                                        <Image
                                            maxW="40%"
                                            src="./Img/icons/bannerVaga.png"
                                        />
                                    ) :
                                    <Image
                                        maxW="40%"
                                        src="./Img/icons/bannerVaga.png"
                                    />
                                }
                            </VStack>

                        </CardBody>

                        <CardFooter
                            alignItems="center"
                            p="2.5"
                            pt="1"
                        >
                            <SimpleGrid
                                gap="2"
                                w="100%"
                                flex="1"
                                minChildWidth="90px"
                            >
                                <Button variant="ghost" leftIcon={<GrUserAdd color="green"/>} size='xs'>Concorrer</Button>
                                <Button variant="ghost" leftIcon={<GrFormView color="blue"/>} size='xs'>Visualizar</Button>
                            </SimpleGrid>
                        </CardFooter>
                    </Card>
                )
            ))}
        </>
    );
}