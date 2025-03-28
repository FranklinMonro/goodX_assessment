export interface Appointment {
  id?: string;
  allDay?: boolean;
  debtorID?: string;
  description?: string;
  doctorName: 1
  endDate?: Date;
  patientID?: string;
  startDate?: Date;
  title?: string;
}

