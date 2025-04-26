import React from 'react';
import {
  SimpleGrid,
  Card,
  CardBody,
  Text,
  Box,
  Image
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

// Importando imagem
import CardImage from '../../../../public/Img/icons/vagasCard.png';

export function HomeCompany(): JSX.Element {
  const router = useRouter();

  const cards = [
    {
      title: 'Vagas',
      borderColor: 'blue',
      bgColor: '#FFFFFF',
      hoverColor: '#FFFFFF',
      route: '/jobs-company-genereted/generetedVancancys'
    },
    {
      title: 'Candidaturas (7d)',
      borderColor: 'blue',
      bgColor: '#FFFFFF',
      hoverColor: '#FFFFFF',
      route: '/company/applications'
    },
    {
      title: 'Perfis',
      borderColor: 'blue',
      bgColor: '#FFFFFF',
      hoverColor: '#FFFFFF',
      route: '/company/saved-profiles'
    }
  ];

  const MotionCard = motion(Card);

  return (
    <Box p={4}>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
        {cards.map((card, index) => (
          <MotionCard
          key={index}
          borderTop="4px solid"
          borderColor={card.borderColor}
          borderRadius="xl"
          h="240px"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          cursor="pointer"
          boxShadow="dark-lg"

          bg={card.bgColor}
          initial={{ scale: 1 }}
          whileHover={{ 
            scale: 1.1,
            y: -10,
            boxShadow: '0px 15px 30px rgba(0, 0, 0, 0.2)',
            borderColor: card.hoverColor,
            backgroundColor: card.hoverColor,
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
                color="gray.800"
                mb={6}
              >
                {card.title}
              </Text>
              <Image
                src={CardImage.src}
                alt={card.title}
                maxH="120px"
                mx="auto"
                objectFit="contain"
              />
            </CardBody>
          </MotionCard>
        ))}
      </SimpleGrid>
    </Box>
  );
}