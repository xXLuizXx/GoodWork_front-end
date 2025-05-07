import { useQuery } from "react-query";
import  { api } from "@/services/apiClient";

interface IJobs {
    id: string;
    vacancy: string;
    contractor: string;
    description_vacancy: string;
    requirements: string;
    workload: string;
    location: string;
    benefits?: string;
    banner: string;
    vacancy_available: string;
    category_id: string;
    user_id: string;
    user_name: string;
    valid_vacancy: boolean;
    amount_vacancy: number;
    closing_date: Date;
    created_at: Date;
}

interface IGetJobsResponse {
    jobs: IJobs[];
}

async function getAllJobsCompany( user_id: string ): Promise<IGetJobsResponse> {
    const { data } = await api.get(`jobs/listJobsCompany?id=${user_id}`);

    const jobs = data.map(job => {
        return {
            id: job.id,
            vacancy: job.vacancy,
            contractor: job.contractor,
            description_vacancy: job.description_vacancy,
            requirements: job.requirements,
            workload: job.workload,
            location: job.location,
            benefits: job.benefits,
            banner: job.banner,
            vacancy_available: job.vacancy_available,
            category_id: job.category_id,
            user_id: job.user_id,
            user_name: job.user.name,
            valid_vacancy: job.valid_vacancy,
            amount_vacancy: job.amount_vacancy,
            closing_date: job.closing_date,
            created_at: job.created_at
        };
    });

    return { jobs };
}

function useAllJobsCompany(user_id: string) {
    return useQuery(
        ["jobs/listJobsCompany", user_id],
        () => getAllJobsCompany(user_id),
        {
            staleTime: 1000 * 60 * 10,
        }
    );
}

export { useAllJobsCompany, getAllJobsCompany };
export type { IJobs };