import { useQuery } from "react-query";
import { api } from "@/services/apiClient";

interface IApplicationsVacancyCompany {
    id: string;
    application_approved: boolean | null;
    job_id: string;
    curriculum_user: string;
    user_id: string;
    user_name: string;
    user_email: string;
    user_telephone: string;
    user_avatar: string;
    individualUser_functionn: string;
    job_amount_vacancy: number;
    created_at: Date;
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