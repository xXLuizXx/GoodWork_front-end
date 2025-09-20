import { useQuery } from "react-query";
import { api } from "@/services/apiClient";

interface IJob {
    id: string;
    vacancy: string;
    contractor: string;
    description_vacancy: string;
    requirements: string;
    workload: string;
    location: string;
    benefits?: string;
    banner: string;
    vacancy_available: boolean;
    category_id: string;
    user_id: string;
    user_name: string;
    user_avatar: string;
    valid_vacancy: boolean;
    amount_vacancy: number;
    closing_date: Date;
    created_at: Date;
}

interface IGetJobsResponse {
    jobs: IJob[];
}

async function getJobs(): Promise<IGetJobsResponse> {
    const response = await api.get("jobs/listForUserLogged");
    
    const jobs = response.data.map((job: any) => {
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
            category_id: job.category_id,
            user_id: job.user_id,
            user_name: job.user?.name || '',
            user_avatar: job.user?.avatar || '',
            valid_vacancy: job.valid_vacancy,
            amount_vacancy: job.amount_vacancy,
            closing_date: job.closing_date,
            created_at: job.created_at
        };
    });

    return { jobs };
}

function useAllJobsForUserLogged() {
    return useQuery(
        ["jobs/listForUserLogged"],
        () => getJobs(),
        {
            staleTime: 1000 * 60 * 10,
        }
    );
}

export { useAllJobsForUserLogged, getJobs };
export type { IJob };