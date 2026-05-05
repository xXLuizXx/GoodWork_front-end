import { useQueries } from "react-query";
import { api } from "@/services/apiClient";
import { getSeenSnapshot } from "@/utils/interviewSeenState";

interface IInterviewSummary {
    id: string;
    application_id: string;
    status: string;
    scheduled_date: string;
    notice?: string | null;
}

async function getMyInterview(application_id: string): Promise<IInterviewSummary | null> {
    const { data } = await api.get("interview/myInterview", {
        params: { application_id },
    });
    return data ?? null;
}

function usePendingInterviewsCount(
    applicationIds: string[],
    userId: string,
    options?: { enabled?: boolean }
) {
    const enabled = (options?.enabled ?? true) && applicationIds.length > 0;

    const queries = useQueries(
        applicationIds.map((id) => ({
            queryKey: ["interview/myInterview", id],
            queryFn: () => getMyInterview(id),
            enabled,
            staleTime: 1000 * 60 * 2,
        }))
    );

    const isLoading = queries.some((q) => q.isLoading);

    const seenSnapshot = getSeenSnapshot(userId);

    const count = queries.reduce((acc, q) => {
        const interview = q.data as IInterviewSummary | null;
        if (!interview) return acc;
        if (interview.status !== "scheduled" && interview.status !== "rescheduled") return acc;

        const seen = seenSnapshot[interview.id];
        const isUnseen =
            !seen ||
            seen.status !== interview.status ||
            seen.scheduled_date !== interview.scheduled_date ||
            seen.notice !== (interview.notice ?? null);

        return acc + (isUnseen ? 1 : 0);
    }, 0);

    return { count, isLoading };
}

export { usePendingInterviewsCount };
export type { IInterviewSummary };
