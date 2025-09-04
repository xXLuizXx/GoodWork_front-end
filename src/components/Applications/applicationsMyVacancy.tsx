import { 
    Avatar, Box, Button, Card, Center, Divider, Flex, Heading, HStack, 
    Icon, Link, Modal, ModalBody, ModalCloseButton, ModalContent, 
    ModalFooter, ModalHeader, ModalOverlay, Spinner, Tag, TagLabel, 
    Text, useDisclosure, useToast, VStack, Alert, AlertIcon, Menu, 
    MenuButton, MenuList, MenuItem, Badge, SimpleGrid, Grid, GridItem
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
    const [draggedItem, setDraggedItem] = useState<string | null>(null);

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

    const handleDragStart = (e: React.DragEvent, applicationId: string) => {
        e.dataTransfer.setData("applicationId", applicationId);
        setDraggedItem(applicationId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, targetStatus: boolean | null) => {
        e.preventDefault();
        const applicationId = e.dataTransfer.getData("applicationId");
        
        if (applicationId) {
            const isApproving = targetStatus === true;
            
            if (isApproving && allPositionsFilled) {
                toast({
                    title: "Todas as vagas já foram preenchidas",
                    description: "Não é possível aprovar mais candidatos.",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }
            
            setApprovalList(prev => ({
                ...prev,
                [applicationId]: {
                    id: applicationId,
                    approved: targetStatus
                }
            }));

            // Atualizar contadores
            const currentStatus = approvalList[applicationId]?.approved;
            
            if (targetStatus === true) {
                setApprovedCount(prev => prev + 1);
                if (currentStatus === false) {
                    setRejectedCount(prev => prev - 1);
                }
            } else if (targetStatus === false) {
                setRejectedCount(prev => prev + 1);
                if (currentStatus === true) {
                    setApprovedCount(prev => prev - 1);
                }
            } else {
                // Se voltou para pendente
                if (currentStatus === true) {
                    setApprovedCount(prev => prev - 1);
                } else if (currentStatus === false) {
                    setRejectedCount(prev => prev - 1);
                }
            }

            toast({
                title: isApproving ? "Candidato selecionado" : targetStatus === false ? "Candidato rejeitado" : "Candidato movido para pendentes",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
        }
        setDraggedItem(null);
    };

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
            title: isApproving ? "Candidato(a) selecionado(a). Ao final finalize o processo de seleção" : "Candidato(a) rejeitado(a). Ao final finalize o processo de seleção",
            status: "success",
            duration: 3000,
            isClosable: true,
        });

        onConfirmClose();
    };

    const handleApproveClick = (id: string) => {
        if (allPositionsFilled) {
            toast({
                title: "Todas as vagas já foram preenchidas",
                description: "Não é possível aprovar mais candidatos.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        
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

    // Separar aplicações por status
    const pendingApplications = applications.filter(app => approvalList[app.id]?.approved === null);
    const approvedApplications = applications.filter(app => approvalList[app.id]?.approved === true);
    const rejectedApplications = applications.filter(app => approvalList[app.id]?.approved === false);

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

    // Componente de card de aplicação (reutilizável)
    const ApplicationCard = ({ application }: { application: IApplicationsVacancyCompany }) => {
        const isApproved = approvalList[application.id]?.approved === true;
        const isRejected = approvalList[application.id]?.approved === false;
        
        return (
            <Card 
                key={application.id} 
                draggable
                onDragStart={(e) => handleDragStart(e, application.id)}
                boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)" 
                transition="all 0.2s ease" 
                _hover={{ 
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
                    transform: "translateY(-2px)", 
                }} 
                width="100%" 
                borderRadius="md" 
                borderWidth="1px" 
                borderColor="gray.200" 
                position="relative" 
                overflow="hidden" 
                cursor="grab" 
                bg="white" 
                zIndex="1" 
                mb={3}
                p={3}
            >
                <Flex direction="row" justify="space-between" align="center">
                    <Flex align="center" flex="1">
                        <Avatar 
                            name={application.user?.name} 
                            src={application.user?.avatar ? `${process.env.NEXT_PUBLIC_API_URL}/avatars/${application.user?.avatar}` : "../../../Img/icons/avatarLogin.png"}
                            size="sm"
                            mr="3"
                        />
                        <Box flex="1">
                            <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                                {application.user?.name || 'Candidato'}
                            </Text>
                            <Text fontSize="xs" color="gray.500" noOfLines={1}>
                                {application.user?.individualData?.functionn || 'Função não especificada'}
                            </Text>
                            <HStack spacing={2} mt={1}>
                                <Icon as={FiMail} color="gray.400" boxSize={3} />
                                <Text fontSize="xs" color="gray.600" noOfLines={1}>
                                    {application.user?.email || 'Email não disponível'}
                                </Text>
                            </HStack>
                            <HStack spacing={2}>
                                <Icon as={FiPhone} color="gray.400" boxSize={3} />
                                <Text fontSize="xs" color="gray.600">
                                    {application.user?.telephone || 'Telefone não disponível'}
                                </Text>
                            </HStack>
                        </Box>
                    </Flex>
                
                    <VStack spacing={1} align="stretch" ml={2}>
                        <Tag 
                            size="sm" 
                            variant="subtle" 
                            colorScheme={
                                isApproved ? "green" : 
                                isRejected ? "red" : "gray"
                            }
                            alignSelf="center"
                            width="100%"
                            justifyContent="center"
                        >
                            <TagLabel fontSize="xs">
                                {isApproved ? "Selecionado" : 
                                isRejected ? "Rejeitado" : "Pendente"}
                            </TagLabel>
                        </Tag>
                
                        {!applications[0]?.job?.vacancy_available === false &&(
                            <Button 
                                leftIcon={<GoCheckCircleFill size={12} />}
                                colorScheme={isApproved ? "green" : "gray"} 
                                variant={isApproved ? "solid" : "outline"}
                                size="xs"
                                height="6"
                                onClick={() => handleApproveClick(application.id)}
                                isDisabled={isApproved || applications[0]?.job?.vacancy_available === false || allPositionsFilled}
                                width="100%"
                                fontSize="xs"
                                px={2}
                            >
                                {isApproved ? "Selecionado" : `Selecionar`}
                            </Button>
                        )}
                        {!applications[0]?.job?.vacancy_available === false &&(
                            <Button 
                                leftIcon={<GoXCircleFill size={12} />} 
                                colorScheme={isRejected ? "red" : "gray"} 
                                variant={isRejected ? "solid" : "outline"} 
                                size="xs"
                                height="6"
                                onClick={() => handleRejectClick(application.id)}
                                isDisabled={isRejected}
                                width="100%"
                                fontSize="xs"
                                px={2}
                            >
                                {isRejected ? "Rejeitado" : "Rejeitar"}
                            </Button>
                        )}
                        <Button 
                            leftIcon={<GrFormView size={12} />} 
                            variant="outline" 
                            size="xs"
                            height="6"
                            onClick={() => handleViewDetails(application)}
                            width="100%"
                            fontSize="xs"
                            px={2}
                        >
                            Detalhes
                        </Button>
                      
                        <Button 
                            leftIcon={<FaFilePdf size={12} />} 
                            variant="outline" 
                            size="xs"
                            height="6"
                            as={Link}
                            href={`${process.env.NEXT_PUBLIC_API_URL}/curriculum_application/${application.curriculum_user}`}
                            isExternal
                            width="100%"
                            fontSize="xs"
                            px={2}
                        >
                            Currículo
                        </Button>
                    </VStack>
                </Flex>
            </Card>
        );
    };

    return (
        <Box p="4" width="100%" position="relative">
            <Flex 
                justify="space-between" 
                align="center" 
                mb="4" 
                p="3" 
                bg="white" 
                borderRadius="md" 
                boxShadow="md" 
                flexWrap="wrap"
                gap="3"
                position="sticky"
                top="4"
                zIndex="9"
            >
              <HStack spacing="3">
                  <Text fontWeight="bold" fontSize="sm">
                      Vagas: {approvedCount}/{totalVacancyJob} | 
                      Candidaturas: {totalApplicationVacancy} | 
                      Selecionadas: {approvedCount} | 
                      Rejeitadas: {rejectedCount}
                  </Text>
                  
                  <Menu>
                      <MenuButton 
                          as={Button} 
                          leftIcon={<Icon as={GoFilter} boxSize={4} />} 
                          variant="outline"
                          size="sm"
                          fontSize="xs"
                          height="8"
                      >
                          Filtrar
                      </MenuButton>
                      <MenuList fontSize="sm">
                          <MenuItem onClick={() => { setFilter("all"); setCurrentPage(1); }} fontSize="sm">
                              Todas as Candidaturas
                          </MenuItem>
                          <MenuItem onClick={() => { setFilter("approved"); setCurrentPage(1); }} fontSize="sm">
                              Aprovadas
                              <Badge ml="2" colorScheme="green" fontSize="xs">
                                  {approvedApplications.length}
                              </Badge>
                          </MenuItem>
                          <MenuItem onClick={() => { setFilter("rejected"); setCurrentPage(1); }} fontSize="sm">
                              Rejeitadas
                              <Badge ml="2" colorScheme="red" fontSize="xs">
                                  {rejectedApplications.length}
                              </Badge>
                          </MenuItem>
                          <MenuItem onClick={() => { setFilter("pending"); setCurrentPage(1); }} fontSize="sm">
                              Pendentes
                              <Badge ml="2" colorScheme="orange" fontSize="xs">
                                  {pendingApplications.length}
                              </Badge>
                          </MenuItem>
                      </MenuList>
                  </Menu>
                </HStack>

                <Box position="fixed" bottom="4" right="4" zIndex="10">
                    {approvedCount >= 1 && applications[0]?.job?.vacancy_available !== false && (
                        <Button
                            colorScheme="green"
                            onClick={handleFinalizeApprovals}
                            isLoading={isFinalizing}
                            size="sm"
                            boxShadow="md"
                            rightIcon={<Icon as={GoCheckCircleFill} boxSize={4} />}
                            fontSize="sm"
                            height="8"
                        >
                            {approvedCount < totalVacancyJob 
                                ? `Aprovar selecionados`
                                : `Finalizar Processo`
                            }
                        </Button>
                    )}
                </Box>
            </Flex>

            {allPositionsFilled && (
                <Alert status="info" mb="3" fontSize="sm" py={2}>
                    <AlertIcon boxSize={4} />
                    Todas as vagas foram preenchidas. Agora você só pode rejeitar candidatos.
                </Alert>
            )}

            <Grid templateColumns="repeat(3, 1fr)" gap={4} mt={4}>
                {/* Coluna 1: Candidaturas Pendentes */}
                <GridItem 
                    colSpan={1} 
                    p={3} 
                    bg="gray.50" 
                    borderRadius="md"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, null)}
                    minH="500px"
                    maxH="80vh"
                    overflowY="auto"
                >
                    <Heading size="sm" mb={2} color="orange.500" display="flex" alignItems="center">
                        Candidaturas Pendentes
                        <Badge ml={2} colorScheme="orange" fontSize="xs">
                            {pendingApplications.length}
                        </Badge>
                    </Heading>
                    <Text fontSize="xs" color="gray.600" mb={3}>
                        Arraste os candidatos para as colunas de selecionados ou rejeitados
                    </Text>
                    
                    <VStack align="stretch" spacing={2}>
                        {pendingApplications.map(application => (
                            <ApplicationCard key={application.id} application={application} />
                        ))}
                        
                        {pendingApplications.length === 0 && (
                            <Center h="100px" border="2px dashed" borderColor="gray.300" borderRadius="md">
                                <Text color="gray.500" fontSize="sm">Solte candidatos aqui</Text>
                            </Center>
                        )}
                    </VStack>
                </GridItem>

                {/* Coluna 2: Candidatos Selecionados */}
                <GridItem 
                    colSpan={1} 
                    p={3} 
                    bg="green.50" 
                    borderRadius="md"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, true)}
                    minH="500px"
                    maxH="80vh"
                    overflowY="auto"
                >
                    <Heading size="sm" mb={2} color="green.500" display="flex" alignItems="center">
                        Candidatos Selecionados
                        <Badge ml={2} colorScheme="green" fontSize="xs">
                            {approvedApplications.length}/{totalVacancyJob}
                        </Badge>
                    </Heading>
                    <Text fontSize="xs" color="gray.600" mb={3}>
                        {allPositionsFilled 
                            ? "Todas as vagas preenchidas" 
                            : `${remainingPositions} vaga(s) restante(s)`}
                    </Text>
                    
                    <VStack align="stretch" spacing={2}>
                        {approvedApplications.map(application => (
                            <ApplicationCard key={application.id} application={application} />
                        ))}
                        
                        {approvedApplications.length === 0 && (
                            <Center h="100px" border="2px dashed" borderColor="green.300" borderRadius="md">
                                <Text color="gray.500" fontSize="sm">Solte candidatos selecionados aqui</Text>
                            </Center>
                        )}
                    </VStack>
                </GridItem>

                {/* Coluna 3: Candidatos Não Selecionados */}
                <GridItem 
                    colSpan={1} 
                    p={3} 
                    bg="red.50" 
                    borderRadius="md"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, false)}
                    minH="500px"
                    maxH="80vh"
                    overflowY="auto"
                >
                    <Heading size="sm" mb={2} color="red.500" display="flex" alignItems="center">
                        Candidatos Não Selecionados
                        <Badge ml={2} colorScheme="red" fontSize="xs">
                            {rejectedApplications.length}
                        </Badge>
                    </Heading>
                    <Text fontSize="xs" color="gray.600" mb={3}>
                        Candidatos que não foram selecionados para a vaga
                    </Text>
                    
                    <VStack align="stretch" spacing={2}>
                        {rejectedApplications.map(application => (
                            <ApplicationCard key={application.id} application={application} />
                        ))}
                        
                        {rejectedApplications.length === 0 && (
                            <Center h="100px" border="2px dashed" borderColor="red.300" borderRadius="md">
                                <Text color="gray.500" fontSize="sm">Solte candidatos rejeitados aqui</Text>
                            </Center>
                        )}
                    </VStack>
                </GridItem>
            </Grid>

            {selectedApplication && (
                <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} size="lg">
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader py={3}>
                          <Flex align="center">
                            <Avatar 
                              name={selectedApplication.user?.name} 
                              src={selectedApplication.user?.avatar ? `${process.env.NEXT_PUBLIC_API_URL}/avatars/${selectedApplication.user?.avatar}` : "../../../Img/icons/avatarLogin.png"} 
                              size="md"
                              mr="3"
                            />
                            <Box>
                              <Heading size="sm">{selectedApplication.user?.name}</Heading>
                              <Text fontSize="xs" color="gray.500">
                                {selectedApplication.user?.individualData?.functionn}
                              </Text>
                            </Box>
                          </Flex>
                        </ModalHeader>
                        <ModalCloseButton size="sm" />
                        <ModalBody py={3}>
                            <VStack spacing="3" align="stretch">
                                <Box>
                                    <Heading size="xs" mb="2">Informações de Contato</Heading>
                                    <SimpleGrid columns={2} spacing={3}>
                                        <HStack>
                                            <Icon as={FiMail} color="gray.500" boxSize={3} />
                                            <Text fontSize="sm">{selectedApplication.user?.email}</Text>
                                        </HStack>
                                        <HStack>
                                            <Icon as={FiPhone} color="gray.500" boxSize={3} />
                                            <Text fontSize="sm">{selectedApplication.user?.telephone}</Text>
                                        </HStack>
                                    </SimpleGrid>
                                </Box>

                                <Divider />

                                <Box>
                                  <Heading size="xs" mb="2">Candidatura</Heading>
                                  <SimpleGrid columns={2} spacing={3}>
                                    <HStack>
                                      <Icon as={FiBriefcase} color="gray.500" boxSize={3} />
                                      <Text fontSize="sm">Data: {new Date(selectedApplication.created_at).toLocaleDateString()}</Text>
                                    </HStack>
                                    <HStack>
                                      <Icon as={FaFilePdf} color="gray.500" boxSize={3} />
                                      <Link 
                                        href={`${process.env.NEXT_PUBLIC_API_URL}/curriculum_application/${selectedApplication.curriculum_user}`}
                                        isExternal
                                        color="blue.500"
                                        fontSize="sm"
                                      >
                                        Baixar Currículo
                                      </Link>
                                    </HStack>
                                  </SimpleGrid>
                                </Box>

                                <Divider />

                                <Box>
                                  <Heading size="xs" mb="2">Status</Heading>
                                  <Tag 
                                    size="md" 
                                    variant="subtle" 
                                    colorScheme={
                                      approvalList[selectedApplication.id]?.approved === true ? "green" : 
                                      approvalList[selectedApplication.id]?.approved === false ? "red" : "gray"
                                    }
                                  >
                                    <TagLabel fontSize="sm">
                                      {approvalList[selectedApplication.id]?.approved === true ? "Aprovado" : 
                                      approvalList[selectedApplication.id]?.approved === false ? "Rejeitado" : "Pendente"}
                                    </TagLabel>
                                  </Tag>
                                </Box>
                            </VStack>
                        </ModalBody>
                        <ModalFooter py={2}>
                            <Button colorScheme="blue" size="sm" onClick={onDetailsClose}>
                                Fechar
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}

            <Modal isOpen={isConfirmOpen} onClose={onConfirmClose} size="sm">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader py={3} fontSize="md">
                        {approvalAction?.type === 'approve' ? 'Confirmar seleção' : 'Confirmar rejeição'}
                    </ModalHeader>
                    <ModalCloseButton size="sm" />
                    <ModalBody py={3}>
                        <Text fontSize="sm">
                            {approvalAction?.type === 'approve' 
                              ? 'Tem certeza que deseja selecionar este candidato?' 
                              : 'Tem certeza que deseja rejeitar este candidato?'}
                        </Text>
                    </ModalBody>
                    <ModalFooter py={2}>
                        <Button variant="outline" mr={2} onClick={onConfirmClose} size="sm">
                            Cancelar
                        </Button>
                        <Button 
                            colorScheme={approvalAction?.type === 'approve' ? 'green' : 'red'} 
                            onClick={handleConfirmAction}
                            size="sm"
                        >
                            {approvalAction?.type === 'approve' ? 'Confirmar' : 'Rejeitar'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}