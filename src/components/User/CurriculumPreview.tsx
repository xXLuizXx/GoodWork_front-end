import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Tooltip,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';
import { MdDescription, MdOpenInNew, MdZoomIn } from 'react-icons/md';

interface CurriculumPreviewProps {
    curriculum: string;
    title?: string;
    // "profile": currículo do perfil do candidato; "application": currículo enviado em uma candidatura
    kind?: 'profile' | 'application';
    // Acompanha a altura do botão ao lado: md = 40px, sm = 32px, xs = 24px
    size?: 'xs' | 'sm' | 'md';
    // Com texto, vira um botão (miniatura + texto) com a mesma altura de um Button do Chakra
    label?: string;
    colorScheme?: string;
}

const ROUTES = {
    profile: 'curriculum_user_profile',
    application: 'curriculum_application',
};

// Alturas dos Buttons do Chakra, em proporção de folha A4
const SIZES = {
    xs: { width: 18, height: 24 },
    sm: { width: 24, height: 32 },
    md: { width: 30, height: 40 },
};
// O PDF é renderizado em tamanho real e reduzido, para a miniatura mostrar a página inteira
const PAGE_WIDTH = 600;

// Miniatura de um currículo em PDF; ao clicar, abre o arquivo em um modal.
// O PDF é baixado como blob porque o back (helmet) não permite ser exibido em iframe de outra origem.
export function CurriculumPreview({
    curriculum, title = 'Meu currículo', kind = 'profile', size = 'md', label, colorScheme
}: CurriculumPreviewProps): JSX.Element {
    const fileUrl = `${process.env.NEXT_PUBLIC_API_URL}/${ROUTES[kind]}/${curriculum}`;
    // Dentro do botão, a miniatura fica 4px menor para caber entre as bordas
    const thumbHeight = label ? SIZES[size].height - 4 : SIZES[size].height;
    const thumbWidth = thumbHeight * 0.75;
    const thumbScale = thumbWidth / PAGE_WIDTH;
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const [hasError, setHasError] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const thumbBorder = useColorModeValue('gray.300', 'gray.600');
    const thumbBg = useColorModeValue('white', 'gray.700');

    useEffect(() => {
        let objectUrl: string | null = null;
        let cancelled = false;

        setBlobUrl(null);
        setHasError(false);

        fetch(fileUrl)
            .then((response) => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.arrayBuffer();
            })
            .then((buffer) => {
                if (cancelled) return;
                objectUrl = URL.createObjectURL(new Blob([buffer], { type: 'application/pdf' }));
                setBlobUrl(objectUrl);
            })
            .catch(() => {
                if (!cancelled) setHasError(true);
            });

        return () => {
            cancelled = true;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [fileUrl]);

    // Sem prévia, o clique abre o arquivo em uma nova aba
    const handleClick = () => {
        if (blobUrl) onOpen();
        else if (hasError) window.open(fileUrl, '_blank', 'noopener,noreferrer');
    };

    const thumbnail = (
        <Box
            position="relative"
            flexShrink={0}
            w={`${thumbWidth}px`}
            h={`${thumbHeight}px`}
            overflow="hidden"
            borderWidth="1px"
            borderColor={thumbBorder}
            borderRadius="sm"
            bg={thumbBg}
            boxShadow={label ? undefined : 'sm'}
        >
            {blobUrl ? (
                <>
                    <Box
                        as="iframe"
                        src={`${blobUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                        title="Miniatura do currículo"
                        w={`${PAGE_WIDTH}px`}
                        h={`${PAGE_WIDTH * (thumbHeight / thumbWidth)}px`}
                        border="0"
                        transform={`scale(${thumbScale})`}
                        transformOrigin="top left"
                        pointerEvents="none"
                        tabIndex={-1}
                    />
                    {!label && (
                        <Flex
                            position="absolute"
                            inset={0}
                            align="center"
                            justify="center"
                            bg="blackAlpha.500"
                            color="white"
                            opacity={0}
                            transition="opacity 0.2s"
                            _groupHover={{ opacity: 1 }}
                            _groupFocus={{ opacity: 1 }}
                        >
                            <MdZoomIn size={size === 'md' ? 18 : 14} />
                        </Flex>
                    )}
                </>
            ) : (
                <Flex h="100%" align="center" justify="center">
                    {hasError ? <MdDescription size={size === 'xs' ? 14 : 20} color="#A0AEC0" /> : <Spinner size="xs" color="blue.400" />}
                </Flex>
            )}
        </Box>
    );

    return (
        <>
            {label ? (
                <Button
                    variant="outline"
                    colorScheme={colorScheme}
                    size={size}
                    onClick={handleClick}
                    isDisabled={!blobUrl && !hasError}
                    fontSize={size === 'xs' ? '10px' : undefined}
                    pl="2px"
                    pr={1.5}
                    gap={1}
                >
                    {thumbnail}
                    {label}
                </Button>
            ) : (
                <Tooltip label={hasError ? 'Abrir currículo' : 'Visualizar currículo'} hasArrow>
                    <Box
                        as="button"
                        type="button"
                        onClick={handleClick}
                        borderRadius="sm"
                        cursor={blobUrl || hasError ? 'pointer' : 'default'}
                        transition="box-shadow 0.2s"
                        _hover={{ boxShadow: 'md' }}
                        aria-label="Visualizar currículo"
                        role="group"
                    >
                        {thumbnail}
                    </Box>
                </Tooltip>
            )}

            <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{title}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {blobUrl && (
                            <Box
                                as="iframe"
                                src={blobUrl}
                                title="Currículo"
                                w="100%"
                                h="75vh"
                                border="0"
                                borderRadius="md"
                            />
                        )}
                    </ModalBody>
                    <ModalFooter gap={3}>
                        <Button as="a" href={fileUrl} target="_blank" rel="noopener noreferrer" variant="outline" leftIcon={<MdOpenInNew />}>
                            Abrir em nova aba
                        </Button>
                        <Button colorScheme="blue" onClick={onClose}>
                            Fechar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
