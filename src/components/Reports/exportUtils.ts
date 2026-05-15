import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import type {
    IAdminOverview,
    IAdminJobsByCategory,
    ICompanyOverview,
    ICompanyFunnel,
    ICompanyFunnelAll,
    IIndividualOverview,
} from "@/services/hooks/Reports/useReports";

const DATE_LABEL = `Gerado em: ${new Date().toLocaleDateString("pt-BR")}`;

// ─── PDF helpers ──────────────────────────────────────────────────────────────

function pdfHeader(doc: jsPDF, title: string) {
    doc.setFontSize(16);
    doc.setTextColor(31, 78, 121);
    doc.text(title, 14, 18);
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(DATE_LABEL, 14, 25);
    doc.setTextColor(0, 0, 0);
}

// ─── Excel helpers ────────────────────────────────────────────────────────────

const C = {
    BLUE:        "FF3182CE",
    DARK_BLUE:   "FF1F4E79",
    GREEN:       "FF38A169",
    WHITE:       "FFFFFFFF",
    LIGHT_BLUE:  "FFEBF8FF",
    LIGHT_GREEN: "FFE6FFFA",
    GRAY:        "FF718096",
} as const;

function xlsTitle(ws: ExcelJS.Worksheet, title: string) {
    const row = ws.addRow([title]);
    row.getCell(1).font = { bold: true, size: 13, color: { argb: C.DARK_BLUE } };
    row.height = 24;
}

function xlsDate(ws: ExcelJS.Worksheet) {
    const row = ws.addRow([DATE_LABEL]);
    row.getCell(1).font = { size: 8, italic: true, color: { argb: C.GRAY } };
    ws.addRow([]);
}

function xlsSectionLabel(ws: ExcelJS.Worksheet, label: string) {
    const row = ws.addRow([label]);
    row.getCell(1).font = { bold: true, size: 10, color: { argb: C.DARK_BLUE } };
    row.height = 20;
}

function xlsHeader(ws: ExcelJS.Worksheet, cols: string[], color: string) {
    const row = ws.addRow(cols);
    row.eachCell(cell => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: color } };
        cell.font = { bold: true, color: { argb: C.WHITE } };
        cell.alignment = { vertical: "middle", horizontal: "left" };
        cell.border = { bottom: { style: "thin", color: { argb: "FFCCCCCC" } } };
    });
    row.height = 20;
}

function xlsRows(ws: ExcelJS.Worksheet, data: (string | number)[][], lightBg: string) {
    data.forEach((rowData, i) => {
        const row = ws.addRow(rowData);
        row.eachCell(cell => {
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: i % 2 === 0 ? lightBg : C.WHITE } };
            cell.alignment = { vertical: "middle" };
        });
        row.height = 18;
    });
}

function xlsWidths(ws: ExcelJS.Worksheet, widths: number[]) {
    widths.forEach((w, i) => { ws.getColumn(i + 1).width = w; });
}

async function xlsDownload(wb: ExcelJS.Workbook, filename: string) {
    const buffer = await wb.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export function exportAdminPDF(overview: IAdminOverview, byCategory: IAdminJobsByCategory) {
    const doc = new jsPDF();
    pdfHeader(doc, "GoodWork — Relatório Administrativo");

    autoTable(doc, {
        startY: 32,
        head: [["Métrica", "Valor"]],
        body: [
            ["Total de usuários", overview.users.total],
            ["Usuários individuais", overview.users.individual],
            ["Empresas", overview.users.company],
            ["Total de vagas", overview.jobs.total],
            ["Vagas ativas", overview.jobs.active],
            ["Vagas fechadas", overview.jobs.closed],
            ["Vagas pendentes de validação", overview.jobs.pendingValidation],
            ["Total de candidaturas", overview.applications.total],
            ["Contratados", overview.applications.hired],
            ["Taxa de contratação", `${overview.applications.hiredRate}%`],
        ],
        headStyles: { fillColor: [49, 130, 206] },
    });

    const afterKpi = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(13);
    doc.text("Vagas por Categoria", 14, afterKpi);

    autoTable(doc, {
        startY: afterKpi + 4,
        head: [["Categoria", "Quantidade"]],
        body: byCategory.chart.map(d => [d.label, d.value]),
        headStyles: { fillColor: [49, 130, 206] },
    });

    doc.save("relatorio-admin.pdf");
}

export async function exportAdminExcel(overview: IAdminOverview, byCategory: IAdminJobsByCategory) {
    const wb = new ExcelJS.Workbook();

    const ws1 = wb.addWorksheet("Visão Geral");
    xlsTitle(ws1, "GoodWork — Relatório Administrativo");
    xlsDate(ws1);
    xlsHeader(ws1, ["Métrica", "Valor"], C.BLUE);
    xlsRows(ws1, [
        ["Total de usuários", overview.users.total],
        ["Usuários individuais", overview.users.individual],
        ["Empresas", overview.users.company],
        ["Total de vagas", overview.jobs.total],
        ["Vagas ativas", overview.jobs.active],
        ["Vagas fechadas", overview.jobs.closed],
        ["Vagas pendentes de validação", overview.jobs.pendingValidation],
        ["Total de candidaturas", overview.applications.total],
        ["Contratados", overview.applications.hired],
        ["Taxa de contratação (%)", overview.applications.hiredRate],
    ], C.LIGHT_BLUE);
    xlsWidths(ws1, [34, 16]);

    const ws2 = wb.addWorksheet("Vagas por Categoria");
    xlsTitle(ws2, "GoodWork — Vagas por Categoria");
    xlsDate(ws2);
    xlsHeader(ws2, ["Categoria", "Quantidade"], C.BLUE);
    xlsRows(ws2, byCategory.chart.map(d => [d.label, d.value]), C.LIGHT_BLUE);
    xlsWidths(ws2, [26, 16]);

    await xlsDownload(wb, "relatorio-admin.xlsx");
}

// ─── Empresa — Overview ───────────────────────────────────────────────────────

export function exportCompanyOverviewPDF(overview: ICompanyOverview) {
    const doc = new jsPDF();
    pdfHeader(doc, "GoodWork — Relatório de Vagas");

    autoTable(doc, {
        startY: 32,
        head: [["Métrica", "Valor"]],
        body: [
            ["Total de vagas", overview.total],
            ["Vagas ativas", overview.active],
            ["Vagas fechadas", overview.closed],
            ["Duração média (dias)", overview.avgDays],
        ],
        headStyles: { fillColor: [49, 130, 206] },
    });

    doc.save("relatorio-vagas.pdf");
}

export async function exportCompanyOverviewExcel(overview: ICompanyOverview) {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Minhas Vagas");
    xlsTitle(ws, "GoodWork — Minhas Vagas");
    xlsDate(ws);
    xlsHeader(ws, ["Métrica", "Valor"], C.BLUE);
    xlsRows(ws, [
        ["Total de vagas", overview.total],
        ["Vagas ativas", overview.active],
        ["Vagas fechadas", overview.closed],
        ["Duração média (dias)", overview.avgDays],
    ], C.LIGHT_BLUE);
    xlsWidths(ws, [28, 16]);
    await xlsDownload(wb, "relatorio-vagas.xlsx");
}

// ─── Empresa — Funil ──────────────────────────────────────────────────────────

export function exportCompanyFunnelPDF(funnel: ICompanyFunnel, jobName: string) {
    const doc = new jsPDF();
    pdfHeader(doc, `GoodWork — Funil: ${jobName}`);

    doc.setFontSize(12);
    doc.text("Candidatos", 14, 34);
    autoTable(doc, {
        startY: 38,
        head: [["Status", "Quantidade"]],
        body: funnel.candidates.chart.map(d => [d.label, d.value]),
        headStyles: { fillColor: [49, 130, 206] },
    });

    const afterCandidates = (doc as any).lastAutoTable.finalY + 10;
    doc.text("Entrevistas", 14, afterCandidates);
    autoTable(doc, {
        startY: afterCandidates + 4,
        head: [["Status", "Quantidade"]],
        body: funnel.interviews.chart.map(d => [d.label, d.value]),
        headStyles: { fillColor: [49, 130, 206] },
    });

    doc.save(`funil-${jobName.replace(/\s+/g, "-").toLowerCase()}.pdf`);
}

export async function exportCompanyFunnelExcel(funnel: ICompanyFunnel, jobName: string) {
    const wb = new ExcelJS.Workbook();

    const ws1 = wb.addWorksheet("Candidatos");
    xlsTitle(ws1, `Candidatos — ${jobName}`);
    xlsDate(ws1);
    xlsHeader(ws1, ["Status", "Quantidade"], C.BLUE);
    xlsRows(ws1, funnel.candidates.chart.map(d => [d.label, d.value]), C.LIGHT_BLUE);
    xlsWidths(ws1, [24, 16]);

    const ws2 = wb.addWorksheet("Entrevistas");
    xlsTitle(ws2, `Entrevistas — ${jobName}`);
    xlsDate(ws2);
    xlsHeader(ws2, ["Status", "Quantidade"], C.GREEN);
    xlsRows(ws2, funnel.interviews.chart.map(d => [d.label, d.value]), C.LIGHT_GREEN);
    xlsWidths(ws2, [24, 16]);

    await xlsDownload(wb, `funil-${jobName.replace(/\s+/g, "-").toLowerCase()}.xlsx`);
}

// ─── Empresa — Todas as vagas ─────────────────────────────────────────────────

export function exportCompanyFunnelAllPDF(overview: ICompanyOverview, funnelAll: ICompanyFunnelAll) {
    const doc = new jsPDF();
    pdfHeader(doc, "GoodWork — Relatório Completo de Empresa");

    doc.setFontSize(12);
    doc.text("Visão Geral das Vagas", 14, 34);
    autoTable(doc, {
        startY: 38,
        head: [["Métrica", "Valor"]],
        body: [
            ["Total de vagas", overview.total],
            ["Vagas ativas", overview.active],
            ["Vagas fechadas", overview.closed],
            ["Duração média (dias)", overview.avgDays],
        ],
        headStyles: { fillColor: [49, 130, 206] },
    });

    let y = (doc as any).lastAutoTable.finalY + 12;

    for (const job of funnelAll.jobs) {
        if (y > 240) { doc.addPage(); y = 20; }
        doc.setFontSize(12);
        doc.text(`Vaga: ${job.vacancy}`, 14, y);

        autoTable(doc, {
            startY: y + 4,
            head: [["Candidatos — Status", "Qtd"]],
            body: job.candidates.chart.map(d => [d.label, d.value]),
            headStyles: { fillColor: [49, 130, 206] },
            margin: { left: 14 },
        });
        y = (doc as any).lastAutoTable.finalY + 4;

        autoTable(doc, {
            startY: y,
            head: [["Entrevistas — Status", "Qtd"]],
            body: job.interviews.chart.map(d => [d.label, d.value]),
            headStyles: { fillColor: [56, 161, 105] },
            margin: { left: 14 },
        });
        y = (doc as any).lastAutoTable.finalY + 10;
    }

    doc.save("relatorio-completo-empresa.pdf");
}

export async function exportCompanyFunnelAllExcel(overview: ICompanyOverview, funnelAll: ICompanyFunnelAll) {
    const wb = new ExcelJS.Workbook();

    const ws0 = wb.addWorksheet("Visão Geral");
    xlsTitle(ws0, "GoodWork — Relatório Completo de Empresa");
    xlsDate(ws0);
    xlsHeader(ws0, ["Métrica", "Valor"], C.BLUE);
    xlsRows(ws0, [
        ["Total de vagas", overview.total],
        ["Vagas ativas", overview.active],
        ["Vagas fechadas", overview.closed],
        ["Duração média (dias)", overview.avgDays],
    ], C.LIGHT_BLUE);
    xlsWidths(ws0, [28, 16]);

    for (const job of funnelAll.jobs) {
        const ws = wb.addWorksheet(job.vacancy.slice(0, 28));
        xlsTitle(ws, job.vacancy);
        xlsDate(ws);

        xlsSectionLabel(ws, "Candidatos");
        xlsHeader(ws, ["Status", "Quantidade"], C.BLUE);
        xlsRows(ws, job.candidates.chart.map(d => [d.label, d.value]), C.LIGHT_BLUE);

        ws.addRow([]);

        xlsSectionLabel(ws, "Entrevistas");
        xlsHeader(ws, ["Status", "Quantidade"], C.GREEN);
        xlsRows(ws, job.interviews.chart.map(d => [d.label, d.value]), C.LIGHT_GREEN);

        xlsWidths(ws, [28, 16]);
    }

    await xlsDownload(wb, "relatorio-completo-empresa.xlsx");
}

// ─── Empresa — Completo (overview + funil único) ──────────────────────────────

export function exportCompanyFullPDF(overview: ICompanyOverview, funnel: ICompanyFunnel, jobName: string) {
    const doc = new jsPDF();
    pdfHeader(doc, "GoodWork — Relatório Completo de Empresa");

    doc.setFontSize(12);
    doc.text("Visão Geral das Vagas", 14, 34);
    autoTable(doc, {
        startY: 38,
        head: [["Métrica", "Valor"]],
        body: [
            ["Total de vagas", overview.total],
            ["Vagas ativas", overview.active],
            ["Vagas fechadas", overview.closed],
            ["Duração média (dias)", overview.avgDays],
        ],
        headStyles: { fillColor: [49, 130, 206] },
    });

    const afterOverview = (doc as any).lastAutoTable.finalY + 12;
    doc.setFontSize(12);
    doc.text(`Funil — ${jobName}`, 14, afterOverview);

    doc.setFontSize(10);
    doc.text("Candidatos", 14, afterOverview + 8);
    autoTable(doc, {
        startY: afterOverview + 12,
        head: [["Status", "Quantidade"]],
        body: funnel.candidates.chart.map(d => [d.label, d.value]),
        headStyles: { fillColor: [49, 130, 206] },
    });

    const afterCandidates = (doc as any).lastAutoTable.finalY + 10;
    doc.text("Entrevistas", 14, afterCandidates);
    autoTable(doc, {
        startY: afterCandidates + 4,
        head: [["Status", "Quantidade"]],
        body: funnel.interviews.chart.map(d => [d.label, d.value]),
        headStyles: { fillColor: [49, 130, 206] },
    });

    doc.save("relatorio-completo-empresa.pdf");
}

export async function exportCompanyFullExcel(overview: ICompanyOverview, funnel: ICompanyFunnel, jobName: string) {
    const wb = new ExcelJS.Workbook();

    const ws0 = wb.addWorksheet("Visão Geral");
    xlsTitle(ws0, "GoodWork — Relatório Completo de Empresa");
    xlsDate(ws0);
    xlsHeader(ws0, ["Métrica", "Valor"], C.BLUE);
    xlsRows(ws0, [
        ["Total de vagas", overview.total],
        ["Vagas ativas", overview.active],
        ["Vagas fechadas", overview.closed],
        ["Duração média (dias)", overview.avgDays],
    ], C.LIGHT_BLUE);
    xlsWidths(ws0, [28, 16]);

    const ws1 = wb.addWorksheet("Candidatos");
    xlsTitle(ws1, `Candidatos — ${jobName}`);
    xlsDate(ws1);
    xlsHeader(ws1, ["Status", "Quantidade"], C.BLUE);
    xlsRows(ws1, funnel.candidates.chart.map(d => [d.label, d.value]), C.LIGHT_BLUE);
    xlsWidths(ws1, [24, 16]);

    const ws2 = wb.addWorksheet("Entrevistas");
    xlsTitle(ws2, `Entrevistas — ${jobName}`);
    xlsDate(ws2);
    xlsHeader(ws2, ["Status", "Quantidade"], C.GREEN);
    xlsRows(ws2, funnel.interviews.chart.map(d => [d.label, d.value]), C.LIGHT_GREEN);
    xlsWidths(ws2, [24, 16]);

    await xlsDownload(wb, "relatorio-completo-empresa.xlsx");
}

// ─── Individual ───────────────────────────────────────────────────────────────

export function exportIndividualPDF(overview: IIndividualOverview) {
    const doc = new jsPDF();
    pdfHeader(doc, "GoodWork — Meu Relatório");

    autoTable(doc, {
        startY: 32,
        head: [["Métrica", "Valor"]],
        body: [
            ["Total de candidaturas", overview.applications.total],
            ["Taxa de aprovação", `${overview.applications.approvalRate}%`],
        ],
        headStyles: { fillColor: [49, 130, 206] },
    });

    const afterKpi = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text("Status das Candidaturas", 14, afterKpi);
    autoTable(doc, {
        startY: afterKpi + 4,
        head: [["Status", "Quantidade"]],
        body: overview.applications.chart.map(d => [d.label, d.value]),
        headStyles: { fillColor: [49, 130, 206] },
    });

    const afterApps = (doc as any).lastAutoTable.finalY + 10;
    doc.text("Entrevistas", 14, afterApps);
    autoTable(doc, {
        startY: afterApps + 4,
        head: [["Status", "Quantidade"]],
        body: overview.interviews.chart.map(d => [d.label, d.value]),
        headStyles: { fillColor: [49, 130, 206] },
    });

    doc.save("meu-relatorio.pdf");
}

export async function exportIndividualExcel(overview: IIndividualOverview) {
    const wb = new ExcelJS.Workbook();

    const ws1 = wb.addWorksheet("Candidaturas");
    xlsTitle(ws1, "GoodWork — Minhas Candidaturas");
    xlsDate(ws1);
    xlsHeader(ws1, ["Métrica", "Valor"], C.BLUE);
    xlsRows(ws1, [
        ["Total de candidaturas", overview.applications.total],
        ["Taxa de aprovação (%)", overview.applications.approvalRate],
    ], C.LIGHT_BLUE);
    ws1.addRow([]);
    xlsSectionLabel(ws1, "Status das Candidaturas");
    xlsHeader(ws1, ["Status", "Quantidade"], C.BLUE);
    xlsRows(ws1, overview.applications.chart.map(d => [d.label, d.value]), C.LIGHT_BLUE);
    xlsWidths(ws1, [30, 16]);

    const ws2 = wb.addWorksheet("Entrevistas");
    xlsTitle(ws2, "GoodWork — Minhas Entrevistas");
    xlsDate(ws2);
    xlsHeader(ws2, ["Status", "Quantidade"], C.GREEN);
    xlsRows(ws2, overview.interviews.chart.map(d => [d.label, d.value]), C.LIGHT_GREEN);
    xlsWidths(ws2, [24, 16]);

    await xlsDownload(wb, "meu-relatorio.xlsx");
}
