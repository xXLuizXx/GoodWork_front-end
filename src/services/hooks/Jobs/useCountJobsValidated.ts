import { useQuery } from "react-query";
import { api } from "@/services/apiClient";

interface ICountJobsNotValidated {
    count: number;
}

async function getCountJobsVacancyNotValidated(): Promise<ICountJobsNotValidated> {
    const { data } = await api.get(`jobs/countVacancyNotValidated`);

    return {
        count: data
    };
}

function useCountJobsNotValidated() {
    return useQuery<ICountJobsNotValidated>(
        ["jobs/countVacancyNotValidated"],
        getCountJobsVacancyNotValidated,
        {
            staleTime: 1000 * 60 * 10,
        }
    );
}

export { useCountJobsNotValidated, getCountJobsVacancyNotValidated };
export type { ICountJobsNotValidated };