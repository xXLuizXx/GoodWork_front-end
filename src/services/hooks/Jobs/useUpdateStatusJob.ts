import { useState } from "react";
import  { api } from "@/services/apiClient";
import { useToast } from "@chakra-ui/react";

export const useUpdateStatusJob = () => {
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const updateStatusJob = async (jobId: string, validated: boolean) => {
        setIsLoading(true);
        console.log("ID: " + jobId);
        try {
            await api.patch(`/jobs/updateStatusJob`, { 
                id: jobId,
                valid: validated
            });
            toast({
                title: validated ? "Vaga reaberta com sucesso" : "Vaga fechada com sucesso",
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
                title: `Erro ao atualizar status da vaga`,
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

    return { updateStatusJob, isLoading };
};