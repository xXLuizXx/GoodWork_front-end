import { useState } from "react";
import  { api } from "@/services/apiClient";
import { useToast } from "@chakra-ui/react";

export const useUpdateStatusUser = () => {
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const updateStatusUser = async (userId: string, active: boolean) => {
        setIsLoading(true);
        try {
            await api.patch(`/users/updateStatusUser`, { 
                id: userId,
                active: active
            });
            toast({
                title: active ? "Usuário ativado sucesso" : "Usuário desativado com sucesso",
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
                title: `Erro ao ${active ? "ativa" : "desativar"} usuário`,
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

    return { updateStatusUser, isLoading };
};