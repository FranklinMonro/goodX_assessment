interface Appointment {
    title?: string;
    startDate?: Date;
    endDate?: Date;
    dayLong?: boolean;
    recurrence?: string;
    doctor?: string;
    debtor?: string;
    patient?: string;
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