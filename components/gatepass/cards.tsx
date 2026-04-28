import { Link, type Href } from 'expo-router';
import { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/gatepass/primary-button';
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

export function ParticipantRow({
  entryLog,
  feedbackLabel,
  participant,
  onManualCheckIn,
  onOverrideCheckIn,
}: {
  entryLog?: AccessLog;
  feedbackLabel?: string;
  participant: Participant;
  onManualCheckIn?: () => void;
  onOverrideCheckIn?: () => void;
}) {
  const { activeGate, getGateById } = useGatePassStore();
  const status = {
    valid: ['Da entrare', styles.badgeSuccess],
    'checked-in': ['Entrato', styles.badgePrimary],
    blocked: ['Bloccato', styles.badgeDanger],
  }[participant.status] as [string, object];
  const allowedGate = getGateById(participant.allowedGateId);
  const isWrongGate = participant.status === 'valid' && participant.allowedGateId !== activeGate.id;
  const entryGate = entryLog ? normalizeGateName(entryLog.gate) : undefined;
  const entryMethod = entryLog?.method ? accessMethodLabel[entryLog.method] : 'Storico accessi';
  const hasGateException = Boolean(entryGate && allowedGate?.name && entryGate !== allowedGate.name);
  const statusMessage = isWrongGate
    ? `Gate errato: ingresso consentito da ${allowedGate?.name ?? 'un altro gate'}.`
    : {
    valid: 'Pronto per ingresso manuale dal gate consentito.',
    'checked-in': 'Ingresso gia registrato. Non puo essere segnato di nuovo.',
    blocked: 'Partecipante bloccato. Non puo entrare.',
  }[participant.status];

  return (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.cardTitle}>{participant.name}</Text>
        <Text style={[styles.badge, status[1]]}>{status[0]}</Text>
      </View>
      <Text style={styles.cardMeta}>{participant.ticketCode}</Text>
      <Text style={styles.cardDetail}>Tipo ticket: {participant.ticketType}</Text>
      <Text style={styles.cardDetail}>Settore: {participant.sector}</Text>
      <Text style={styles.cardDetail}>Gate consentito: {allowedGate?.name ?? 'Gate non trovato'}</Text>
      <Text style={styles.cardDetail}>{participant.email}</Text>
      <Text
        style={[
          styles.participantStatusMessage,
          participant.status === 'blocked' ? styles.participantStatusDanger : undefined,
        ]}>
        {statusMessage}
      </Text>
      {feedbackLabel ? (
        <Text style={styles.participantFeedback}>{feedbackLabel}</Text>
      ) : null}
      {entryLog ? (
        <View style={styles.entryPanel}>
          <View style={styles.entryHeader}>
            <Text style={styles.entryTitle}>Ingresso registrato</Text>
            {entryLog.method === 'override' ? (
              <Text style={[styles.badge, styles.badgeWarning]}>Override</Text>
            ) : null}
          </View>
          <Text style={styles.cardDetail}>Metodo: {entryMethod}</Text>
          <Text style={styles.cardDetail}>Gate usato: {entryLog.gate}</Text>
          <Text style={styles.cardDetail}>Ora ingresso: {entryLog.time}</Text>
          {entryLog.reason ? (
            <Text style={styles.cardDetail}>Motivo override: {entryLog.reason}</Text>
          ) : null}
          {hasGateException ? (
            <Text style={styles.entryWarning}>
              Gate diverso da quello consentito: consentito {allowedGate?.name}, usato {entryGate}.
            </Text>
          ) : null}
        </View>
      ) : null}
      {participant.status === 'valid' && !isWrongGate && onManualCheckIn ? (
        <PrimaryButton
          label="Segna ingresso manuale"
          variant="success"
          onPress={onManualCheckIn}
        />
      ) : null}
      {isWrongGate && onOverrideCheckIn ? (
        <PrimaryButton
          label="Override supervisore"
          variant="neutral"
          onPress={onOverrideCheckIn}
        />
      ) : null}
    </View>
  );
}

const accessMethodLabel = {
  scan: 'Scanner',
  manual: 'Manuale',
  override: 'Override supervisore',
};

function normalizeGateName(gate: AccessLog['gate']) {
  return gate.replace(' - manuale', '');
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
      {log.method === 'override' ? (
        <Text style={styles.cardDetail}>
          Override supervisore - {log.reason ?? 'Autorizzato da supervisore'}
        </Text>
      ) : null}
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
  participantStatusMessage: {
    color: GatePassColors.muted,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  participantStatusDanger: {
    color: GatePassColors.danger,
  },
  participantFeedback: {
    backgroundColor: GatePassColors.successSoft,
    borderRadius: 8,
    color: GatePassColors.success,
    fontSize: 14,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  entryPanel: {
    backgroundColor: GatePassColors.surfaceSoft,
    borderColor: GatePassColors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
    padding: 12,
  },
  entryHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  entryTitle: {
    color: GatePassColors.ink,
    flex: 1,
    fontSize: 14,
    fontWeight: '900',
  },
  entryWarning: {
    backgroundColor: GatePassColors.warningSoft,
    borderRadius: 8,
    color: GatePassColors.warning,
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 18,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 8,
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
