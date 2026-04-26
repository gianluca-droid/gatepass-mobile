import { Stack, type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AccessLogRow, Section, StatCard } from '@/components/gatepass/cards';
import { PrimaryButton } from '@/components/gatepass/primary-button';
import { GatePassScreen } from '@/components/gatepass/screen';
import {
  getAccessLogsByEvent,
  getEventById,
  getEventStats,
  type GatePassEvent,
} from '@/constants/mock-data';
import { GatePassColors } from '@/constants/theme';

export default function EventDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const event = getEventById(id);

  if (!event) {
    return (
      <GatePassScreen title="Evento non trovato" subtitle="Il codice evento non esiste nei dati mock.">
        <PrimaryButton label="Torna agli eventi" onPress={() => router.push('/events' as Href)} />
      </GatePassScreen>
    );
  }

  const stats = getEventStats(event.id);
  const logs = getAccessLogsByEvent(event.id);

  return (
    <GatePassScreen title={event.name} subtitle={`${event.venue} - ${event.date} - ${event.time}`}>
      <Stack.Screen options={{ title: event.name }} />
      <EventSummary event={event} />

      <View style={styles.statsGrid}>
        <StatCard label="Partecipanti mock" value={stats.total} />
        <StatCard label="Check-in" value={stats.checkedIn} tone={GatePassColors.success} />
        <StatCard label="Respinti" value={stats.refused} tone={GatePassColors.danger} />
        <StatCard label="Invitati attesi" value={event.expectedParticipants} tone={GatePassColors.primary} />
      </View>

      <View style={styles.actions}>
        <PrimaryButton label="Apri scanner" onPress={() => router.push('/scanner' as Href)} />
        <PrimaryButton
          label="Partecipanti"
          variant="neutral"
          onPress={() =>
            router.push({
              pathname: '/event/[id]/participants',
              params: { id: event.id },
            } as unknown as Href)
          }
        />
      </View>

      <Section title="Ultimi accessi evento">
        {logs.map((log) => (
          <AccessLogRow key={log.id} log={log} />
        ))}
      </Section>
    </GatePassScreen>
  );
}

function EventSummary({ event }: { event: GatePassEvent }) {
  const status = {
    active: 'Evento attivo',
    scheduled: 'Programmato',
    closed: 'Chiuso',
  }[event.status];

  return (
    <View style={styles.summary}>
      <Text style={styles.summaryLabel}>{status}</Text>
      <Text style={styles.summaryTitle}>{event.venue}</Text>
      <Text style={styles.summaryMeta}>{event.date} alle {event.time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: {
    backgroundColor: GatePassColors.primaryDark,
    borderRadius: 8,
    gap: 8,
    padding: 18,
  },
  summaryLabel: {
    color: '#BAE6FD',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  summaryTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  summaryMeta: {
    color: '#DBEAFE',
    fontSize: 15,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  actions: {
    gap: 12,
  },
});
