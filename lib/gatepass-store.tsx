import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

import {
  accessLogs as initialAccessLogs,
  activeEvent,
  events,
  gates,
  initialGate,
  participants as initialParticipants,
  type AccessLog,
  type AccessStatus,
  type Gate,
  type GateId,
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
  activeGate: Gate;
  events: GatePassEvent[];
  gates: Gate[];
  participants: Participant[];
  accessLogs: AccessLog[];
  checkInParticipantManually: (participantId: string, gate?: string) => ScanResult | undefined;
  getGateById: (id: GateId) => Gate | undefined;
  overrideCheckInParticipant: (participantId: string, reason?: string) => ScanResult | undefined;
  resetDemo: () => void;
  scanTicket: (ticketCode: string, gate?: string) => ScanResult;
  setActiveGate: (gateId: GateId) => void;
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
  const [activeGate, setActiveGateState] = useState<Gate>(initialGate);

  const store = useMemo<GatePassStore>(() => {
    function getGateById(id: GateId) {
      return gates.find((gate) => gate.id === id);
    }

    function setActiveGate(gateId: GateId) {
      const nextGate = getGateById(gateId);

      if (nextGate) {
        setActiveGateState(nextGate);
      }
    }

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

    function checkInParticipantManually(participantId: string, gate = activeGate.name) {
      const participant = participants.find(
        (item) => item.eventId === activeEvent.id && item.id === participantId
      );

      if (!participant) {
        return undefined;
      }

      let status: AccessStatus = 'invalid';
      let title = 'Respinto';
      let message = `${participant.name} - partecipante bloccato`;
      let signal: ScanResult['signal'] = 'NO';
      let tone: ScanTone = 'danger';

      if (participant.status === 'checked-in') {
        status = 'used';
        title = 'Gia entrato';
        message = `${participant.name} - ingresso gia registrato`;
        signal = 'STOP';
        tone = 'warning';
      } else if (participant.status === 'blocked') {
        title = 'Respinto';
        message = `${participant.name} - partecipante bloccato`;
      } else if (participant.allowedGateId !== activeGate.id) {
        title = 'Gate errato';
        message = `${participant.name} deve entrare da ${getGateById(participant.allowedGateId)?.name ?? 'un altro gate'}`;
      } else {
        status = 'valid';
        title = 'Ingresso manuale';
        message = `${participant.name} - ${participant.ticketCode}`;
        signal = 'OK';
        tone = 'success';
      }

      const log: AccessLog = {
        id: `a-${Date.now()}`,
        eventId: activeEvent.id,
        participantId: participant.id,
        code: participant.ticketCode,
        status,
        time: formatTime(new Date()),
        gate: `${gate} - manuale`,
        method: 'manual',
      };

      if (status === 'valid') {
        setParticipants((currentParticipants) =>
          currentParticipants.map((item) =>
            item.id === participant.id ? { ...item, status: 'checked-in' } : item
          )
        );
      }

      setAccessLogs((currentLogs) => [log, ...currentLogs]);

      return {
        participant:
          status === 'valid'
            ? { ...participant, status: 'checked-in' as const }
            : participant,
        log,
        title,
        message,
        signal,
        tone,
      };
    }

    function overrideCheckInParticipant(
      participantId: string,
      reason = 'Autorizzato da supervisore'
    ) {
      const participant = participants.find(
        (item) => item.eventId === activeEvent.id && item.id === participantId
      );

      if (!participant) {
        return undefined;
      }

      let status: AccessStatus = 'invalid';
      let title = 'Respinto';
      let message = `${participant.name} - partecipante bloccato`;
      let signal: ScanResult['signal'] = 'NO';
      let tone: ScanTone = 'danger';

      if (participant.status === 'checked-in') {
        status = 'used';
        title = 'Gia entrato';
        message = `${participant.name} - ingresso gia registrato`;
        signal = 'STOP';
        tone = 'warning';
      } else if (participant.status === 'valid') {
        status = 'valid';
        title = 'Override supervisore';
        message = `${participant.name} - ${reason}`;
        signal = 'OK';
        tone = 'success';
      }

      const log: AccessLog = {
        id: `a-${Date.now()}`,
        eventId: activeEvent.id,
        participantId: participant.id,
        code: participant.ticketCode,
        status,
        time: formatTime(new Date()),
        gate: activeGate.name,
        method: 'override',
        reason,
      };

      if (status === 'valid') {
        setParticipants((currentParticipants) =>
          currentParticipants.map((item) =>
            item.id === participant.id ? { ...item, status: 'checked-in' } : item
          )
        );

        setAccessLogs((currentLogs) => [log, ...currentLogs]);
      }

      return {
        participant:
          status === 'valid'
            ? { ...participant, status: 'checked-in' as const }
            : participant,
        log,
        title,
        message,
        signal,
        tone,
      };
    }

    function resetDemo() {
      setParticipants(initialParticipants);
      setAccessLogs(initialAccessLogs);
      setActiveGateState(initialGate);
    }

    function scanTicket(ticketCode: string, gate = activeGate.name) {
      const code = ticketCode.trim().toUpperCase();
      const participant = participants.find(
        (item) => item.eventId === activeEvent.id && item.ticketCode.toUpperCase() === code
      );

      let status: AccessStatus = 'invalid';
      let title = 'Respinto';
      let message = 'Codice non valido per questo evento';
      let signal: ScanResult['signal'] = 'NO';
      let tone: ScanTone = 'danger';

      if (participant?.status === 'checked-in') {
        status = 'used';
        title = 'Gia usato';
        message = `${participant.name} - check-in gia registrato`;
        signal = 'STOP';
        tone = 'warning';
      } else if (participant?.status === 'blocked') {
        title = 'Respinto';
        message = `${participant.name} - partecipante bloccato`;
      } else if (participant && participant.allowedGateId !== activeGate.id) {
        title = 'Gate errato';
        message = `${participant.name} deve entrare da ${getGateById(participant.allowedGateId)?.name ?? 'un altro gate'}`;
      } else if (participant?.status === 'valid') {
        status = 'valid';
        title = 'Entra';
        message = `${participant.name} - ${participant.ticketCode}`;
        signal = 'OK';
        tone = 'success';
      }

      const log: AccessLog = {
        id: `a-${Date.now()}`,
        eventId: activeEvent.id,
        participantId: participant?.id,
        code,
        status,
        time: formatTime(new Date()),
        gate,
        method: 'scan',
      };

      if (participant && status === 'valid') {
        setParticipants((currentParticipants) =>
          currentParticipants.map((item) =>
            item.id === participant.id ? { ...item, status: 'checked-in' } : item
          )
        );
      }

      setAccessLogs((currentLogs) => [log, ...currentLogs]);

      return {
        participant:
          participant && status === 'valid'
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
      activeGate,
      events,
      gates,
      participants,
      accessLogs,
      checkInParticipantManually,
      getGateById,
      overrideCheckInParticipant,
      resetDemo,
      scanTicket,
      setActiveGate,
      getAccessLogsByEvent,
      getEventById,
      getEventStats,
      getParticipantById,
      getParticipantsByEvent,
    };
  }, [accessLogs, activeGate, participants]);

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
