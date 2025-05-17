import { useQuery } from "react-query";
import  { api } from "@/services/apiClient";

interface IDataUsers {
    id?: string;
    name: string;
    email: string;
    telephone: string;
    avatar?: string;
    road: string;
    number: string;
    neighborhood: string;
    user_type: "individual" | "company";
    functionn?: string;
    ability?: string;
    is_employee?: boolean;
    curriculum?: string;
    business_area?: string;
}

interface IGetDataUsersResponse {
    users: IDataUsers[];
}

async function getDataUsersSearch(search:string, id: string): Promise<IGetDataUsersResponse> {
    const { data } = await api.post("users/getAllUsersSearch", { search, id });

    const users = data.map(user => {
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            telephone: user.telephone,
            avatar: user.avatar,
            road: user.road,
            number: user.number,
            neighborhood: user.neighborhood,
            user_type: user.user_type,
        };

        if (user.user_type === 'individual' && user.individualData) {
            return {
                ...userData,
                functionn: user.individualData.functionn,
                ability: user.individualData.ability,
                is_employee: user.individualData.is_employee,
                curriculum: user.individualData.curriculum,
                business_area: undefined
            };
        } else if (user.user_type === 'company' && user.companyData) {
            return {
                ...userData,
                functionn: undefined,
                ability: undefined,
                is_employee: undefined,
                curriculum: undefined,
                business_area: user.companyData.business_area
            };
        }

        return userData;
    });

    return { users };
}

function useAllDataUsersSearch(search: string, id: string) {
    return useQuery(
        ["users/getAllUsersSearch", search, id],
        () => getDataUsersSearch(search, id),
        {
            staleTime: 1000 * 60 * 10,
            enabled: !!id && !!search,
            refetchOnWindowFocus: false,
        }
    );
}

export { useAllDataUsersSearch, getDataUsersSearch };
export type { IDataUsers };