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
}

interface IGetJobsResponse {
    jobs: IJobs[];
}

async function getJobs(): Promise<IGetJobsResponse> {
    const { data } = await api.get("jobs/list");

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
            valid_vacancy: job.valid_vacancy
        };
    });

    return { jobs };
}

function useAllJobs() {
    return useQuery(
        ["jobs/list"],
        () => getJobs(),
        {
            staleTime: 1000 * 60 * 10,
        }
    );
}

export { useAllJobs, getJobs };
export type { IJobs };