import {
    Box,
    Badge,
    IconButton,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    VStack,
    HStack,
    Text,
    Icon,
    Spinner,
    Flex,
    Button,
    useColorModeValue,
    useDisclosure,
    Divider,
} from "@chakra-ui/react";
import {
    FiBell,
    FiCheckCircle,
    FiXCircle,
    FiUserPlus,
    FiCalendar,
    FiAward,
} from "react-icons/fi";
import { useRouter } from "next/router";
import {
    useUnreadCount,
    useNotificationsList,
    useMarkAllRead,
    useMarkRead,
    INotification,
    NotificationType,
} from "@/services/hooks/Notifications/useNotifications";

const typeConfig: Record<NotificationType, { icon: any; color: string; label: string }> = {
    application_approved:   { icon: FiCheckCircle, color: "green.400",  label: "Candidatura aprovada" },
    application_rejected:   { icon: FiXCircle,     color: "red.400",    label: "Candidatura reprovada" },
    application_received:   { icon: FiUserPlus,    color: "blue.400",   label: "Nova candidatura" },
    interview_scheduled:    { icon: FiCalendar,    color: "blue.400",   label: "Entrevista agendada" },
    interview_cancelled:    { icon: FiCalendar,    color: "red.400",    label: "Entrevista cancelada" },
    interview_rescheduled:  { icon: FiCalendar,    color: "orange.400", label: "Entrevista reagendada" },
    hired:                  { icon: FiAward,       color: "yellow.400", label: "Contratado!" },
};

function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Agora";
    if (diffMin < 60) return `${diffMin}m atrás`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH}h atrás`;
    return date.toLocaleDateString("pt-BR");
}

function NotificationItem({ notification, onClose }: { notification: INotification; onClose: () => void }) {
    const router = useRouter();
    const { mutate: markRead } = useMarkRead();
    const config = typeConfig[notification.type] ?? { icon: FiBell, color: "gray.400", label: "" };
    const unreadBg = useColorModeValue("blue.50", "blue.900");
    const hoverBg = useColorModeValue("gray.100", "gray.700");
    const bodyColor = useColorModeValue("gray.600", "gray.400");

    const handleClick = () => {
        if (!notification.is_read) markRead(notification.id);
        onClose();
        if (notification.resource_type === "application") {
            router.push("/applications/my-applications");
        } else if (notification.resource_type === "interview") {
            router.push("/interviews/candidate");
        } else if (notification.resource_type === "job") {
            router.push("/jobs/generate-jobs");
        }
    };

    return (
        <HStack
            spacing={3}
            p={3}
            w="100%"
            borderRadius="md"
            bg={!notification.is_read ? unreadBg : "transparent"}
            _hover={{ bg: hoverBg, cursor: "pointer" }}
            onClick={handleClick}
            align="flex-start"
            transition="background 0.15s"
        >
            <Icon as={config.icon} color={config.color} boxSize={5} mt={0.5} flexShrink={0} />
            <VStack align="start" spacing={0} flex={1} minW={0}>
                <Text fontSize="sm" fontWeight={!notification.is_read ? "semibold" : "normal"} noOfLines={1}>
                    {notification.title}
                </Text>
                <Text fontSize="xs" color={bodyColor} noOfLines={2}>
                    {notification.body}
                </Text>
                <Text fontSize="xs" color="gray.400" mt={1}>
                    {formatDate(notification.created_at)}
                </Text>
            </VStack>
            {!notification.is_read && (
                <Box w={2} h={2} bg="blue.400" borderRadius="full" flexShrink={0} mt={1.5} />
            )}
        </HStack>
    );
}

interface NotificationBellProps {
    enabled?: boolean;
}

export function NotificationBell({ enabled = true }: NotificationBellProps) {
    const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
    const { data: countData } = useUnreadCount(enabled);
    const { data: notifications, isLoading } = useNotificationsList(isOpen);
    const { mutate: markAllRead } = useMarkAllRead();

    const popoverBg = useColorModeValue("white", "gray.800");
    const headerBg = useColorModeValue("gray.50", "gray.750");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const emptyColor = useColorModeValue("gray.400", "gray.500");
    const footerBg = useColorModeValue("gray.50", "gray.750");

    const unreadCount = countData?.count ?? 0;
    const hasUnread = notifications?.some(n => !n.is_read) ?? false;

    const handleOpen = () => {
        onToggle();
        if (!isOpen && unreadCount > 0) markAllRead();
    };

    return (
        <Popover
            isOpen={isOpen}
            onClose={onClose}
            placement="bottom-end"
            isLazy
            lazyBehavior="keepMounted"
        >
            <PopoverTrigger>
                <Box position="relative" display="inline-flex">
                    <IconButton
                        aria-label="Notificações"
                        icon={<FiBell size={20} />}
                        variant="ghost"
                        color="white"
                        _hover={{ bg: "whiteAlpha.200" }}
                        onClick={handleOpen}
                    />
                    {unreadCount > 0 && (
                        <Badge
                            position="absolute"
                            top="-1"
                            right="-1"
                            bg="red.500"
                            color="white"
                            borderRadius="full"
                            minW="18px"
                            h="18px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            fontSize="10px"
                            fontWeight="bold"
                            border="2px solid"
                            borderColor="transparent"
                            pointerEvents="none"
                        >
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </Badge>
                    )}
                </Box>
            </PopoverTrigger>

            <PopoverContent
                w="380px"
                maxW="95vw"
                bg={popoverBg}
                borderColor={borderColor}
                boxShadow="xl"
                borderRadius="xl"
                overflow="hidden"
                _focus={{ outline: "none" }}
            >
                <PopoverHeader
                    px={4}
                    py={3}
                    bg={headerBg}
                    borderBottomColor={borderColor}
                    borderBottomWidth="1px"
                >
                    <HStack justify="space-between">
                        <HStack spacing={2}>
                            <Icon as={FiBell} boxSize={4} />
                            <Text fontWeight="semibold" fontSize="sm">
                                Notificações
                            </Text>
                            {unreadCount > 0 && (
                                <Badge colorScheme="blue" borderRadius="full" fontSize="10px">
                                    {unreadCount} nova{unreadCount !== 1 ? "s" : ""}
                                </Badge>
                            )}
                        </HStack>
                        {hasUnread && (
                            <Button
                                size="xs"
                                variant="ghost"
                                colorScheme="blue"
                                fontSize="xs"
                                onClick={() => markAllRead()}
                            >
                                Marcar todas como lidas
                            </Button>
                        )}
                    </HStack>
                </PopoverHeader>

                <PopoverBody p={0} maxH="400px" overflowY="auto">
                    {isLoading ? (
                        <Flex justify="center" align="center" h="100px">
                            <Spinner color="blue.400" size="sm" />
                        </Flex>
                    ) : !notifications || notifications.length === 0 ? (
                        <Flex direction="column" align="center" justify="center" h="160px" gap={3}>
                            <Icon as={FiBell} boxSize={8} color={emptyColor} />
                            <Text color={emptyColor} fontSize="sm">
                                Nenhuma notificação
                            </Text>
                        </Flex>
                    ) : (
                        <VStack spacing={0} align="stretch" divider={<Divider borderColor={borderColor} />}>
                            {notifications.map(n => (
                                <NotificationItem key={n.id} notification={n} onClose={onClose} />
                            ))}
                        </VStack>
                    )}
                </PopoverBody>

                {notifications && notifications.length > 0 && (
                    <PopoverFooter
                        px={4}
                        py={2}
                        bg={footerBg}
                        borderTopColor={borderColor}
                        borderTopWidth="1px"
                    >
                        <Text fontSize="xs" color={emptyColor} textAlign="center">
                            Mostrando as últimas {notifications.length} notificações
                        </Text>
                    </PopoverFooter>
                )}
            </PopoverContent>
        </Popover>
    );
}
