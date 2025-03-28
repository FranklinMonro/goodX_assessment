export interface BookingClient {
  mainClient?: Patient;
  patientClients?: Patient[];
}

export interface Patient {
  id?: string;
  name?: string;
}

export interface AddDialog {
  clientID?: string;
}

export interface AddDialogDebtor {
  id?: string;
  debtor?: string;
  telephone?: number;
  patients?: AddDialogDebtorPatients[];
}

export interface AddDialogDebtorPatients {
  id?: string;
  name?: string;
  main?: boolean;
  relationship?: string;
}