import { EventCard, Section } from '@/components/gatepass/cards';
import { GatePassScreen } from '@/components/gatepass/screen';
import { events } from '@/constants/mock-data';

export default function EventsScreen() {
  return (
    <GatePassScreen title="Eventi" subtitle="Seleziona un evento per gestire ingressi e partecipanti.">
      <Section title="Tutti gli eventi">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </Section>
    </GatePassScreen>
  );
}
