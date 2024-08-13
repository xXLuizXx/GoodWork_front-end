import { useQuery } from "react-query";

import  { api } from "@/services/apiClient";

interface IJobs {
    id: string;
    vacancy: string;
    requirements: string;
    workload: string;
    location: string;
    benefits?: string;
    banner: string;
    category_id: string;
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
            requirements: job.requirements,
            workload: job.workload,
            location: job.location,
            benefits: job.benefits,
            banner: job.banner,
            category_id: job.category_id,
            valid_vacancy: job.valid_vacancy
        };
    });

    return { jobs };
}

function useJobs() {
    return useQuery(
        ["jobs/list"],
        () => getJobs(),
        {
            staleTime: 1000 * 60 * 10,
        }
    );
}

export { useJobs, getJobs };
export type { IJobs };