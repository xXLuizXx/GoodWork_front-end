import React, { useEffect, useState } from 'react';
import { 
    Avatar, 
    Flex, 
    Stack, 
    SimpleGrid, 
    Text, 
    Box, 
    Button, 
    Badge,
    Divider,
    useToast,
    Icon,
    Tooltip,
    useColorModeValue
} from '@chakra-ui/react';
import { 
    FiMail, 
    FiPhone, 
    FiMapPin, 
    FiBriefcase, 
    FiUser, 
    FiCheckCircle,
    FiXCircle
} from 'react-icons/fi';
import { parseCookies } from 'nookies';
import decode from "jwt-decode";
import { useDataUser } from '@/services/hooks/Users/useProfile';
import { useUpdateStatusUser } from '@/services/hooks/Users/useUpdateStatusUser';

interface IUserProfileViewProps {
    userId: string;
}

interface DecodedToken {
    accessLevel: string;
    isAdmin: boolean;
    sub: string;
}

export function UserProfileView({ userId }: IUserProfileViewProps) {
    const { data: userData, isLoading, isError } = useDataUser(userId);
    const { updateStatusUser, isLoadingStatus } = useUpdateStatusUser();
    const [mounted, setMounted] = useState(false);
    const [admin, setAdmin] = useState(false); 
    const toast = useToast();
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.300');
    const headingColor = useColorModeValue('blue.700', 'blue.300');

    useEffect(() => {
        setMounted(true);
        
        const cookies = parseCookies();
        const token = cookies["token.token"];

        if (token) {
            try {
                const decoded = decode<DecodedToken>(token);
                setAdmin(!!decoded.isAdmin);
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
            }
        }
    }, []);

    const handleStatusChange = async (userId: string, currentActiveStatus: boolean) => {
        try {
            await updateStatusUser(userId, !currentActiveStatus);
            
        } catch (error) {
            toast({
                title: "Erro",
                description: "Ocorreu um erro ao alterar o status do usuário.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    if (isLoading) {
        return (
            <Flex justify="center" align="center" minH="300px">
                <Text>Carregando perfil...</Text>
            </Flex>
        );
    }

    if (isError || !userData?.user) {
        return (
            <Flex justify="center" align="center" minH="300px">
                <Text>Erro ao carregar perfil do usuário</Text>
            </Flex>
        );
    }

    const { user } = userData;
    const isIndividual = user.user_type === "individual";

    return (
        <Box
            bg={cardBg}
            borderRadius="xl"
            boxShadow="xl"
            overflow="hidden"
            border="1px solid"
            borderColor={borderColor}
            maxW="1000px"
            mx="auto"
        >
            <Box 
                bgGradient="linear(to-r, blue.500, blue.600)"
                p={6}
                position="relative"
            >
                <Flex justify="space-between" align="flex-end">
                    <Flex align="center">
                        <Avatar
                            size="2xl"
                            name={user.name}
                            src={user.avatar ? `${process.env.NEXT_PUBLIC_API_URL}/avatars/${user.avatar}` : "/default-avatar.png"}
                            border="4px solid"
                            borderColor={cardBg}
                            boxShadow="lg"
                        />
                        <Box ml={6} color="white">
                            <Flex align="center">
                                <Text fontSize="3xl" fontWeight="bold" mr={3}>
                                    {user.name}
                                </Text>
                                <Badge 
                                    colorScheme={user.active ? "green" : "red"} 
                                    fontSize="md"
                                    px={2}
                                    py={1}
                                    borderRadius="full"
                                >
                                    {user.active ? "Ativo" : "Inativo"}
                                </Badge>
                            </Flex>
                            
                            <Text fontSize="lg" mt={1}>
                                {isIndividual ? user.functionn : user.business_area}
                            </Text>
                            
                            <Flex mt={3} align="center">
                                <Icon as={FiMail} mr={2} />
                                <Text>{user.email}</Text>
                            </Flex>
                        </Box>
                    </Flex>
                    
                    {admin && (
                        <Tooltip label={user.active ? "Desativar usuário" : "Ativar usuário"}>
                            <Button
                                colorScheme={user.active ? "red" : "green"}
                                leftIcon={user.active ? <FiXCircle /> : <FiCheckCircle />}
                                onClick={() => handleStatusChange(user.id, user.active)}
                                variant="solid"
                            >
                                {user.active ? "Desativar" : "Ativar"}
                            </Button>
                        </Tooltip>
                    )}
                </Flex>
            </Box>

            <Box p={8}>
                <Box mb={10}>
                    <Text fontSize="2xl" fontWeight="bold" color={headingColor} mb={4}>
                        Sobre
                    </Text>
                    <Text color={textColor}>
                        {isIndividual 
                            ? user.ability || "Nenhuma descrição fornecida."
                            : user.business_area || "Nenhuma descrição da empresa fornecida."}
                    </Text>
                </Box>

                <Divider my={6} />

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                    <Stack spacing={6}>
                        <Box>
                            <Text fontSize="lg" fontWeight="semibold" color={headingColor} mb={3}>
                                Informações Pessoais
                            </Text>
                            <InfoItem icon={FiUser} label="Tipo" value={isIndividual ? "Pessoa Física" : "Pessoa Jurídica"} />
                            {isIndividual && (
                                <InfoItem 
                                    icon={FiBriefcase} 
                                    label="Situação Profissional" 
                                    value={user.is_employee ? "Empregado" : "Não empregado"} 
                                />
                            )}
                        </Box>

                        <Box>
                            <Text fontSize="lg" fontWeight="semibold" color={headingColor} mb={3}>
                                Contato
                            </Text>
                            <InfoItem icon={FiPhone} label="Telefone" value={user.telephone || "Não informado"} />
                        </Box>
                    </Stack>

                    <Stack spacing={6}>
                        <Box>
                            <Text fontSize="lg" fontWeight="semibold" color={headingColor} mb={3}>
                                Endereço
                            </Text>
                            <InfoItem icon={FiMapPin} label="Rua" value={user.road || "Não informada"} />
                            <InfoItem icon={FiMapPin} label="Número" value={user.number || "Não informado"} />
                            <InfoItem icon={FiMapPin} label="Bairro" value={user.neighborhood || "Não informado"} />
                        </Box>

                        {!isIndividual && (
                            <Box>
                                <Text fontSize="lg" fontWeight="semibold" color={headingColor} mb={3}>
                                    Dados da Empresa
                                </Text>
                                <InfoItem 
                                    icon={FiBriefcase} 
                                    label="Área de Negócio" 
                                    value={user.business_area || "Não informada"} 
                                />
                            </Box>
                        )}
                    </Stack>
                </SimpleGrid>
            </Box>
        </Box>
    );
};

const InfoItem = ({ icon, label, value }: { icon: any; label: string; value: string }) => {
    const textColor = useColorModeValue('gray.600', 'gray.300');
    
    return (
        <Flex align="center" mb={2}>
            <Icon as={icon} mr={3} color="blue.500" />
            <Text fontWeight="medium" minW="120px">{label}:</Text>
            <Text color={textColor} ml={2}>{value}</Text>
        </Flex>
    );
};