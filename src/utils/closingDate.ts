// A API envia a data de encerramento como "YYYY-MM-DD" (um dia do calendário, sem fuso).
// new Date("YYYY-MM-DD") seria meia-noite UTC, que no Brasil vira o dia anterior.
// Aqui o dia é lido no horário local e vale até o último instante dele: a vaga fica aberta o dia todo.
export function parseClosingDate(value: string | Date): Date {
    const match = typeof value === "string" ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(value) : null;

    if (!match) return new Date(value);

    const [, year, month, day] = match;
    return new Date(+year, +month - 1, +day, 23, 59, 59, 999);
}

// Dias de calendário até o encerramento: 0 = encerra hoje, negativo = já encerrou
export function daysUntilClosing(value: string | Date): number {
    const closing = parseClosingDate(value);
    const today = new Date();
    const closingDay = new Date(closing.getFullYear(), closing.getMonth(), closing.getDate());
    const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    return Math.round((closingDay.getTime() - todayDay.getTime()) / (1000 * 60 * 60 * 24));
}
