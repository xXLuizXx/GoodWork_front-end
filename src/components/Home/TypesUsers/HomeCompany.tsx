import React, { useEffect, useState } from 'react';
import {
    SimpleGrid,
    Card,
    CardBody,
    Text,
    Box,
    Image,
    useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import CardImage from '../../../../public/Img/icons/vagasCard2.jpg';
import { parseCookies } from 'nookies';
import decode from "jwt-decode";

interface DecodedToken {
    accessLevel: string;
    sub: string;
}
export function HomeCompany(): JSX.Element {
    const router = useRouter();
    const cardBg = useColorModeValue('#FFFFFF', 'gray.800');
    const cardText = useColorModeValue('gray.800', 'whiteAlpha.900');
    const [ userId, setUserId ] = useState("");

    useEffect(() => {
        const cookies = parseCookies();
        const token = cookies["token.token"];

        if (token) {
            try {
                const decoded = decode<DecodedToken>(token);
                if (decoded.sub) {
                    setUserId(decoded.sub);
                }
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
            }
        }
    }, []);
    const cards = [
        {
            title: 'Minhas Vagas',
            borderColor: 'blue',
            route: `/jobs-company-genereted?id=${userId}`
        },
        {
            title: 'Perfis',
            borderColor: 'blue',
            route: '/users/list-users/listAllUsers'
        }
    ];

    const MotionCard = motion(Card);

    const cardImages: Record<string, string> = {
        Perfis: "/Img/icons/perfisCard2.jpg",
        default: CardImage.src
    };
    return (
        <Box p={4}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                {
                    cards.map((card, index) => (
                        <MotionCard
                            key={index}
                            borderTop="4px solid"
                            borderColor={card.borderColor}
                            borderRadius="xl"
                            w="90%"
                            h="260px"
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            cursor="pointer"
                            boxShadow="dark-lg"
                            bg={cardBg}
                            initial={{ scale: 1 }}
                            whileHover={{
                                scale: 1.1,
                                y: -10,
                                boxShadow: '0px 15px 30px rgba(0, 0, 0, 0.2)',
                                zIndex: 10
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 10,
                                duration: 0.5
                            }}
                            onClick={() => router.push(card.route)}
                        >
                            <CardBody textAlign="center">
                                <Text
                                    fontSize="xl"
                                    fontWeight="bold"
                                    color={cardText}
                                    mb={6}
                                >
                                    {card.title}
                                </Text>
                                <Image
                                    src={cardImages[card.title] || cardImages.default}
                                    alt={card.title}
                                    maxH="120px"
                                    mx="auto"
                                    objectFit="contain"
                                />
                            </CardBody>
                        </MotionCard>
                    ))
                }
            </SimpleGrid>
        </Box>
    );
}
