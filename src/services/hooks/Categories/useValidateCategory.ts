import { useState } from "react";
import  { api } from "@/services/apiClient";
import { useToast } from "@chakra-ui/react";

export const useValidateCategory = () => {
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const validateCategory = async (categoryId: string, validated: boolean) => {
        setIsLoading(true);
        console.log("ID ["+categoryId+"], APROVADA? ["+validated+"]");
        try {
            await api.patch(`/categories/validateCategory`, { 
                id: categoryId,
                aprove: validated
            });
            toast({
                title: validated ? "Categoria aprovada com sucesso" : "Categoria reprovada com sucesso",
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

    return { validateCategory, isLoading };
};