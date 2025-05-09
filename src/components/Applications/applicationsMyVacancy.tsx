import { Avatar, Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, Heading, Text, VStack, useDisclosure, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Alert, AlertIcon, useToast, HStack, Icon, Menu, MenuButton, MenuList, MenuItem, Badge, ModalCloseButton, SimpleGrid, Image, Link, Tag, TagLabel, TagLeftIcon, Divider, Spinner, Center } from "@chakra-ui/react";
import { GrFormView } from "react-icons/gr";
import { GoXCircleFill, GoCheckCircleFill, GoFilter } from "react-icons/go";
import { useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { FiMail, FiPhone, FiBriefcase } from "react-icons/fi";
import { useRouter } from "next/router";
import { useAllApplicationsVacancy } from "@/services/hooks/applications/useAllApplicationsVacancyCompany";
import { IApplicationsVacancyCompany } from "@/services/hooks/applications/useAllApplicationsVacancyCompany";
  
interface IApplicationMyVacancyProps {
    id: string;
}

export function MyApplications({ id }: IApplicationMyVacancyProps) {
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedApplication, setSelectedApplication] = useState<IApplicationsVacancyCompany | null>(null);
    const [filter, setFilter] = useState("all");
    const toast = useToast();

    const { data: applications = [], isLoading, isError } = useAllApplicationsVacancy(id);

    const handleApprove = async (id: string, approve: boolean) => {
        try {
        // await api.patch(`/application/${id}`, { approved: approve });
        
        toast({
            title: approve ? "Candidatura aprovada" : "Candidatura rejeitada",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
        } catch (error) {
        toast({
            title: "Erro ao atualizar status",
            description: "Ocorreu um erro ao atualizar o status da candidatura",
            status: "error",
            duration: 3000,
            isClosable: true,
        });
        }
    };

    const handleViewDetails = (application: IApplicationsVacancyCompany) => {
        setSelectedApplication(application);
        onOpen();
    };

    const filteredApplications = applications.filter(app => {
        if (filter === "approved" && app.application_approved !== true) return false;
        if (filter === "rejected" && app.application_approved !== false) return false;
        if (filter === "pending" && app.application_approved !== null) return false;
        return true;
    });

    if (isLoading) {
        return (
        <Center h="200px">
            <Spinner size="xl" />
        </Center>
        );
    }

    if (isError) {
        return (
        <Alert status="error">
            <AlertIcon />
            Ocorreu um erro ao carregar as candidaturas
        </Alert>
        );
    }

    if (applications.length === 0) {
        return (
        <Alert status="info">
            <AlertIcon />
            Nenhuma candidatura encontrada para esta vaga
        </Alert>
        );
    }

    return (
        <Box p="4" width="100%" position="relative">
        <Flex 
        justify="space-between" 
        align="center" 
        mb="6" 
        p="4" 
        bg="white" 
        borderRadius="md" 
        boxShadow="lg" 
        flexWrap="wrap"
        gap="4"
        position="sticky"
        top="4"
        zIndex="10"
    >
            <HStack spacing="4">
            <Menu>
                <MenuButton 
                    as={Button} 
                    leftIcon={<Icon as={GoFilter} />} 
                    variant="outline"
                    size="sm"
                >
                    Filtrar
                </MenuButton>
                <MenuList>
                    <MenuItem onClick={() => setFilter("all")}>Todas as Candidaturas</MenuItem>
                    <MenuItem onClick={() => setFilter("approved")}>
                        Aprovadas
                        <Badge ml="2" colorScheme="green">
                            {applications.filter(a => a.application_approved === true).length}
                        </Badge>
                    </MenuItem>
                    <MenuItem onClick={() => setFilter("rejected")}>
                        Rejeitadas
                        <Badge ml="2" colorScheme="red">
                            {applications.filter(a => a.application_approved === false).length}
                        </Badge>
                    </MenuItem>
                    <MenuItem onClick={() => setFilter("pending")}>
                        Pendentes
                        <Badge ml="2" colorScheme="orange">
                            {applications.filter(a => a.application_approved === null).length}
                        </Badge>
                    </MenuItem>
                </MenuList>
            </Menu>
            </HStack>
        </Flex>

        <VStack spacing="4" align="stretch">
            {filteredApplications.map(application => (
                <Card
                    key={application.id}
                    boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    _hover={{
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        transform: "translateY(-2px) scale(1.01)",
                        borderColor: "blue.200",
                    }}
                    _active={{
                        transform: "scale(0.99)",
                    }}
                    width="100%"
                    borderRadius="xl"
                    borderWidth="1px"
                    borderColor="gray.100"
                    position="relative"
                    overflow="hidden"
                    cursor="pointer"
                    bg="white"
                    zIndex="1"
                    _before={{
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "3px",
                        bg: "blue.500",
                        transform: "scaleX(0)",
                        transformOrigin: "left",
                        transition: "transform 0.3s ease",
                    }}
                >
                    <Flex direction={{ base: "column", md: "row" }} justify="space-between">
                        <Box flex="1" p="4" borderRight={{ md: "1px" }} borderColor={{ md: "gray.200" }} minWidth="0">
                            <Flex align="center" mb="4">
                                <Avatar 
                                    name={application.user?.name} 
                                    src={application.user?.avatar || undefined} 
                                    size="lg"
                                    mr="4"
                                />
                                <Box>
                                    <Heading size="md">{application.user?.name || 'Candidato'}</Heading>
                                    <Text fontSize="sm" color="gray.500">
                                        {application.user?.individualData?.functionn || 'Função não especificada'}
                                    </Text>
                                </Box>
                            </Flex>
                    
                            <VStack align="start" spacing="2">
                                <HStack>
                                    <Icon as={FiMail} color="gray.500" />
                                    <Text fontSize="sm">{application.user?.email || 'Email não disponível'}</Text>
                                </HStack>
                                <HStack>
                                    <Icon as={FiPhone} color="gray.500" />
                                    <Text fontSize="sm">{application.user?.telephone || 'Telefone não disponível'}</Text>
                                </HStack>
                                <HStack>
                                    <Icon as={FiBriefcase} color="gray.500" />
                                    <Text fontSize="sm">
                                        Candidatou-se em: {application.created_at ? new Date(application.created_at).toLocaleDateString() : 'Data não disponível'}
                                    </Text>
                                </HStack>
                            </VStack>
                        </Box>
                    
                        <Box p="4" display="flex" alignItems="center">
                            <VStack spacing="3" align="stretch" minWidth="fit-content">
                                <Tag 
                                    size="md" 
                                    variant="subtle" 
                                    colorScheme={
                                        application.application_approved === true ? "green" : 
                                        application.application_approved === false ? "red" : "gray"
                                    }
                                    alignSelf="center"
                                >
                                    <TagLabel>
                                        {application.application_approved === true ? "Aprovado" : 
                                        application.application_approved === false ? "Rejeitado" : "Pendente"}
                                    </TagLabel>
                                </Tag>
                    
                                <Button 
                                    leftIcon={<GoCheckCircleFill />} 
                                    colorScheme="green" 
                                    size="xs"
                                    onClick={() => handleApprove(application.id, true)}
                                    isDisabled={application.application_approved === true}
                                    width="100%"
                                >
                                    Aprovar
                                </Button>
                                
                                <Button 
                                    leftIcon={<GoXCircleFill />} 
                                    colorScheme="red" 
                                    variant="outline" 
                                    size="xs"
                                    onClick={() => handleApprove(application.id, false)}
                                    isDisabled={application.application_approved === false}
                                    width="100%"
                                >
                                    Rejeitar
                                </Button>
                                
                                <Button 
                                    leftIcon={<GrFormView />} 
                                    variant="outline" 
                                    size="xs"
                                    onClick={() => handleViewDetails(application)}
                                    width="100%"
                                >
                                    Ver Detalhes
                                </Button>
                                
                                <Button 
                                    leftIcon={<Icon as={FaFilePdf} />} 
                                    variant="outline" 
                                    size="xs"
                                    as={Link}
                                    href={`${process.env.NEXT_PUBLIC_API_URL}/files/${application.curriculum_user}`}
                                    isExternal
                                    width="100%"
                                >
                                    Baixar Currículo
                                </Button>
                            </VStack>
                        </Box>
                    </Flex>
                </Card>
            ))}
        </VStack>

        {selectedApplication && (
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <Flex align="center">
                            <Avatar 
                                name={selectedApplication.user?.name} 
                                src={selectedApplication.user?.avatar || undefined} 
                                size="lg"
                                mr="4"
                            />
                            <Box>
                                <Heading size="md">{selectedApplication.user?.name}</Heading>
                                <Text fontSize="sm" color="gray.500">{selectedApplication.user.individualData?.functionn}</Text>
                            </Box>
                        </Flex>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing="4" align="stretch">
                            <Box>
                                <Heading size="sm" mb="2">Informações de Contato</Heading>
                                <SimpleGrid columns={2} spacing={4}>
                                    <HStack>
                                        <Icon as={FiMail} color="gray.500" />
                                        <Text>{selectedApplication.user?.email}</Text>
                                    </HStack>
                                    <HStack>
                                        <Icon as={FiPhone} color="gray.500" />
                                        <Text>{selectedApplication.user?.telephone}</Text>
                                    </HStack>
                                </SimpleGrid>
                            </Box>

                            <Divider />

                            <Box>
                                <Heading size="sm" mb="2">Candidatura</Heading>
                                <SimpleGrid columns={2} spacing={4}>
                                    <HStack>
                                        <Icon as={FiBriefcase} color="gray.500" />
                                        <Text>Data: {new Date(selectedApplication?.created_at).toLocaleDateString()}</Text>
                                    </HStack>
                                    <HStack>
                                        <Icon as={FaFilePdf} color="gray.500" />
                                        <Link 
                                            href={`${process.env.NEXT_PUBLIC_API_URL}/files/${selectedApplication.curriculum_user}`} 
                                            isExternal 
                                            color="blue.500"
                                        >
                                            Baixar Currículo
                                        </Link>
                                    </HStack>
                                </SimpleGrid>
                            </Box>

                            <Divider />

                            <Box>
                                <Heading size="sm" mb="2">Status</Heading>
                                <Tag 
                                    size="lg" 
                                    variant="subtle" 
                                    colorScheme={
                                    selectedApplication.application_approved === true ? "green" : 
                                    selectedApplication.application_approved === false ? "red" : "gray"
                                    }
                                >
                                    <TagLabel>
                                        {selectedApplication.application_approved === true ? "Aprovado" : 
                                        selectedApplication.application_approved === false ? "Rejeitado" : "Pendente"}
                                    </TagLabel>
                                </Tag>
                            </Box>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button 
                            colorScheme="blue" 
                            mr={3} 
                            onClick={onClose}
                        >
                            Fechar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        )}
        </Box>
    );
}