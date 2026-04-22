import { useQuery } from "react-query";
import { api } from "@/services/apiClient";

interface IInterview {
    id: string;
    application_id: string;
    interview_type: "presencial" | "online";
    scheduled_date: string;
    duration_minutes: number;
    location?: string;
    meeting_link?: string;
    interviewer_name: string;
    interviewer_email: string;
    notes?: string;
    status: string;
    created_at: string;
}

interface IGetInterviewsResponse {
    interviews: IInterview[];
}

async function getMyInterviews(application_id: string): Promise<IGetInterviewsResponse> {
    const { data } = await api.get("interview/searchAllInterview", {
        params: { application_id },
    });

    const interviews = Array.isArray(data) ? data.map((interview: IInterview) => ({
        id: interview.id,
        application_id: interview.application_id,
        interview_type: interview.interview_type,
        scheduled_date: interview.scheduled_date,
        duration_minutes: interview.duration_minutes,
        location: interview.location,
        meeting_link: interview.meeting_link,
        interviewer_name: interview.interviewer_name,
        interviewer_email: interview.interviewer_email,
        notes: interview.notes,
        status: interview.status,
        created_at: interview.created_at,
    })) : [];

    return { interviews };
}

function useMyInterviews(application_id: string) {
    return useQuery(
        ["interview/searchAllInterview", application_id],
        () => getMyInterviews(application_id),
        {
            enabled: !!application_id,
            staleTime: 1000 * 60 * 10,
        }
    );
}

export { useMyInterviews, getMyInterviews };
export type { IInterview };
