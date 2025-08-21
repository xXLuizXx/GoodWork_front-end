import { useQuery } from "react-query";
import { api } from "@/services/apiClient";

interface ICategory extends Array<{
  id: string;
  name: string;
  description: string;
  valid_category: null;
  created_at: string;
}> {}

async function getGenerateCategories(): Promise<ICategory> {
    const { data } = await api.get(`categories/allCategories`);

    return data;
}

function useGenerateCategories() {
    return useQuery<ICategory>(
        ["categories/allCategories"],
        getGenerateCategories,
        {
            staleTime: 1000 * 60 * 10,
        }
    );
}

export { useGenerateCategories, getGenerateCategories };
export type { ICategory };