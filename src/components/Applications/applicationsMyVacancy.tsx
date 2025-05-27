import { 
    Avatar, Box, Button, Card, Center, Divider, Flex, Heading, HStack, 
    Icon, Link, Modal, ModalBody, ModalCloseButton, ModalContent, 
    ModalFooter, ModalHeader, ModalOverlay, Spinner, Tag, TagLabel, 
    Text, useDisclosure, useToast, VStack, Alert, AlertIcon, Menu, 
    MenuButton, MenuList, MenuItem, Badge, SimpleGrid 
} from "@chakra-ui/react";
import { GrFormView } from "react-icons/gr";
import { GoXCircleFill, GoCheckCircleFill, GoFilter } from "react-icons/go";
import { useState, useEffect } from "react";
import { FaFilePdf } from "react-icons/fa";
import { FiMail, FiPhone, FiBriefcase } from "react-icons/fi";
import { useRouter } from "next/router";
import { useAllApplicationsVacancy } from "@/services/hooks/applications/useAllApplicationsVacancyCompany";
import { IApplicationsVacancyCompany } from "@/services/hooks/applications/useAllApplicationsVacancyCompany";
import { api } from "@/services/apiClient";
import { ChevronLeftIcon } from "@chakra-ui/icons";

interface IApplicationMyVacancyProps {
   id: string;
}

interface ApprovalList {
    [key: string]: {
        id: string;
        approved: boolean | null;
    };
}

interface ApplicationDecision {
    job_id: string;
    approved: boolean;
}

interface FinalApprovalPayload {
    decisions: FinalApprovalPayload;
    selected_count: number;
}

const ITEMS_PER_PAGE = 10;

export function MyApplications({ id }: IApplicationMyVacancyProps) {
    const router = useRouter();
    const { 
        isOpen: isDetailsOpen, 
        onOpen: onDetailsOpen, 
        onClose: onDetailsClose 
    } = useDisclosure();
    const { 
        isOpen: isConfirmOpen, 
        onOpen: onConfirmOpen, 
        onClose: onConfirmClose 
    } = useDisclosure();
    const [selectedApplication, setSelectedApplication] = useState<IApplicationsVacancyCompany | null>(null);
    const [filter, setFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [approvalAction, setApprovalAction] = useState<{type: 'approve' | 'reject', id: string} | null>(null);
    const toast = useToast();

    const [approvalList, setApprovalList] = useState<ApprovalList>({});

    const [approvedCount, setApprovedCount] = useState(0);
    const [rejectedCount, setRejectedCount] = useState(0);
    const [isFinalizing, setIsFinalizing] = useState(false);

    const { data: applications = [], isLoading, isError } = useAllApplicationsVacancy(id);
    const totalApplicationVacancy = applications.length;
    const totalVacancyJob = applications[0]?.job?.amount_vacancy || 0;
    const remainingPositions = totalVacancyJob - approvedCount;

    useEffect(() => {
        if (applications.length > 0) {
            const initialApprovalList: ApprovalList = {};
            applications.forEach(app => {
                initialApprovalList[app.id] = {
                    id: app.id,
                    approved: app.application_approved
                };
            });
            setApprovalList(initialApprovalList);
            
            setApprovedCount(applications.filter(app => app.application_approved === true).length);
            setRejectedCount(applications.filter(app => app.application_approved === false).length);
        }
    }, [applications]);

    useEffect(() => {
        const cachedData = localStorage.getItem(`approvalCache_${id}`);
        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            if (Date.now() - timestamp < 1800000) {
                setApprovalList(data);
                setApprovedCount(Object.values(data).filter(app => app.approved === true).length);
                setRejectedCount(Object.values(data).filter(app => app.approved === false).length);
            }
        }
    }, [id]);

    const allPositionsFilled = approvedCount >= totalVacancyJob;

    const handleConfirmAction = () => {
        if (!approvalAction) return;
        
        const { type, id } = approvalAction;
        const isApproving = type === 'approve';

        setApprovalList(prev => ({
            ...prev,
            [id]: {
                id,
                approved: isApproving ? true : false
            }
        }));

        if (isApproving) {
            setApprovedCount(prev => prev + 1);
            if (approvalList[id]?.approved === false) {
                setRejectedCount(prev => prev - 1);
            }
        } else {
            setRejectedCount(prev => prev + 1);
            if (approvalList[id]?.approved === true) {
                setApprovedCount(prev => prev - 1);
            }
        }

        toast({
            title: isApproving ? "Candidatura aprovada" : "Candidatura rejeitada",
            status: "success",
            duration: 3000,
            isClosable: true,
        });

        onConfirmClose();
    };

    const handleApproveClick = (id: string) => {
        setApprovalAction({ type: 'approve', id });
        onConfirmOpen();
    };

    const handleRejectClick = (id: string) => {
        setApprovalAction({ type: 'reject', id });
        onConfirmOpen();
    };

    const handleFinalizeApprovals = async () => {
        setIsFinalizing(true);
        
        try {
            const payload = {
                decisions: {} as FinalApprovalPayload,
                selected_count: approvedCount
            };
            
            Object.values(approvalList).forEach(app => {
                payload.decisions[app.id] = {
                    job_id: id,
                    approved: app.approved === true
                };
            });

            await api.patch(`/application/finalizeApplications`, payload);
            
            const pendingApplications = applications.filter(app => approvalList[app.id]?.approved === null);
            const newApprovalList = { ...approvalList };
            
            pendingApplications.forEach(app => {
                newApprovalList[app.id] = {
                    id: app.id,
                    approved: false
                };
            });

            setApprovalList(newApprovalList);
            setRejectedCount(prev => prev + pendingApplications.length);

            localStorage.setItem(`approvalCache_${id}`, JSON.stringify({
                data: newApprovalList,
                timestamp: Date.now()
            }));
            
            toast({
                title: "Processo finalizado!",
                description: "Todas as candidaturas foram avaliadas com sucesso.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });

        } catch (error) {
            toast({
                title: "Erro ao finalizar",
                description: error.message || "Ocorreu um erro ao finalizar o processo",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
          setIsFinalizing(false);
        }
    };

    const handleViewDetails = (application: IApplicationsVacancyCompany) => {
        setSelectedApplication(application);
        onDetailsOpen();
    };

    const filteredApplications = applications.filter(app => {
        const status = approvalList[app.id]?.approved;
        if (filter === "approved" && status !== true) return false;
        if (filter === "rejected" && status !== false) return false;
        if (filter === "pending" && status !== null) return false;

        return true;
    });

    const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);
    const paginatedApplications = filteredApplications.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

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
                zIndex="9"
            >
              <HStack spacing="4">
                  <Text fontWeight="bold" fontSize="sm">
                      Vagas: {approvedCount}/{totalVacancyJob} | 
                      Candidaturas: {totalApplicationVacancy} | 
                      Selecionadas: {approvedCount} | 
                      Rejeitadas: {rejectedCount}
                  </Text>
                  
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
                          <MenuItem onClick={() => { setFilter("all"); setCurrentPage(1); }}>
                              Todas as Candidaturas
                          </MenuItem>
                          <MenuItem onClick={() => { setFilter("approved"); setCurrentPage(1); }}>
                              Aprovadas
                              <Badge ml="2" colorScheme="green">
                                  {applications.filter(a => approvalList[a.id]?.approved === true).length}
                              </Badge>
                          </MenuItem>
                          <MenuItem onClick={() => { setFilter("rejected"); setCurrentPage(1); }}>
                              Rejeitadas
                              <Badge ml="2" colorScheme="red">
                                  {applications.filter(a => approvalList[a.id]?.approved === false).length}
                              </Badge>
                          </MenuItem>
                          <MenuItem onClick={() => { setFilter("pending"); setCurrentPage(1); }}>
                              Pendentes
                              <Badge ml="2" colorScheme="orange">
                                  {applications.filter(a => approvalList[a.id]?.approved === null).length}
                              </Badge>
                          </MenuItem>
                      </MenuList>
                  </Menu>
                </HStack>

                {/* {allPositionsFilled && applications[0]?.job?.vacancy_available !== false && (
                    <Button
                        colorScheme="green"
                        onClick={handleFinalizeApprovals}
                        isLoading={isFinalizing}
                        size="sm"
                    >
                        Finalizar Processo
                    </Button>
                )} */}
                {approvedCount >= 1 && applications[0]?.job?.vacancy_available !== false && (
                    <Button
                        colorScheme="green"
                        onClick={handleFinalizeApprovals}
                        isLoading={isFinalizing}
                        size="sm"
                    >
                        {approvedCount < totalVacancyJob 
                            ? `Aprovar candidatos selecionados`
                            : `Finalizar Processo`
                        }
                    </Button>
                )}
            </Flex>

            {allPositionsFilled && (
                <Alert status="info" mb="4">
                    <AlertIcon />
                    Todas as vagas foram preenchidas. Agora você só pode rejeitar candidatos.
                </Alert>
            )}

            <VStack spacing="4" align="stretch">
                {paginatedApplications.map(application => {
                    const isApproved = approvalList[application.id]?.approved === true;
                    const isRejected = approvalList[application.id]?.approved === false;
                    
                    return (
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
                                <Box flex="1" p="4" borderRight={{ md: "1px" }} borderColor={{ md: "gray.200" }}>
                                    <Flex align="center" mb="4">
                                        <Avatar 
                                            name={application.user?.name} 
                                            src={application.user?.avatar} 
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
                                                {application.created_at ? new Date(application.created_at).toLocaleDateString() : 'Data não disponível'}
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
                                                isApproved ? "green" : 
                                                isRejected ? "red" : "gray"
                                            }
                                            alignSelf="center"
                                        >
                                            <TagLabel>
                                                {isApproved ? "Aprovado" : 
                                                isRejected ? "Rejeitado" : "Pendente"}
                                            </TagLabel>
                                        </Tag>
                                
                                        {!applications[0]?.job?.vacancy_available === false &&(
                                            <Button 
                                                leftIcon={<GoCheckCircleFill />}
                                                bgColor="green.300"
                                                colorScheme={isApproved ? "green" : "gray"} 
                                                variant={isApproved ? "solid" : "outline"}
                                                size="xs"
                                                onClick={() => handleApproveClick(application.id)}
                                                isDisabled={isApproved || applications[0]?.job?.vacancy_available === false || allPositionsFilled}
                                                width="100%"
                                            >
                                                {isApproved ? "Candidato Selecionado" : `Selecionar`}
                                            </Button>
                                        )}
                                        {!applications[0]?.job?.vacancy_available === false &&(
                                            <Button 
                                                leftIcon={<GoXCircleFill />} 
                                                bgColor="red.400"
                                                colorScheme={isRejected ? "red" : "gray"} 
                                                variant={isRejected ? "solid" : "outline"} 
                                                size="xs"
                                                onClick={() => handleRejectClick(application.id)}
                                                isDisabled={isRejected}
                                                width="100%"
                                            >
                                                {isRejected ? "Rejeição confirmada" : "Rejeitar"}
                                            </Button>
                                        )}
                                        <Button 
                                            leftIcon={<GrFormView />} 
                                            variant="outline" 
                                            bgColor="blue.500"
                                            size="xs"
                                            onClick={() => handleViewDetails(application)}
                                            width="100%"
                                        >
                                            Ver Detalhes
                                        </Button>
                                      
                                        <Button 
                                            leftIcon={<Icon color="red" as={FaFilePdf} />} 
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
                    );
                })}
            </VStack>

            {totalPages > 1 && (
                <Flex justify="center" mt="6" gap="2">
                    <Button 
                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                        isDisabled={currentPage === 1}
                        size="sm"
                    >
                        Anterior
                    </Button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <Button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            colorScheme={currentPage === page ? "blue" : "gray"}
                            size="sm"
                        >
                            {page}
                        </Button>
                    ))}
                    
                    <Button 
                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                        isDisabled={currentPage === totalPages}
                        size="sm"
                    >
                        Próxima
                    </Button>
                </Flex>
            )}

            {selectedApplication && (
                <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} size="xl">
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>
                          <Flex align="center">
                            <Avatar 
                              name={selectedApplication.user?.name} 
                              src={selectedApplication.user?.avatar} 
                              size="lg"
                              mr="4"
                            />
                            <Box>
                              <Heading size="md">{selectedApplication.user?.name}</Heading>
                              <Text fontSize="sm" color="gray.500">
                                {selectedApplication.user?.individualData?.functionn}
                              </Text>
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
                                      <Text>Data: {new Date(selectedApplication.created_at).toLocaleDateString()}</Text>
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
                                      approvalList[selectedApplication.id]?.approved === true ? "green" : 
                                      approvalList[selectedApplication.id]?.approved === false ? "red" : "gray"
                                    }
                                  >
                                    <TagLabel>
                                      {approvalList[selectedApplication.id]?.approved === true ? "Aprovado" : 
                                      approvalList[selectedApplication.id]?.approved === false ? "Rejeitado" : "Pendente"}
                                    </TagLabel>
                                  </Tag>
                                </Box>
                            </VStack>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="blue" onClick={onDetailsClose}>
                                Fechar
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}

            <Modal isOpen={isConfirmOpen} onClose={onConfirmClose} size="md">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {approvalAction?.type === 'approve' ? 'Confirmar seleção' : 'Confirmar rejeição'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>
                            {approvalAction?.type === 'approve' 
                              ? 'Tem certeza que deseja selecionar este candidato?' 
                              : 'Tem certeza que deseja rejeitar este candidato?'}
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" mr={3} onClick={onConfirmClose}>
                            Cancelar
                        </Button>
                        <Button 
                            colorScheme={approvalAction?.type === 'approve' ? 'green' : 'red'} 
                            onClick={handleConfirmAction}
                        >
                            {approvalAction?.type === 'approve' ? 'Confirmar seleção' : 'Confirmar rejeição'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}