import { useQuery } from "react-query";
import  { api } from "@/services/apiClient";

interface IDataUser {
    id?: string;
    name: string;
    email: string;
    telephone: string;
    avatar?: string;
    road: string;
    number: string;
    neighborhood: string;
    user_type: "individual" | "company";
    active: boolean;
    functionn?: string;
    ability?: string;
    is_employee?: boolean;
    curriculum?: string;
    business_area?: string;
}

interface IGetDataUserResponse {
    user: IDataUser;
}

async function getDataUser(id: string): Promise<IGetDataUserResponse> {
    const { data } = await api.get(`users/profile?id=${id}`);

    console.log("Dados do usuário: ", data);
    const userData = {
        id: data.id,
        name: data.name,
        email: data.email,
        telephone: data.telephone,
        avatar: data.avatar,
        road: data.road,
        number: data.number,
        neighborhood: data.neighborhood,
        user_type: data.user_type,
        active: data.active
    };

    let userResponse;
    
    if (data.user_type === 'individual' && data.individualData) {
        userResponse = {
            ...userData,
            functionn: data.individualData.functionn,
            ability: data.individualData.ability,
            is_employee: data.individualData.is_employee,
            curriculum: data.individualData.curriculum,
            business_area: undefined
        };
    } else if (data.user_type === 'company' && data.companyData) {
        userResponse = {
            ...userData,
            functionn: undefined,
            ability: undefined,
            is_employee: undefined,
            curriculum: undefined,
            business_area: data.companyData.business_area
        };
    } else {
        userResponse = userData;
    }

    return { user: userResponse };
}

function useDataUser(id: string) {
    return useQuery(
        ["users/profile",  id],
        () => getDataUser(id),
        {
            staleTime: 1000 * 60 * 10,
            enabled: !!id,
            refetchOnWindowFocus: false,
        }
    );
}

export { useDataUser, getDataUser };
export type { IDataUser };