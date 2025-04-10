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
    category_id: string;
    user_id: string;
    user_name: string;
    valid_vacancy: boolean;
    amount_vacancy: number;
}

interface IGetJobsResponse {
    jobs: IJobs[];
}

async function getJobsCategory(category_id: string): Promise<IGetJobsResponse> {
    const { data } = await api.get(`jobs/listCategories?category_id=${category_id}`);

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
            category_id: job.category_id,
            user_id: job.user_id,
            user_name: job.user.name,
            valid_vacancy: job.valid_vacancy,
            amount_vacancy: job.amount_vacancy
        };
    });

    return { jobs };
}

function useJobsCategories(category_id: string) {
    return useQuery(
        ["jobs/listCategories", category_id],
        () => getJobsCategory(category_id),
        {
            staleTime: 1000 * 60 * 10,
        }
    );
}

export { useJobsCategories, getJobsCategory };
export type { IJobs };