import { useQuery } from "react-query";
import { api } from "@/services/apiClient";

interface ICountCategoriesNotValidated extends Array<{
  id: string;
  name: string;
  description: string;
  valid_category: null;
  created_at: string;
}> {}

async function getCountCategoriesNotValidated(): Promise<ICountCategoriesNotValidated> {
    const { data } = await api.get(`categories/categoriesNotValidated`);

    return data;
}

function useCountCategoriesNotValidated(options?: { enabled?: boolean }) {
    return useQuery<ICountCategoriesNotValidated>(
        ["categories/categoriesNotValidated"],
        getCountCategoriesNotValidated,
        {
            staleTime: 1000 * 60 * 10,
            enabled: options?.enabled ?? true,
        }
    );
}

export { useCountCategoriesNotValidated, getCountCategoriesNotValidated };
export type { ICountCategoriesNotValidated };