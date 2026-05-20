import { useQuery } from "react-query";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface PublicJob {
    id: string;
    vacancy: string;
    contractor: string;
    description_vacancy: string;
    requirements: string;
    workload: string;
    location: string;
    benefits: string;
    banner: string;
    amount_vacancy: number;
    closing_date: string;
    created_at: string;
    vacancy_available: boolean;
    valid_vacancy: boolean | null;
    category: {
        id: string;
        name: string;
        description: string;
    } | null;
    company: {
        id: string;
        name: string;
        avatar: string | null;
        business_area: string;
    } | null;
}

const publicApi = axios.create({ baseURL: API_URL });

export function usePublicJobs(categoryId?: string) {
    const params = categoryId ? `?category_id=${categoryId}` : "";
    return useQuery<PublicJob[]>(
        ["jobs/public", categoryId],
        () => publicApi.get<PublicJob[]>(`/jobs/public${params}`).then(r => r.data),
        { staleTime: 30_000 }
    );
}

export function usePublicJobSearch(query: string) {
    return useQuery<PublicJob[]>(
        ["jobs/public/search", query],
        () => publicApi.get<PublicJob[]>(`/jobs/public/search?q=${encodeURIComponent(query)}`).then(r => r.data),
        { enabled: query.trim().length > 0, staleTime: 30_000 }
    );
}

export function usePublicJobDetail(id: string) {
    return useQuery<PublicJob>(
        ["jobs/public/detail", id],
        () => publicApi.get<PublicJob>(`/jobs/public/${id}`).then(r => r.data),
        { enabled: !!id, staleTime: 30_000 }
    );
}

export function getBannerUrl(banner: string | null | undefined): string | undefined {
    if (!banner) return undefined;
    return `${API_URL}/banners/${banner}`;
}

export function getAvatarUrl(avatar: string | null | undefined): string | undefined {
    if (!avatar) return undefined;
    return `${API_URL}/avatars/${avatar}`;
}
