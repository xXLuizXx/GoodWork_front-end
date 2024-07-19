import { useQuery } from "react-query";

import { api } from "@/services/apiClient";

interface ICategorie {
    id: string;
    name: string;
    description: string;
}

interface IGetCategoriesResponse {
    categories: ICategorie[];
}

async function getCategories(): Promise<IGetCategoriesResponse> {
    const { data } = await api.get("categories");

    const categories = data.map(category => {
        return {
            id: category.id,
            name: category.name,
            descripion: category.descripion,
        };
    });

     return { categories };
}

function useCategories() {
    return useQuery(
        ["categories"],
        () => getCategories(),
        {
            staleTime: 1000 * 60 * 10,
        }
    );
}

export { useCategories, getCategories };
export type { ICategorie };
