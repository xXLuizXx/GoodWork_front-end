import { useQuery } from "react-query";
import { api } from "@/services/apiClient";

interface ChartPoint {
    label: string;
    value: number;
}

export interface IAdminOverview {
    users: { total: number; individual: number; company: number };
    jobs: { total: number; active: number; closed: number; pendingValidation: number };
    applications: { total: number; hired: number; hiredRate: number };
}

export interface IAdminJobsByCategory {
    chart: ChartPoint[];
}

export interface ICompanyOverview {
    total: number;
    active: number;
    closed: number;
    avgDays: number;
}

export interface ICompanyFunnel {
    candidates: { chart: ChartPoint[] };
    interviews: { chart: ChartPoint[] };
}

export interface ICompanyFunnelJob {
    job_id: string;
    vacancy: string;
    candidates: { chart: ChartPoint[] };
    interviews: { chart: ChartPoint[] };
}

export interface ICompanyFunnelAll {
    jobs: ICompanyFunnelJob[];
}

export interface IIndividualOverview {
    applications: { total: number; approvalRate: number; chart: ChartPoint[] };
    interviews: { chart: ChartPoint[] };
}

export function useAdminOverview() {
    return useQuery<IAdminOverview>(
        "reports/admin/overview",
        () => api.get("/reports/admin/overview").then(r => r.data),
        { staleTime: 1000 * 60 * 5, refetchOnWindowFocus: false }
    );
}

export function useAdminJobsByCategory() {
    return useQuery<IAdminJobsByCategory>(
        "reports/admin/jobs-by-category",
        () => api.get("/reports/admin/jobs-by-category").then(r => r.data),
        { staleTime: 1000 * 60 * 5, refetchOnWindowFocus: false }
    );
}

export function useCompanyOverview() {
    return useQuery<ICompanyOverview>(
        "reports/company/overview",
        () => api.get("/reports/company/overview").then(r => r.data),
        { staleTime: 1000 * 60 * 5, refetchOnWindowFocus: false }
    );
}

export function useCompanyFunnel(jobId: string, enabled = true) {
    return useQuery<ICompanyFunnel>(
        ["reports/company/funnel", jobId],
        () => api.get(`/reports/company/funnel?job_id=${jobId}`).then(r => r.data),
        { staleTime: 0, refetchOnWindowFocus: false, enabled: enabled && !!jobId }
    );
}

export function useCompanyFunnelAll(enabled = true) {
    return useQuery<ICompanyFunnelAll>(
        ["reports/company/funnel/all"],
        () => api.get("/reports/company/funnel").then(r => r.data),
        { staleTime: 0, refetchOnWindowFocus: false, enabled }
    );
}

export function useIndividualOverview() {
    return useQuery<IIndividualOverview>(
        "reports/individual/overview",
        () => api.get("/reports/individual/overview").then(r => r.data),
        { staleTime: 1000 * 60 * 5, refetchOnWindowFocus: false }
    );
}
