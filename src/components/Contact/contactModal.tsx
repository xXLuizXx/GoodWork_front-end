import { AuthContext } from "@/contexts/AuthContext";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    VStack,
    useToast,
    Select,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useAllJobsCompany } from "@/services/hooks/Jobs/useAllJobsCompany";

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: {
        name: string;
        email: string;
        companyId?: string;
    };
    initialData: {
        subject: string;
        company: string;
        email_company: string;
        telephone: string;
        message: string;
        jobTitle?: string;
    };
    onSendContact: (data: {
        subject: string;
        company: string;
        email_company: string;
        telephone: string;
        message: string;
        jobTitle?: string;
    }) => Promise<void>;
}

export function ContactModal({ isOpen, onClose, profile, initialData, onSendContact }: ContactModalProps) {
    const { user } = useContext(AuthContext);
    const toast = useToast();
    const [isSending, setIsSending] = useState(false);
    const [formData, setFormData] = useState(initialData);
    
    const { data: jobs, isLoading: isLoadingJobs } = useAllJobsCompany(user?.id || "");

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                company: user.name || "",
                email_company: user.email || "",
                telephone: user.telephone || ""
            }));
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === "jobTitle") {
            const selectedJob = jobs?.jobs?.find(job => job.id === value);
            setFormData(prev => ({ 
                ...prev, 
                jobTitle: selectedJob?.vacancy || "" 
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async () => {
        if (!formData.company || !formData.email_company || !formData.telephone) {
            toast({
                title: "Campos obrigatórios",
                description: "Preencha todos os campos obrigatórios",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }
  
        setIsSending(true);
        try {
            await onSendContact({
                subject: formData.subject,
                company: formData.company,
                email_company: formData.email_company,
                telephone: formData.telephone,
                message: formData.message,
                jobTitle: formData.jobTitle
            });
            toast({
                title: "Contato enviado!",
                description: `E-mail enviado para ${profile.name}`,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            onClose();
        } catch (error) {
            toast({
                title: "Erro ao enviar",
                description: "Ocorreu um erro ao enviar o contato",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsSending(false);
        }
    };
  
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Enviar proposta para {profile.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <VStack spacing={4}>
                        <FormControl>
                            <FormLabel>Selecione uma vaga (opcional)</FormLabel>
                            <Select
                                name="jobTitle"
                                value={jobs?.jobs?.find(job => job.vacancy === formData.jobTitle)?.id || ""}
                                onChange={handleChange}
                                placeholder={isLoadingJobs ? "Carregando vagas..." : "Selecione uma vaga"}
                                isDisabled={isLoadingJobs}
                            >
                                {jobs?.jobs?.map(job => (
                                    <option key={job.id} value={job.id}>
                                        {job.vacancy}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Assunto</FormLabel>
                            <Input
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Assunto do e-mail"
                            />
                        </FormControl>
            
                        <FormControl isRequired>
                            <FormLabel>Nome da sua empresa</FormLabel>
                            <Input
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="Nome da empresa"
                            />
                        </FormControl>
            
                        <FormControl isRequired>
                            <FormLabel>E-mail para contato</FormLabel>
                            <Input
                                name="email_company"
                                type="email"
                                value={formData.email_company}
                                onChange={handleChange}
                                placeholder="contato@empresa.com"
                            />
                        </FormControl>
            
                        <FormControl isRequired>
                            <FormLabel>Telefone para contato</FormLabel>
                            <Input
                                name="telephone"
                                value={formData.telephone}
                                onChange={handleChange}
                                placeholder="(00) 00000-0000"
                            />
                        </FormControl>
            
                        <FormControl>
                            <FormLabel>Mensagem personalizada</FormLabel>
                            <Textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Escreva sua mensagem aqui..."
                                rows={6}
                            />
                        </FormControl>
                    </VStack>
                </ModalBody>
        
                <ModalFooter>
                    <Button variant="outline" mr={3} onClick={onClose} isDisabled={isSending}>
                        Cancelar
                    </Button>
                    <Button
                        colorScheme="blue"
                        onClick={handleSubmit}
                        isLoading={isSending}
                        loadingText="Enviando..."
                    >
                        Enviar Proposta
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}