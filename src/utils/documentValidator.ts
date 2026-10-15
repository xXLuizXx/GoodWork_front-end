export const onlyDigits = (value: string): string => (value || "").replace(/\D/g, "");

export const isValidEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((email || "").trim());

export const isValidCPF = (value: string): boolean => {
    const cpf = onlyDigits(value);

    // Rejeita tamanho errado e sequências repetidas (ex.: 111.111.111-11), que passam no cálculo
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    const digit = (length: number) => {
        let sum = 0;
        for (let i = 0; i < length; i++) {
            sum += Number(cpf[i]) * (length + 1 - i);
        }
        const rest = (sum * 10) % 11;
        return rest === 10 ? 0 : rest;
    };

    return digit(9) === Number(cpf[9]) && digit(10) === Number(cpf[10]);
};

export const isValidCNPJ = (value: string): boolean => {
    const cnpj = onlyDigits(value);

    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

    const digit = (length: number) => {
        const weights = length === 12
            ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
            : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        const sum = weights.reduce((acc, weight, i) => acc + Number(cnpj[i]) * weight, 0);
        const rest = sum % 11;
        return rest < 2 ? 0 : 11 - rest;
    };

    return digit(12) === Number(cnpj[12]) && digit(13) === Number(cnpj[13]);
};
