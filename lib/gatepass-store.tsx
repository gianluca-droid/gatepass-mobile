import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

import {
  accessLogs as initialAccessLogs,
  activeEvent,
  events,
  participants as initialParticipants,
  type AccessLog,
  type AccessStatus,
  type GatePassEvent,
  type Participant,
} from '@/constants/mock-data';

export type ScanTone = 'success' | 'warning' | 'danger';

export type ScanResult = {
  participant?: Participant;
  log: AccessLog;
  title: string;
  message: string;
  signal: 'OK' | 'STOP' | 'NO';
  tone: ScanTone;
};

type EventStats = {
  total: number;
  checkedIn: number;
  refused: number;
};

type GatePassStore = {
  activeEvent: GatePassEvent;
  events: GatePassEvent[];
  participants: Participant[];
  accessLogs: AccessLog[];
  scanTicket: (ticketCode: string, gate?: string) => ScanResult;
  getAccessLogsByEvent: (eventId: string) => AccessLog[];
  getEventById: (id: string) => GatePassEvent | undefined;
  getEventStats: (eventId: string) => EventStats;
  getParticipantById: (id?: string) => Participant | undefined;
  getParticipantsByEvent: (eventId: string) => Participant[];
};

const GatePassContext = createContext<GatePassStore | null>(null);

export function GatePassProvider({ children }: PropsWithChildren) {
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>(initialAccessLogs);

  const store = useMemo<GatePassStore>(() => {
    function getEventById(id: string) {
      return events.find((event) => event.id === id);
    }

    function getParticipantsByEvent(eventId: string) {
      return participants.filter((participant) => participant.eventId === eventId);
    }

    function getAccessLogsByEvent(eventId: string) {
      return accessLogs.filter((log) => log.eventId === eventId);
    }

    function getParticipantById(id?: string) {
      return participants.find((participant) => participant.id === id);
    }

    function getEventStats(eventId: string) {
      const eventParticipants = getParticipantsByEvent(eventId);
      const eventLogs = getAccessLogsByEvent(eventId);

      return {
        total: eventParticipants.length,
        checkedIn: eventParticipants.filter((participant) => participant.status === 'checked-in')
          .length,
        refused: eventLogs.filter((log) => log.status !== 'valid').length,
      };
    }

    function scanTicket(ticketCode: string, gate = 'Ingresso A') {
      const code = ticketCode.trim().toUpperCase();
      const participant = participants.find(
        (item) => item.eventId === activeEvent.id && item.ticketCode.toUpperCase() === code
      );

      let status: AccessStatus = 'invalid';
      let title = 'Respinto';
      let message = 'Codice non valido per questo evento';
      let signal: ScanResult['signal'] = 'NO';
      let tone: ScanTone = 'danger';

      if (participant?.status === 'valid') {
        status = 'valid';
        title = 'Entra';
        message = `${participant.name} - ${participant.ticketCode}`;
        signal = 'OK';
        tone = 'success';
      } else if (participant?.status === 'checked-in') {
        status = 'used';
        title = 'Gia usato';
        message = `${participant.name} - check-in gia registrato`;
        signal = 'STOP';
        tone = 'warning';
      } else if (participant?.status === 'blocked') {
        title = 'Respinto';
        message = `${participant.name} - partecipante bloccato`;
      }

      const log: AccessLog = {
        id: `a-${Date.now()}`,
        eventId: activeEvent.id,
        participantId: participant?.id,
        code,
        status,
        time: formatTime(new Date()),
        gate,
      };

      if (participant?.status === 'valid') {
        setParticipants((currentParticipants) =>
          currentParticipants.map((item) =>
            item.id === participant.id ? { ...item, status: 'checked-in' } : item
          )
        );
      }

      setAccessLogs((currentLogs) => [log, ...currentLogs]);

      return {
        participant:
          participant?.status === 'valid'
            ? { ...participant, status: 'checked-in' as const }
            : participant,
        log,
        title,
        message,
        signal,
        tone,
      };
    }

    return {
      activeEvent,
      events,
      participants,
      accessLogs,
      scanTicket,
      getAccessLogsByEvent,
      getEventById,
      getEventStats,
      getParticipantById,
      getParticipantsByEvent,
    };
  }, [accessLogs, participants]);

  return <GatePassContext.Provider value={store}>{children}</GatePassContext.Provider>;
}

export function useGatePassStore() {
  const store = useContext(GatePassContext);

  if (!store) {
    throw new Error('useGatePassStore must be used inside GatePassProvider');
  }

  return store;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
