interface AddDialog {
    clientID?: string;
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