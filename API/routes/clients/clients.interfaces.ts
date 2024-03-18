interface Debtor {
    id?: string;
    debtor?: string;
    telephone?: number;
    patients?: DebtorPatients[];
}

interface DebtorPatients {
    id?: string;
    name?: string;
    main?: boolean;
    relationship?: string;
}

export {
    Debtor,
    DebtorPatients,
};