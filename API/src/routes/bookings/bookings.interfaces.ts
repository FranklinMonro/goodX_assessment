interface BookingClientAttribute {
    id?: string;
    'client.id'?: string;
    'client.name'?: string;
    'client.main'?: boolean;
    'client.debtorID'?: string;
}

interface BookingClient {
    mainClient?: Client;
    patientClients?: Client[];
}

interface Client {
    id?: string;
    name?: string;
}

export {
    BookingClientAttribute,
    BookingClient,
};