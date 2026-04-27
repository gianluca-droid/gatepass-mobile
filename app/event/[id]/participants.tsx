import { Stack, type Href, useLocalSearchParams, useRouter } from 'expo-router';

import { ParticipantRow, Section } from '@/components/gatepass/cards';
import { PrimaryButton } from '@/components/gatepass/primary-button';
import { GatePassScreen } from '@/components/gatepass/screen';
import { useGatePassStore } from '@/lib/gatepass-store';

export default function ParticipantsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getEventById, getParticipantsByEvent } = useGatePassStore();
  const event = getEventById(id);

  if (!event) {
    return (
      <GatePassScreen title="Evento non trovato" subtitle="Impossibile caricare i partecipanti mock.">
        <PrimaryButton label="Torna agli eventi" onPress={() => router.push('/events' as Href)} />
      </GatePassScreen>
    );
  }

  const eventParticipants = getParticipantsByEvent(event.id);

  return (
    <GatePassScreen title="Partecipanti" subtitle={event.name}>
      <Stack.Screen options={{ title: 'Partecipanti' }} />
      <Section title={`${eventParticipants.length} partecipanti mock`}>
        {eventParticipants.map((participant) => (
          <ParticipantRow key={participant.id} participant={participant} />
        ))}
      </Section>
    </GatePassScreen>
  );
}
