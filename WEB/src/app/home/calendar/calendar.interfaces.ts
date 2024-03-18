interface Appointment {
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

interface BookingClient {
    mainClient?: Patient;
    patientClients?: Patient[];
}

interface Patient {
    id?: string;
    name?: string;
}

export {
    Appointment,
    BookingClient,
    Patient,
};