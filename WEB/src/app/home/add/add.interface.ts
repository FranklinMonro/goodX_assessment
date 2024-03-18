interface AddDialog {
    id?: string;
    debtor?: AddDialogDebtor;
}

interface AddDialogDebtor {
    id?: string;
    debtor?: string;
    telephone?: number;
    patients?: AddDialogDebtorPatients[];
}

interface AddDialogDebtorPatients {
    id?: string;
    name?: string;
    main?: boolean;
    relationship?: string;
}

export {
    AddDialog,
    AddDialogDebtor,
    AddDialogDebtorPatients,
};