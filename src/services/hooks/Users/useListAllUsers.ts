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
    active?: boolean;
    functionn?: string;
    ability?: string;
    is_employee?: boolean;
    curriculum?: string;
    business_area?: string;
    created_at: Date;
}

interface IGetDataUsersResponse {
    users: IDataUsers[];
}

interface GetDataUsersParams {
    id: string;
    admin: boolean;
}
async function getDataUsers({ id, admin }: GetDataUsersParams): Promise<IGetDataUsersResponse> {
    const { data } = await api.post("users/getAllUsers", { id });

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
            ...(admin && { active: user.active }),
            created_at: user.created_at
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

function useAllDataUsers(id: string, admin: boolean) {
    return useQuery(
        ["users/getAllUsers", id, admin],
        () => getDataUsers({id, admin}),
        {
            staleTime: 1000 * 60 * 10,
            enabled: !!id
        }
    );
}

export { useAllDataUsers, getDataUsers };
export type { IDataUsers };