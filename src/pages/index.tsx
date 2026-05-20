import { useState, useRef } from "react";
import {
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Flex,
    Heading,
    Icon,
    IconButton,
    Image,
    Input,
    InputGroup,
    InputRightElement,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    SimpleGrid,
    Spinner,
    Text,
    useColorModeValue,
    useDisclosure,
    VStack,
    HStack,
    Divider,
} from "@chakra-ui/react";
import { FiBriefcase, FiMapPin, FiClock, FiCalendar, FiSearch, FiLogIn, FiUserPlus } from "react-icons/fi";
import { Helmet } from "react-helmet";
import { useRouter } from "next/router";
import {
    usePublicJobs,
    usePublicJobSearch,
    getBannerUrl,
    getAvatarUrl,
    PublicJob,
} from "@/services/hooks/Jobs/usePublicJobs";
import { useCategories } from "@/services/hooks/Categories/useCategories";
import { Footer } from "@/components/Footer/Footer";

function formatClosingDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return "Encerrada";
    if (diffDays === 0) return "Encerra hoje";
    if (diffDays === 1) return "Encerra amanhã";
    return `Encerra em ${diffDays} dias`;
}

function BannerFallback({ h = "80px" }: { h?: string }) {
    return (
        <Flex
            h={h}
            w="100%"
            bgGradient="linear(to-r, blue.600, blue.400)"
            borderRadius="md"
            align="center"
            justify="center"
        >
            <Icon as={FiBriefcase} boxSize="36px" color="whiteAlpha.800" />
        </Flex>
    );
}

interface JobCardProps {
    job: PublicJob;
    onApplyClick: (job: PublicJob) => void;
    onViewClick: (job: PublicJob) => void;
}

function JobCard({ job, onApplyClick, onViewClick }: JobCardProps) {
    const cardBg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const subtitleColor = useColorModeValue("gray.600", "gray.400");

    return (
        <Card
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="xl"
            boxShadow="dark-lg"
            overflow="hidden"
            transition="transform 0.2s, box-shadow 0.2s"
            _hover={{ transform: "translateY(-4px)", boxShadow: "2xl" }}
        >
            <Image
                src={getBannerUrl(job.banner)}
                alt={`Banner ${job.vacancy}`}
                h="80px"
                w="100%"
                objectFit="cover"
                fallback={<BannerFallback />}
            />

            <CardHeader pb={2}>
                <HStack spacing={3}>
                    <Avatar
                        size="sm"
                        src={getAvatarUrl(job.company?.avatar)}
                        name={job.company?.name ?? job.contractor}
                    />
                    <VStack align="start" spacing={0}>
                        <Heading size="sm" noOfLines={1}>{job.vacancy}</Heading>
                        <Text fontSize="xs" color={subtitleColor} noOfLines={1}>
                            {job.contractor || job.company?.name}
                        </Text>
                    </VStack>
                </HStack>
            </CardHeader>

            <CardBody pt={0} pb={2}>
                <VStack align="start" spacing={1}>
                    {job.category && (
                        <Badge colorScheme="blue" borderRadius="full" fontSize="10px">
                            {job.category.name}
                        </Badge>
                    )}
                    <HStack spacing={1} color={subtitleColor}>
                        <Icon as={FiMapPin} boxSize={3} />
                        <Text fontSize="xs" noOfLines={1}>{job.location}</Text>
                    </HStack>
                    <HStack spacing={1} color={subtitleColor}>
                        <Icon as={FiClock} boxSize={3} />
                        <Text fontSize="xs" noOfLines={1}>{job.workload}</Text>
                    </HStack>
                    <HStack spacing={1} color={subtitleColor}>
                        <Icon as={FiCalendar} boxSize={3} />
                        <Text fontSize="xs">{formatClosingDate(job.closing_date)}</Text>
                    </HStack>
                </VStack>
            </CardBody>

            <CardFooter pt={0} gap={2}>
                <Button
                    size="sm"
                    variant="outline"
                    colorScheme="blue"
                    flex={1}
                    onClick={() => onViewClick(job)}
                >
                    Visualizar
                </Button>
                <Button
                    size="sm"
                    colorScheme="green"
                    flex={1}
                    onClick={() => onApplyClick(job)}
                    isDisabled={!job.vacancy_available}
                >
                    {job.vacancy_available ? "Candidatar-se" : "Encerrada"}
                </Button>
            </CardFooter>
        </Card>
    );
}

const ITEMS_PER_PAGE = 20;

export default function PublicJobsPage(): JSX.Element {
    const router = useRouter();
    const [searchInput, setSearchInput] = useState("");
    const [activeSearch, setActiveSearch] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedJob, setSelectedJob] = useState<PublicJob | null>(null);
    const { isOpen: isLoginOpen, onOpen: onLoginOpen, onClose: onLoginClose } = useDisclosure();
    const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();

    const navBg = useColorModeValue("#0000CD", "gray.900");
    const pageBg = useColorModeValue("gray.50", "gray.900");
    const searchBg = useColorModeValue("white", "gray.700");
    const sectionBg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const subtitleColor = useColorModeValue("gray.600", "gray.400");
    const modalBodyBg = useColorModeValue("gray.50", "gray.700");

    const { data: categories } = useCategories();
    const { data: allJobs, isLoading: isLoadingAll } = usePublicJobs(categoryId || undefined);
    const { data: searchJobs, isLoading: isLoadingSearch } = usePublicJobSearch(activeSearch);

    const jobs = activeSearch.trim() ? searchJobs : allJobs;
    const isLoading = activeSearch.trim() ? isLoadingSearch : isLoadingAll;

    const totalPages = Math.ceil((jobs?.length ?? 0) / ITEMS_PER_PAGE);
    const paginatedJobs = jobs?.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleSearch = () => {
        setActiveSearch(searchInput);
        setCategoryId("");
        setCurrentPage(1);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSearch();
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategoryId(e.target.value);
        setActiveSearch("");
        setSearchInput("");
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleApplyClick = (job: PublicJob) => {
        setSelectedJob(job);
        onLoginOpen();
    };

    const handleViewClick = (job: PublicJob) => {
        setSelectedJob(job);
        onViewOpen();
    };

    return (
        <>
            <Helmet>
                <title>GoodWork — Vagas</title>
                <link rel="icon" href="/Img/logos/GoodworkSSlogan.png" type="image/png" />
            </Helmet>

            {/* Navbar */}
            <Flex
                as="header"
                w="100%"
                h="16"
                bg={navBg}
                px={6}
                align="center"
                position="sticky"
                top={0}
                zIndex={100}
                boxShadow="dark-lg"
            >
                <Image
                    src="/Img/logos/GoodWorkLogoBranco.png"
                    alt="GoodWork"
                    h="48px"
                    w="auto"
                    objectFit="contain"
                    draggable={false}
                    style={{ userSelect: "none" }}
                />
                <Flex flex={1} />
                <HStack spacing={3}>
                    <Button
                        leftIcon={<FiLogIn />}
                        variant="ghost"
                        color="white"
                        _hover={{ bg: "whiteAlpha.200" }}
                        size="sm"
                        onClick={() => router.push("/login")}
                    >
                        Entrar
                    </Button>
                    <Button
                        leftIcon={<FiUserPlus />}
                        colorScheme="whiteAlpha"
                        variant="solid"
                        size="sm"
                        onClick={() => router.push("/users/create")}
                    >
                        Criar conta
                    </Button>
                </HStack>
            </Flex>

            <Box bg={pageBg} minH="calc(100vh - 64px)" pb={12}>
                {/* Hero / busca */}
                <Box bg={navBg} pb={8} pt={6}>
                    <VStack spacing={3} px={6} maxW="720px" mx="auto">
                        <Heading color="white" size="lg" textAlign="center">
                            Encontre sua próxima oportunidade
                        </Heading>
                        <Text color="whiteAlpha.800" fontSize="sm" textAlign="center">
                            Explore vagas de empresas verificadas sem precisar criar uma conta
                        </Text>
                        <InputGroup maxW="560px" w="100%">
                            <Input
                                placeholder="Buscar vagas..."
                                bg={searchBg}
                                borderRadius="full"
                                border="none"
                                boxShadow="dark-lg"
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                _focus={{ boxShadow: "0 0 0 3px rgba(255,255,255,0.4)" }}
                            />
                            <InputRightElement>
                                <IconButton
                                    aria-label="Buscar"
                                    icon={<FiSearch />}
                                    variant="ghost"
                                    borderRadius="full"
                                    onClick={handleSearch}
                                />
                            </InputRightElement>
                        </InputGroup>
                    </VStack>
                </Box>

                {/* Filtro de categorias + grid */}
                <Box maxW="1400px" mx="auto" px={6} mt={8}>
                    <Flex align="center" mb={6} gap={4} flexWrap="wrap">
                        <Text fontWeight="semibold" whiteSpace="nowrap">Filtrar por categoria:</Text>
                        <Select
                            maxW="280px"
                            borderRadius="full"
                            size="sm"
                            value={categoryId}
                            onChange={handleCategoryChange}
                            bg={sectionBg}
                            borderColor={borderColor}
                        >
                            <option value="">Todas as categorias</option>
                            {categories?.categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </Select>
                        {(activeSearch || categoryId) && (
                            <Button
                                size="sm"
                                variant="ghost"
                                colorScheme="blue"
                                onClick={() => { setActiveSearch(""); setSearchInput(""); setCategoryId(""); }}
                            >
                                Limpar filtros
                            </Button>
                        )}
                        {jobs && (
                            <Text fontSize="sm" color={subtitleColor} ml="auto">
                                {jobs.length} vaga{jobs.length !== 1 ? "s" : ""} encontrada{jobs.length !== 1 ? "s" : ""}
                            </Text>
                        )}
                    </Flex>

                    {isLoading ? (
                        <Flex justify="center" align="center" h="200px">
                            <Spinner color="blue.500" size="xl" />
                        </Flex>
                    ) : !jobs || jobs.length === 0 ? (
                        <Flex direction="column" align="center" justify="center" h="200px" gap={3}>
                            <Icon as={FiBriefcase} boxSize={12} color={subtitleColor} />
                            <Text color={subtitleColor}>Nenhuma vaga encontrada</Text>
                        </Flex>
                    ) : (
                        <>
                            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={5}>
                                {paginatedJobs?.map(job => (
                                    <JobCard
                                        key={job.id}
                                        job={job}
                                        onApplyClick={handleApplyClick}
                                        onViewClick={handleViewClick}
                                    />
                                ))}
                            </SimpleGrid>

                            {totalPages > 1 && (
                                <Flex justify="center" align="center" mt={10} gap={2} flexWrap="wrap">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        colorScheme="blue"
                                        isDisabled={currentPage === 1}
                                        onClick={() => handlePageChange(currentPage - 1)}
                                    >
                                        Anterior
                                    </Button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter(p =>
                                            p === 1 ||
                                            p === totalPages ||
                                            Math.abs(p - currentPage) <= 2
                                        )
                                        .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                                            if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                                            acc.push(p);
                                            return acc;
                                        }, [])
                                        .map((item, idx) =>
                                            item === "..." ? (
                                                <Text key={`ellipsis-${idx}`} px={1} color={subtitleColor}>…</Text>
                                            ) : (
                                                <Button
                                                    key={item}
                                                    size="sm"
                                                    colorScheme="blue"
                                                    variant={currentPage === item ? "solid" : "outline"}
                                                    onClick={() => handlePageChange(item as number)}
                                                    minW="36px"
                                                >
                                                    {item}
                                                </Button>
                                            )
                                        )
                                    }

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        colorScheme="blue"
                                        isDisabled={currentPage === totalPages}
                                        onClick={() => handlePageChange(currentPage + 1)}
                                    >
                                        Próxima
                                    </Button>
                                </Flex>
                            )}
                        </>
                    )}
                </Box>
            </Box>

            {/* Modal: login obrigatório para candidatura */}
            <Modal isOpen={isLoginOpen} onClose={onLoginClose} isCentered size="sm">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Candidatar-se à vaga</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody bg={modalBodyBg}>
                        <VStack spacing={3} py={2} align="center" textAlign="center">
                            <Icon as={FiBriefcase} boxSize={10} color="blue.400" />
                            <Text fontWeight="semibold">{selectedJob?.vacancy}</Text>
                            <Text fontSize="sm" color={subtitleColor}>
                                Para se candidatar, faça login ou crie uma conta gratuitamente.
                            </Text>
                        </VStack>
                    </ModalBody>
                    <ModalFooter gap={3}>
                        <Button
                            leftIcon={<FiLogIn />}
                            colorScheme="blue"
                            flex={1}
                            onClick={() => router.push("/login")}
                        >
                            Fazer Login
                        </Button>
                        <Button
                            leftIcon={<FiUserPlus />}
                            colorScheme="green"
                            flex={1}
                            onClick={() => router.push("/users/create")}
                        >
                            Criar Conta
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Modal: visualizar detalhes da vaga */}
            {selectedJob && (
                <Modal isOpen={isViewOpen} onClose={onViewClose} size="lg" scrollBehavior="inside">
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader pb={0}>{selectedJob.vacancy}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody bg={modalBodyBg}>
                            <VStack align="start" spacing={4}>
                                <Image
                                    src={getBannerUrl(selectedJob.banner)}
                                    alt="Banner"
                                    w="100%"
                                    h="120px"
                                    objectFit="cover"
                                    borderRadius="md"
                                    fallback={<BannerFallback h="120px" />}
                                />

                                <HStack spacing={3}>
                                    <Avatar
                                        size="md"
                                        src={getAvatarUrl(selectedJob.company?.avatar)}
                                        name={selectedJob.company?.name ?? selectedJob.contractor}
                                    />
                                    <VStack align="start" spacing={0}>
                                        <Text fontWeight="bold">
                                            {selectedJob.contractor || selectedJob.company?.name}
                                        </Text>
                                        {selectedJob.company?.business_area && (
                                            <Text fontSize="sm" color={subtitleColor}>
                                                {selectedJob.company.business_area}
                                            </Text>
                                        )}
                                    </VStack>
                                </HStack>

                                <HStack wrap="wrap" spacing={2}>
                                    {selectedJob.category && (
                                        <Badge colorScheme="blue" borderRadius="full">{selectedJob.category.name}</Badge>
                                    )}
                                    <Badge colorScheme="gray" borderRadius="full">
                                        <HStack spacing={1}><Icon as={FiMapPin} /><Text>{selectedJob.location}</Text></HStack>
                                    </Badge>
                                    <Badge colorScheme="gray" borderRadius="full">
                                        <HStack spacing={1}><Icon as={FiClock} /><Text>{selectedJob.workload}</Text></HStack>
                                    </Badge>
                                    <Badge colorScheme={selectedJob.vacancy_available ? "green" : "red"} borderRadius="full">
                                        {formatClosingDate(selectedJob.closing_date)}
                                    </Badge>
                                </HStack>

                                <Divider />

                                <Box w="100%">
                                    <Text fontWeight="semibold" mb={1}>Descrição</Text>
                                    <Text fontSize="sm" color={subtitleColor} whiteSpace="pre-wrap">
                                        {selectedJob.description_vacancy}
                                    </Text>
                                </Box>

                                <Box w="100%">
                                    <Text fontWeight="semibold" mb={1}>Requisitos</Text>
                                    <Text fontSize="sm" color={subtitleColor} whiteSpace="pre-wrap">
                                        {selectedJob.requirements}
                                    </Text>
                                </Box>

                                {selectedJob.benefits && (
                                    <Box w="100%">
                                        <Text fontWeight="semibold" mb={1}>Benefícios</Text>
                                        <Text fontSize="sm" color={subtitleColor} whiteSpace="pre-wrap">
                                            {selectedJob.benefits}
                                        </Text>
                                    </Box>
                                )}

                                <HStack spacing={2} fontSize="sm" color={subtitleColor}>
                                    <Icon as={FiBriefcase} />
                                    <Text>{selectedJob.amount_vacancy} vaga{selectedJob.amount_vacancy !== 1 ? "s" : ""} disponível{selectedJob.amount_vacancy !== 1 ? "s" : ""}</Text>
                                </HStack>
                            </VStack>
                        </ModalBody>
                        <ModalFooter gap={3}>
                            <Button variant="ghost" onClick={onViewClose}>Fechar</Button>
                            <Button
                                colorScheme="green"
                                leftIcon={<FiUserPlus />}
                                isDisabled={!selectedJob.vacancy_available}
                                onClick={() => { onViewClose(); handleApplyClick(selectedJob); }}
                            >
                                Candidatar-se
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}

            <Footer />
        </>
    );
}

export { };
