import { useQuery, useMutation, useQueryClient } from "react-query";
import { api } from "@/services/apiClient";

export interface INotification {
    id: string;
    user_id: string;
    type: NotificationType;
    title: string;
    body: string;
    resource_id: string | null;
    resource_type: "application" | "interview" | "job" | "category" | "user" | null;
    is_read: boolean;
    read_at: string | null;
    created_at: string;
}

export type NotificationType =
    | "application_approved"
    | "application_rejected"
    | "application_received"
    | "interview_scheduled"
    | "interview_cancelled"
    | "interview_rescheduled"
    | "hired"
    | "not_hired"
    // Enviadas aos admins
    | "job_pending_validation"
    | "category_pending_validation"
    | "user_registered";

export function useUnreadCount(enabled = true) {
    return useQuery(
        ["notifications/unread-count"],
        () => api.get<{ count: number }>("/notifications/unread-count").then(r => r.data),
        { refetchInterval: 30_000, enabled, staleTime: 0 }
    );
}

const fetchNotifications = () => api.get<INotification[]>("/notifications").then(r => r.data);

export function useNotificationsList(enabled = true) {
    return useQuery(["notifications/list"], fetchNotifications, { enabled, staleTime: 10_000 });
}

// Não lidas de um tipo, a partir da mesma lista do sino (as 50 mais recentes).
// Marcar como lida no sino zera o contador, porque as mutations já invalidam essa lista.
export function useUnreadCountByType(type: NotificationType, enabled = true) {
    const { data } = useQuery(["notifications/list"], fetchNotifications, {
        enabled,
        staleTime: 10_000,
        refetchInterval: 30_000,
    });
    return data?.filter((n) => n.type === type && !n.is_read).length ?? 0;
}

export function useMarkAllRead() {
    const queryClient = useQueryClient();
    return useMutation(
        () => api.patch("/notifications/read-all"),
        {
            onSuccess: () => {
                queryClient.setQueryData(["notifications/unread-count"], { count: 0 });
                queryClient.invalidateQueries(["notifications/list"]);
            },
        }
    );
}

export function useMarkRead() {
    const queryClient = useQueryClient();
    return useMutation(
        (id: string) => api.patch(`/notifications/${id}/read`),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["notifications/unread-count"]);
                queryClient.invalidateQueries(["notifications/list"]);
            },
        }
    );
}
