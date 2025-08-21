import { useState } from "react";
import  { api } from "@/services/apiClient";
import { useToast } from "@chakra-ui/react";

export const useValidateCategory = () => {
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const validateCategory = async (categoryId: string, validated: boolean, operation: string) => {
        setIsLoading(true);
        try {
            await api.patch(`/categories/validateCategory`, { 
                id: categoryId,
                aprove: validated
            });
            
            const successMessage = operation === 'validate' 
                ? (validated ? "Categoria aprovada com sucesso" : "Categoria reprovada com sucesso")
                : (validated ? "Categoria ativada com sucesso" : "Categoria desativada com sucesso");
                
            const errorAction = operation === 'validate'
                ? (validated ? "aprovar" : "reprovar")
                : (validated ? "ativar" : "desativar");
                
            toast({
                title: successMessage,
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
            const errorAction = operation === 'validate'
                ? (validated ? "aprovar" : "reprovar")
                : (validated ? "ativar" : "desativar");
                
            toast({
                title: `Erro ao ${errorAction} categoria`,
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

    return { validateCategory, isLoading };
};