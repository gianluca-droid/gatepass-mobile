import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AccessLogRow, Section, StatCard } from '@/components/gatepass/cards';
import { PrimaryButton } from '@/components/gatepass/primary-button';
import { GatePassScreen } from '@/components/gatepass/screen';
import { accessLogs, activeEvent, getEventStats } from '@/constants/mock-data';
import { GatePassColors } from '@/constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const activeEventStats = getEventStats(activeEvent.id);

  return (
    <GatePassScreen title="Ingresso evento" subtitle="Stato operativo per lo staff al gate.">
      <Pressable
        accessibilityRole="button"
        onPress={() =>
          router.push({
            pathname: '/event/[id]',
            params: { id: activeEvent.id },
          } as unknown as Href)
        }
        style={({ pressed }) => [styles.activeEventCard, pressed ? styles.pressed : undefined]}>
        <View style={styles.activeEventHeader}>
          <Text style={styles.liveBadge}>Live ora</Text>
          <Text style={styles.activeEventTime}>{activeEvent.time}</Text>
        </View>
        <Text style={styles.activeEventTitle}>{activeEvent.name}</Text>
        <Text style={styles.activeEventVenue}>{activeEvent.venue}</Text>
        <View style={styles.activeEventStats}>
          <View>
            <Text style={styles.activeEventNumber}>{activeEventStats.checkedIn}</Text>
            <Text style={styles.activeEventLabel}>entrati</Text>
          </View>
          <View>
            <Text style={styles.activeEventNumber}>{activeEventStats.refused}</Text>
            <Text style={styles.activeEventLabel}>respinti</Text>
          </View>
          <View>
            <Text style={styles.activeEventNumber}>{activeEvent.expectedParticipants}</Text>
            <Text style={styles.activeEventLabel}>attesi</Text>
          </View>
        </View>
      </Pressable>

      <PrimaryButton label="Apri scanner" size="large" onPress={() => router.push('/scanner' as Href)} />

      <View style={styles.quickActions}>
        <PrimaryButton
          label="Vedi partecipanti"
          variant="neutral"
          onPress={() => router.push('/participants' as Href)}
        />
      </View>

      <View style={styles.statsGrid}>
        <StatCard label="Check-in effettuati" value={activeEventStats.checkedIn} tone={GatePassColors.success} emphasis />
        <StatCard label="Accessi respinti" value={activeEventStats.refused} tone={GatePassColors.danger} emphasis />
      </View>

      <Section title="Ultimi accessi">
        {accessLogs.slice(0, 3).map((log) => (
          <AccessLogRow key={log.id} log={log} compact />
        ))}
      </Section>
    </GatePassScreen>
  );
}

const styles = StyleSheet.create({
  activeEventCard: {
    backgroundColor: GatePassColors.primaryDark,
    borderRadius: 8,
    gap: 12,
    padding: 18,
  },
  activeEventHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  liveBadge: {
    backgroundColor: GatePassColors.successSoft,
    borderRadius: 999,
    color: GatePassColors.success,
    fontSize: 12,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
    textTransform: 'uppercase',
  },
  activeEventTime: {
    color: '#DBEAFE',
    fontSize: 15,
    fontWeight: '900',
  },
  activeEventTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 31,
  },
  activeEventVenue: {
    color: '#BFDBFE',
    fontSize: 16,
    fontWeight: '800',
  },
  activeEventStats: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
  },
  activeEventNumber: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
  },
  activeEventLabel: {
    color: '#DBEAFE',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  quickActions: {
    marginTop: -6,
  },
  pressed: {
    opacity: 0.86,
  },
});
