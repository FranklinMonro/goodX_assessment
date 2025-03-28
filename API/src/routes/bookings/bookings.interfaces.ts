interface BookingClientAttribute {
  id?: string;
  'client.id'?: string;
  'client.name'?: string;
  'client.main'?: boolean;
  'client.debtorID'?: string;
}

interface Client {
  id?: string;
  name?: string;
}

interface BookingClient {
  mainClient?: Client;
  patientClients?: Client[];
}

interface BookingDetails {
  name: string;
  email: string;
  date: string;
  time: string;
  duration: number;
  type: string;
}

export { BookingClientAttribute, BookingClient, BookingDetails };
