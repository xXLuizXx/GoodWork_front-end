import React from 'react';
import {
  Flex,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Button,
  Badge,
  Box,
  Stack,
  Divider,
  useToast
} from '@chakra-ui/react';
import { Jobs } from '../../Jobs/JobsIndividual/jobs';

export function HomeIndividual() {
  const toast = useToast();

  // Dados mockados - substitua por dados reais da sua API
  const openJobs = [
    {
      id: 1,
      title: 'Desenvolvedor Front-end',
      company: 'Tech Solutions',
      type: 'Remoto',
      skills: ['React', 'TypeScript', 'CSS'],
      applied: false
    },
    {
      id: 2,
      title: 'Designer UX/UI',
      company: 'Creative Agency',
      type: 'Híbrido',
      skills: ['Figma', 'User Research', 'Prototyping'],
      applied: true
    }
  ];

  const myApplications = [
    {
      id: 2,
      title: 'Designer UX/UI',
      company: 'Creative Agency',
      status: 'Em análise',
      appliedDate: '15/05/2023'
    },
    {
      id: 3,
      title: 'Product Manager',
      company: 'Digital Products',
      status: 'Entrevista agendada',
      appliedDate: '10/05/2023'
    }
  ];

  const handleApply = (jobId: number) => {
    // Lógica para candidatura
    toast({
      title: 'Candidatura enviada!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box p={4} maxWidth="1200px" mx="auto">
      {/* Seção de Vagas Abertas */}
      <Heading size="lg" mb={6} color="blue.800">
        Vagas Disponíveis
      </Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={10}>
        {openJobs.map((job) => (
          <Card key={job.id} variant="outline" borderColor="gray.200">
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Heading size="md">{job.title}</Heading>
                <Badge colorScheme="blue">{job.type}</Badge>
              </Flex>
              <Text fontSize="sm" color="gray.600">{job.company}</Text>
            </CardHeader>
            
            <CardBody>
              <Stack direction="row" wrap="wrap" spacing={2} mb={4}>
                {job.skills.map((skill, index) => (
                  <Badge key={index} colorScheme="green">{skill}</Badge>
                ))}
              </Stack>
            </CardBody>
            
            <CardFooter>
              {job.applied ? (
                <Button colorScheme="green" size="sm" isDisabled>
                  Já candidatado
                </Button>
              ) : (
                <Button 
                  colorScheme="blue" 
                  size="sm"
                  onClick={() => handleApply(job.id)}
                >
                  Candidatar-se
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>

      {/* Seção de Minhas Candidaturas */}
      <Heading size="lg" mb={6} color="blue.800">
        Minhas Candidaturas
      </Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={10}>
        {myApplications.map((application) => (
          <Card key={application.id} variant="filled" bg="blue.50">
            <CardHeader>
              <Heading size="md">{application.title}</Heading>
              <Text fontSize="sm" color="gray.600">{application.company}</Text>
            </CardHeader>
            
            <CardBody>
              <Flex align="center" justify="space-between">
                <Text fontWeight="bold">Status:</Text>
                <Badge 
                  colorScheme={
                    application.status === 'Em análise' ? 'yellow' : 
                    application.status.includes('Entrevista') ? 'green' : 'gray'
                  }
                >
                  {application.status}
                </Badge>
              </Flex>
              <Text mt={2} fontSize="sm">
                Data: {application.appliedDate}
              </Text>
            </CardBody>
            
            <CardFooter>
              <Button size="sm" variant="outline">
                Ver Detalhes
              </Button>
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>

      <Divider my={8} />

      {/* Componente Jobs */}
      <Box mb={10}>
        <Heading size="lg" mb={6} color="blue.800">
          Mais Vagas para Você
        </Heading>
        <Jobs />
      </Box>
    </Box>
  );
}