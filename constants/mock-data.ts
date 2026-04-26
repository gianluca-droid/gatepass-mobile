export type EventStatus = 'active' | 'scheduled' | 'closed';
export type ParticipantStatus = 'valid' | 'checked-in' | 'blocked';
export type AccessStatus = 'valid' | 'used' | 'invalid';

export type GatePassEvent = {
  id: string;
  name: string;
  venue: string;
  date: string;
  time: string;
  status: EventStatus;
  expectedParticipants: number;
};

export type Participant = {
  id: string;
  eventId: string;
  name: string;
  email: string;
  ticketCode: string;
  status: ParticipantStatus;
};

export type AccessLog = {
  id: string;
  eventId: string;
  participantId?: string;
  code: string;
  status: AccessStatus;
  time: string;
  gate: string;
};

export const events: GatePassEvent[] = [
  {
    id: 'summit-2026',
    name: 'Tech Leadership Summit',
    venue: 'Milano Convention Center',
    date: '26 Apr 2026',
    time: '18:30',
    status: 'active',
    expectedParticipants: 420,
  },
  {
    id: 'design-night',
    name: 'Design Night Live',
    venue: 'Officine Torino',
    date: '28 Apr 2026',
    time: '20:00',
    status: 'scheduled',
    expectedParticipants: 260,
  },
  {
    id: 'founders-breakfast',
    name: 'Founders Breakfast',
    venue: 'Roma Hub',
    date: '24 Apr 2026',
    time: '09:00',
    status: 'closed',
    expectedParticipants: 90,
  },
];

export const participants: Participant[] = [
  {
    id: 'p-001',
    eventId: 'summit-2026',
    name: 'Giulia Conti',
    email: 'giulia.conti@example.com',
    ticketCode: 'GP-SUM-001',
    status: 'checked-in',
  },
  {
    id: 'p-002',
    eventId: 'summit-2026',
    name: 'Marco Leone',
    email: 'marco.leone@example.com',
    ticketCode: 'GP-SUM-002',
    status: 'valid',
  },
  {
    id: 'p-003',
    eventId: 'summit-2026',
    name: 'Sara Vitale',
    email: 'sara.vitale@example.com',
    ticketCode: 'GP-SUM-003',
    status: 'blocked',
  },
  {
    id: 'p-004',
    eventId: 'summit-2026',
    name: 'Luca Ferri',
    email: 'luca.ferri@example.com',
    ticketCode: 'GP-SUM-004',
    status: 'checked-in',
  },
  {
    id: 'p-005',
    eventId: 'design-night',
    name: 'Elena Riva',
    email: 'elena.riva@example.com',
    ticketCode: 'GP-DES-001',
    status: 'valid',
  },
  {
    id: 'p-006',
    eventId: 'founders-breakfast',
    name: 'Andrea Russo',
    email: 'andrea.russo@example.com',
    ticketCode: 'GP-FND-001',
    status: 'checked-in',
  },
];

export const accessLogs: AccessLog[] = [
  {
    id: 'a-001',
    eventId: 'summit-2026',
    participantId: 'p-001',
    code: 'GP-SUM-001',
    status: 'valid',
    time: '18:12',
    gate: 'Ingresso A',
  },
  {
    id: 'a-002',
    eventId: 'summit-2026',
    participantId: 'p-003',
    code: 'GP-SUM-003',
    status: 'invalid',
    time: '18:16',
    gate: 'Ingresso A',
  },
  {
    id: 'a-003',
    eventId: 'summit-2026',
    participantId: 'p-004',
    code: 'GP-SUM-004',
    status: 'valid',
    time: '18:21',
    gate: 'Ingresso B',
  },
  {
    id: 'a-004',
    eventId: 'summit-2026',
    participantId: 'p-001',
    code: 'GP-SUM-001',
    status: 'used',
    time: '18:32',
    gate: 'Ingresso A',
  },
];

export const activeEvent = events.find((event) => event.status === 'active') ?? events[0];

export function getEventById(id: string) {
  return events.find((event) => event.id === id);
}

export function getParticipantsByEvent(eventId: string) {
  return participants.filter((participant) => participant.eventId === eventId);
}

export function getAccessLogsByEvent(eventId: string) {
  return accessLogs.filter((log) => log.eventId === eventId);
}

export function getParticipantById(id?: string) {
  return participants.find((participant) => participant.id === id);
}

export function getEventStats(eventId: string) {
  const eventParticipants = getParticipantsByEvent(eventId);
  const eventLogs = getAccessLogsByEvent(eventId);

  return {
    total: eventParticipants.length,
    checkedIn: eventParticipants.filter((participant) => participant.status === 'checked-in')
      .length,
    refused: eventLogs.filter((log) => log.status !== 'valid').length,
  };
}

export const dashboardStats = {
  activeEvents: events.filter((event) => event.status === 'active').length,
  totalParticipants: events.reduce((sum, event) => sum + event.expectedParticipants, 0),
  checkedIn: participants.filter((participant) => participant.status === 'checked-in').length,
  refused: accessLogs.filter((log) => log.status !== 'valid').length,
};
