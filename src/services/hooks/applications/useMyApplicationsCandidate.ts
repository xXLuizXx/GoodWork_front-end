import { useQuery } from "react-query";
import { api } from "@/services/apiClient";

interface IMyApplication {
    id: string;
    application_approved: boolean | null;
    hired: boolean | null;
    curriculum_user: string;
    created_at: string;
    user?: {
        name: string;
        avatar: string;
        email: string;
        telephone: string;
        individualData?: {
            functionn: string;
        };
    };
    job?: {
        id: string;
        vacancy: string;
        contractor: string | null;
        amount_vacancy: number;
        vacancy_available: boolean;
        user?: {
            name: string;
        };
    };
    interview?: {
        id: string;
        status: "scheduled" | "rescheduled" | "completed" | "cancelled";
        scheduled_date: string;
        interview_type: "presencial" | "online";
        feedback: string | null;
    } | null;
}

async function getMyApplications(): Promise<IMyApplication[]> {
    const { data } = await api.get("application/myApplications");
    return Array.isArray(data) ? data : [];
}

function useMyApplicationsCandidate(userId: string, options?: { enabled?: boolean }) {
    return useQuery<IMyApplication[]>(
        ["application/myApplications", userId],
        () => getMyApplications(),
        {
            staleTime: 1000 * 60 * 5,
            enabled: (options?.enabled ?? true) && !!userId,
        }
    );
}

export { useMyApplicationsCandidate };
export type { IMyApplication };
