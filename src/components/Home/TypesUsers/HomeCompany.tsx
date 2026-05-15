import React, { useEffect, useState } from 'react';
import {
    SimpleGrid,
    Card,
    CardBody,
    Text,
    Box,
    Icon,
    useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiBriefcase, FiUsers, FiCalendar, FiBarChart2 } from 'react-icons/fi';
import { parseCookies } from 'nookies';
import decode from "jwt-decode";
import { IconType } from 'react-icons';

interface DecodedToken {
    accessLevel: string;
    sub: string;
}

interface CardItem {
    title: string;
    borderColor: string;
    route: string;
    icon: IconType;
}

export function HomeCompany(): JSX.Element {
    const router = useRouter();
    const cardBg = useColorModeValue('#FFFFFF', 'gray.800');
    const cardText = useColorModeValue('gray.800', 'whiteAlpha.900');
    const iconColor = useColorModeValue('blue.500', 'blue.300');

    const [userId, setUserId] = useState("");

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

    const cards: CardItem[] = [
        { title: 'Minhas Vagas', borderColor: 'blue', route: `/jobs-company-genereted?id=${userId}`, icon: FiBriefcase },
        { title: 'Perfis',       borderColor: 'blue', route: '/users/list-users/listAllUsers',        icon: FiUsers },
        { title: 'Entrevistas',  borderColor: 'blue', route: '/interviews/manage',                    icon: FiCalendar },
        { title: 'Relatórios',   borderColor: 'blue', route: '/report',                               icon: FiBarChart2 },
    ];

    const MotionCard = motion(Card);

    return (
        <Box p={4}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
                {cards.map((card, index) => (
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
                            <Icon as={card.icon} boxSize="80px" color={iconColor} />
                        </CardBody>
                    </MotionCard>
                ))}
            </SimpleGrid>
        </Box>
    );
}
