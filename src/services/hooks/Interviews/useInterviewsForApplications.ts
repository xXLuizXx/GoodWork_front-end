import { useQuery } from "react-query";
import { api } from "@/services/apiClient";

async function getApplicationsWithInterviews(applicationIds: string[]): Promise<Set<string>> {
    if (applicationIds.length === 0) return new Set();

    const results = await Promise.all(
        applicationIds.map((id) =>
            api.post("interview/searchInterview", { application_id: id })
                .then((res) => (res.data ? id : null))
                .catch(() => null)
        )
    );

    return new Set(results.filter((id): id is string => id !== null));
}

export function useInterviewsForApplications(applicationIds: string[]) {
    return useQuery(
        ["interview/searchInterview", applicationIds],
        () => getApplicationsWithInterviews(applicationIds),
        {
            enabled: applicationIds.length > 0,
            staleTime: 1000 * 60 * 5,
        }
    );
}
