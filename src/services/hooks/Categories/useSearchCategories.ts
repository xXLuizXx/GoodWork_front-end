import { useQuery } from "react-query";
import { api } from "@/services/apiClient";

interface ISearch{
    search: string;
}

interface ICategory extends Array<{
  id: string;
  name: string;
  description: string;
  valid_category: null;
  created_at: string;
}> {}

async function getGenerateSearchCategories({search}: ISearch): Promise<ICategory> {
    const { data } = await api.get(`categories/searchCategories?search=${search}`);

    return data;
}

function useGenerateSearchCategories(search: string) {
    console.log("Chegou no hook");
    console.log("Valor da busca: ", search)
    return useQuery<ICategory>(
        ["categories/searchCategories", search],
        () => getGenerateSearchCategories({search}),
        {
            staleTime: 1000 * 60 * 10,
            enabled: !!search,
        }
    );
}

export { useGenerateSearchCategories, getGenerateSearchCategories };
export type { ICategory };