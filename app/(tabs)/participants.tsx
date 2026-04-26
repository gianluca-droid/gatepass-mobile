import { ParticipantRow, Section } from '@/components/gatepass/cards';
import { GatePassScreen } from '@/components/gatepass/screen';
import { activeEvent, getParticipantsByEvent } from '@/constants/mock-data';

export default function ParticipantsTabScreen() {
  const participants = getParticipantsByEvent(activeEvent.id);

  return (
    <GatePassScreen
      title="Partecipanti"
      subtitle={`${activeEvent.name} · consultazione rapida per lo staff.`}>
      <Section title={`${participants.length} partecipanti evento`}>
        {participants.map((participant) => (
          <ParticipantRow key={participant.id} participant={participant} />
        ))}
      </Section>
    </GatePassScreen>
  );
}
