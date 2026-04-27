import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AccessLogRow, Section } from '@/components/gatepass/cards';
import { PrimaryButton } from '@/components/gatepass/primary-button';
import { GatePassScreen } from '@/components/gatepass/screen';
import { GatePassColors } from '@/constants/theme';
import { useGatePassStore } from '@/lib/gatepass-store';

export default function HomeScreen() {
  const router = useRouter();
  const { accessLogs, activeEvent, getEventStats } = useGatePassStore();
  const activeEventStats = getEventStats(activeEvent.id);

  return (
    <GatePassScreen title="Gate mode" subtitle="Postazione ingresso pronta.">
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
          <Text style={styles.liveBadge}>Assegnato</Text>
          <Text style={styles.activeEventTime}>{activeEvent.time}</Text>
        </View>
        <Text style={styles.activeEventTitle}>{activeEvent.name}</Text>
        <Text style={styles.activeEventVenue}>{activeEvent.venue}</Text>
        <View style={styles.gateStatus}>
          <Text style={styles.gateName}>Ingresso A</Text>
          <Text style={styles.readyBadge}>Pronto</Text>
        </View>
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
  gateStatus: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  gateName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  readyBadge: {
    backgroundColor: GatePassColors.successSoft,
    borderRadius: 999,
    color: GatePassColors.success,
    fontSize: 13,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 6,
    textTransform: 'uppercase',
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
  quickActions: {
    marginTop: -6,
  },
  pressed: {
    opacity: 0.86,
  },
});
