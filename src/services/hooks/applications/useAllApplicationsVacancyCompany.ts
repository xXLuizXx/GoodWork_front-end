import { useQuery } from "react-query";
import { api } from "@/services/apiClient";

interface IApplicationsVacancyCompany {
    id: string;
    application_approved: boolean | null;
    job_id: string;
    curriculum_user: string;
    user_id: string;
    created_at: Date;
    user?: {
        name: string;
        email: string;
        telephone: string;
        avatar: string;
        individualData?: {
            functionn: string;
        };
    };
    job?: {
        vacancy: string;
        amount_vacancy: number;
        vacancy_available: boolean;
    };
}

async function getApplications(id: string): Promise<IApplicationsVacancyCompany[]> {
    const { data } = await api.get(`application/getApplications?job_id=${id}`);
    return data;
}

export function useAllApplicationsVacancy(id: string) {
    return useQuery(
        ["application/getApplications", {id}],
        () => getApplications(id),
        {
            staleTime: 1000 * 60 * 10,
        }
    );
}

export type { IApplicationsVacancyCompany };