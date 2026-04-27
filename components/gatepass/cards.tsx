import { Link, type Href } from 'expo-router';
import { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { AccessLog, GatePassEvent, Participant } from '@/constants/mock-data';
import { GatePassColors } from '@/constants/theme';
import { useGatePassStore } from '@/lib/gatepass-store';

export function Section({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export function StatCard({
  label,
  value,
  tone,
  emphasis = false,
}: {
  label: string;
  value: string | number;
  tone?: string;
  emphasis?: boolean;
}) {
  return (
    <View style={[styles.statCard, emphasis ? styles.statCardEmphasis : undefined]}>
      <Text
        style={[
          styles.statValue,
          emphasis ? styles.statValueEmphasis : undefined,
          tone ? { color: tone } : undefined,
        ]}>
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export function EventCard({ event }: { event: GatePassEvent }) {
  const statusLabel = {
    active: 'Attivo',
    scheduled: 'Programmato',
    closed: 'Chiuso',
  }[event.status];

  return (
    <Link href={{ pathname: '/event/[id]', params: { id: event.id } } as unknown as Href} asChild>
      <Pressable style={({ pressed }) => [styles.card, pressed ? styles.pressed : undefined]}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle}>{event.name}</Text>
          <Text
            style={[
              styles.badge,
              event.status === 'active' ? styles.badgeSuccess : styles.badgeNeutral,
            ]}>
            {statusLabel}
          </Text>
        </View>
        <Text style={styles.cardMeta}>{event.venue}</Text>
        <View style={styles.rowBetween}>
          <Text style={styles.cardDetail}>
            {event.date} alle {event.time}
          </Text>
          <Text style={styles.cardDetail}>{event.expectedParticipants} invitati</Text>
        </View>
      </Pressable>
    </Link>
  );
}

export function ParticipantRow({ participant }: { participant: Participant }) {
  const status = {
    valid: ['Valido', styles.badgeSuccess],
    'checked-in': ['Entrato', styles.badgePrimary],
    blocked: ['Bloccato', styles.badgeDanger],
  }[participant.status] as [string, object];

  return (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.cardTitle}>{participant.name}</Text>
        <Text style={[styles.badge, status[1]]}>{status[0]}</Text>
      </View>
      <Text style={styles.cardMeta}>{participant.email}</Text>
      <Text style={styles.cardDetail}>{participant.ticketCode}</Text>
    </View>
  );
}

export function AccessLogRow({ log, compact = false }: { log: AccessLog; compact?: boolean }) {
  const { getEventById, getParticipantById } = useGatePassStore();
  const event = getEventById(log.eventId);
  const participant = getParticipantById(log.participantId);
  const status = {
    valid: ['Valido', styles.badgeSuccess],
    used: ['Gia usato', styles.badgeWarning],
    invalid: ['Respinto', styles.badgeDanger],
  }[log.status] as [string, object];

  return (
    <View style={[styles.card, compact ? styles.logCardCompact : undefined]}>
      <View style={styles.rowBetween}>
        <View style={styles.logIdentity}>
          <Text style={styles.cardTitle}>{participant?.name ?? 'Codice sconosciuto'}</Text>
          <Text style={styles.cardDetail}>
            {log.time} - {log.gate}
          </Text>
        </View>
        <Text style={[styles.badge, status[1]]}>{status[0]}</Text>
      </View>
      <Text style={styles.cardMeta}>{event?.name ?? 'Evento non trovato'}</Text>
      <Text style={styles.cardDetail}>{log.code}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 10,
  },
  sectionTitle: {
    color: GatePassColors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  statCard: {
    width: '48%',
    minHeight: 118,
    borderRadius: 8,
    backgroundColor: GatePassColors.surface,
    borderColor: GatePassColors.border,
    borderWidth: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  statCardEmphasis: {
    borderColor: '#BFDBFE',
  },
  statValue: {
    color: GatePassColors.ink,
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 39,
  },
  statValueEmphasis: {
    fontSize: 38,
    lineHeight: 43,
  },
  statLabel: {
    color: GatePassColors.muted,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  card: {
    borderRadius: 8,
    backgroundColor: GatePassColors.surface,
    borderColor: GatePassColors.border,
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
  cardTitle: {
    color: GatePassColors.ink,
    flex: 1,
    fontSize: 16,
    fontWeight: '900',
    paddingRight: 10,
  },
  cardMeta: {
    color: GatePassColors.muted,
    fontSize: 15,
    fontWeight: '700',
  },
  cardDetail: {
    color: GatePassColors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  rowBetween: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  badge: {
    borderRadius: 999,
    fontSize: 12,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeSuccess: {
    backgroundColor: GatePassColors.successSoft,
    color: GatePassColors.success,
  },
  badgePrimary: {
    backgroundColor: '#D1E9FF',
    color: GatePassColors.primary,
  },
  badgeWarning: {
    backgroundColor: GatePassColors.warningSoft,
    color: GatePassColors.warning,
  },
  badgeDanger: {
    backgroundColor: GatePassColors.dangerSoft,
    color: GatePassColors.danger,
  },
  badgeNeutral: {
    backgroundColor: GatePassColors.surfaceSoft,
    color: GatePassColors.muted,
  },
  logCardCompact: {
    gap: 6,
    paddingVertical: 14,
  },
  logIdentity: {
    flex: 1,
    gap: 3,
  },
  pressed: {
    opacity: 0.78,
  },
});
