import { useState } from "react";
import  { api } from "@/services/apiClient";
import { useToast } from "@chakra-ui/react";

export const useValidateJob = () => {
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const validateJob = async (jobId: string, validated: boolean) => {
        setIsLoading(true);
        try {
            await api.patch(`/jobs/aproveJob`, { 
                id_vacancy: jobId,
                valid: validated
            });
            toast({
                title: validated ? "Vaga aprovada com sucesso" : "Vaga reprovada com sucesso",
                status: "success",
                duration: 2000,
                position: "top",
                isClosable: true,
            });
            setTimeout(() => {
                window.location.reload();
            }, 100);
            return true;
        } catch (error) {
            toast({
                title: `Erro ao ${validated ? "aprovar" : "reprovar"} vaga`,
                description: error.response?.data?.message || "Ocorreu um erro",
                status: "error",
                duration: 2000,
                position: "top",
                isClosable: true,
            });
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { validateJob, isLoading };
};