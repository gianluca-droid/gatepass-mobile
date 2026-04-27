import { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { ParticipantRow, Section } from '@/components/gatepass/cards';
import { PrimaryButton } from '@/components/gatepass/primary-button';
import { GatePassScreen } from '@/components/gatepass/screen';
import {
  activeEvent,
  participants as initialParticipants,
  type GatePassEvent,
  type Participant,
} from '@/constants/mock-data';
import { GatePassColors } from '@/constants/theme';
import { useGatePassStore } from '@/lib/gatepass-store';

type ManagedParticipant = Participant & {
  qrMock: string;
};

export default function ManageScreen() {
  const { activeGate, gates, resetDemo, setActiveGate } = useGatePassStore();
  const [event, setEvent] = useState<GatePassEvent>(activeEvent);
  const [eventName, setEventName] = useState(activeEvent.name);
  const [eventDate, setEventDate] = useState(activeEvent.date);
  const [eventVenue, setEventVenue] = useState(activeEvent.venue);
  const [participantName, setParticipantName] = useState('Nuovo partecipante');
  const [participantEmail, setParticipantEmail] = useState('guest@example.com');
  const [participants, setParticipants] = useState<ManagedParticipant[]>(
    initialParticipants
      .filter((participant) => participant.eventId === activeEvent.id)
      .map((participant) => ({
        ...participant,
        qrMock: `QR:${participant.ticketCode}`,
      }))
  );

  const latestQr = useMemo(() => participants[0]?.qrMock ?? 'Nessun QR generato', [participants]);

  function saveEvent() {
    setEvent((currentEvent) => ({
      ...currentEvent,
      name: eventName.trim() || currentEvent.name,
      date: eventDate.trim() || currentEvent.date,
      venue: eventVenue.trim() || currentEvent.venue,
    }));
  }

  function addParticipant() {
    const number = participants.length + 1;
    const ticketCode = `GP-MOCK-${String(number).padStart(3, '0')}`;
    const nextParticipant: ManagedParticipant = {
      id: `participant-${Date.now()}`,
      eventId: event.id,
      name: participantName.trim() || 'Partecipante mock',
      email: participantEmail.trim() || 'guest@example.com',
      ticketCode,
      ticketType: 'Standard',
      sector: 'Settore demo',
      allowedGateId: activeGate.id,
      status: 'valid',
      qrMock: `QR:${ticketCode}`,
    };

    setParticipants((currentParticipants) => [nextParticipant, ...currentParticipants]);
    setParticipantName('Nuovo partecipante');
    setParticipantEmail('guest@example.com');
  }

  return (
    <GatePassScreen title="Gestione evento" subtitle="Modifiche mock locali per l'evento attivo.">
      <View style={styles.eventCard}>
        <Text style={styles.eventStatus}>Evento attivo</Text>
        <Text style={styles.eventTitle}>{event.name}</Text>
        <Text style={styles.eventMeta}>
          {event.date} - {event.venue}
        </Text>
      </View>

      <Section title="Modifica evento">
        <View style={styles.panel}>
          <Field label="Nome evento" value={eventName} onChangeText={setEventName} />
          <Field label="Data" value={eventDate} onChangeText={setEventDate} />
          <Field label="Luogo" value={eventVenue} onChangeText={setEventVenue} />
          <PrimaryButton label="Salva modifiche mock" onPress={saveEvent} />
        </View>
      </Section>

      <Section title="Aggiungi partecipante">
        <View style={styles.panel}>
          <Field label="Nome" value={participantName} onChangeText={setParticipantName} />
          <Field label="Email" value={participantEmail} onChangeText={setParticipantEmail} />
          <PrimaryButton label="Aggiungi partecipante mock" variant="neutral" onPress={addParticipant} />
        </View>
      </Section>

      <Section title="Ultimo QR mock">
        <View style={styles.qrBox}>
          <Text style={styles.qrLabel}>Codice generato</Text>
          <Text style={styles.qrCode}>{latestQr}</Text>
        </View>
      </Section>

      <Section title="Gate attivo staff">
        <View style={styles.panel}>
          <Text style={styles.demoText}>
            Gate usato da scanner e check-in manuale in questa sessione demo.
          </Text>
          <View style={styles.gateOptions}>
            {gates.map((gate) => (
              <PrimaryButton
                key={gate.id}
                label={gate.name}
                variant={activeGate.id === gate.id ? 'primary' : 'neutral'}
                onPress={() => setActiveGate(gate.id)}
              />
            ))}
          </View>
        </View>
      </Section>

      <Section title="Strumenti demo">
        <View style={styles.panel}>
          <Text style={styles.demoText}>
            Funzione temporanea solo per test/demo: ripristina partecipanti, check-in e
            storico accessi allo stato mock iniziale.
          </Text>
          <PrimaryButton label="Reset demo" variant="danger" onPress={resetDemo} />
        </View>
      </Section>

      <Section title={`Partecipanti (${participants.length})`}>
        {participants.map((participant) => (
          <ParticipantRow key={participant.id} participant={participant} />
        ))}
      </Section>
    </GatePassScreen>
  );
}

function Field({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={GatePassColors.muted}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  eventCard: {
    backgroundColor: GatePassColors.primaryDark,
    borderRadius: 8,
    gap: 8,
    padding: 18,
  },
  eventStatus: {
    color: '#BAE6FD',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  eventTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 30,
  },
  eventMeta: {
    color: '#DBEAFE',
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 21,
  },
  panel: {
    backgroundColor: GatePassColors.surface,
    borderColor: GatePassColors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
  field: {
    gap: 6,
  },
  fieldLabel: {
    color: GatePassColors.muted,
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: GatePassColors.surfaceSoft,
    borderColor: GatePassColors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: GatePassColors.ink,
    fontSize: 16,
    fontWeight: '700',
    minHeight: 48,
    paddingHorizontal: 12,
  },
  qrBox: {
    backgroundColor: GatePassColors.surface,
    borderColor: GatePassColors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
  qrLabel: {
    color: GatePassColors.muted,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  qrCode: {
    color: GatePassColors.ink,
    fontSize: 20,
    fontWeight: '900',
  },
  demoText: {
    color: GatePassColors.muted,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  gateOptions: {
    gap: 10,
  },
});
