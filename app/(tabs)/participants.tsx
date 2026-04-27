import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ParticipantRow, Section } from '@/components/gatepass/cards';
import { GatePassScreen } from '@/components/gatepass/screen';
import { type ParticipantStatus } from '@/constants/mock-data';
import { GatePassColors } from '@/constants/theme';
import { useGatePassStore } from '@/lib/gatepass-store';

type Filter = 'all' | ParticipantStatus;
type ParticipantFeedback = {
  participantId: string;
  label: string;
} | null;

const filters: { label: string; value: Filter }[] = [
  { label: 'Tutti', value: 'all' },
  { label: 'Da entrare', value: 'valid' },
  { label: 'Entrati', value: 'checked-in' },
  { label: 'Bloccati', value: 'blocked' },
];

export default function ParticipantsTabScreen() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [feedback, setFeedback] = useState<ParticipantFeedback>(null);
  const { activeEvent, checkInParticipantManually, getParticipantsByEvent, overrideCheckInParticipant } =
    useGatePassStore();
  const participants = getParticipantsByEvent(activeEvent.id);

  const visibleParticipants = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return participants.filter((participant) => {
      const matchesFilter = filter === 'all' || participant.status === filter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        participant.name.toLowerCase().includes(normalizedQuery) ||
        participant.email.toLowerCase().includes(normalizedQuery) ||
        participant.ticketCode.toLowerCase().includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
  }, [filter, participants, query]);

  return (
    <GatePassScreen
      title="Partecipanti"
      subtitle={`${activeEvent.name} - consultazione rapida per lo staff.`}>
      <View style={styles.searchPanel}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Cerca nome, email o codice"
          placeholderTextColor={GatePassColors.muted}
          style={styles.searchInput}
        />
        <View style={styles.filters}>
          {filters.map((item) => (
            <Pressable
              key={item.value}
              onPress={() => setFilter(item.value)}
              style={[styles.filterChip, filter === item.value ? styles.filterChipActive : undefined]}>
              <Text
                style={[
                  styles.filterText,
                  filter === item.value ? styles.filterTextActive : undefined,
                ]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Section title={`${visibleParticipants.length} risultati`}>
        {visibleParticipants.map((participant) => (
          <ParticipantRow
            key={participant.id}
            participant={participant}
            feedbackLabel={feedback?.participantId === participant.id ? feedback.label : undefined}
            onManualCheckIn={() => {
              const result = checkInParticipantManually(participant.id);

              if (result?.signal === 'OK') {
                setFeedback({ participantId: participant.id, label: 'Ingresso registrato' });
              }
            }}
            onOverrideCheckIn={() => {
              const result = overrideCheckInParticipant(participant.id);

              if (result?.signal === 'OK') {
                setFeedback({ participantId: participant.id, label: 'Override registrato' });
              }
            }}
          />
        ))}
      </Section>
    </GatePassScreen>
  );
}

const styles = StyleSheet.create({
  searchPanel: {
    backgroundColor: GatePassColors.surface,
    borderColor: GatePassColors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 14,
  },
  searchInput: {
    backgroundColor: GatePassColors.surfaceSoft,
    borderColor: GatePassColors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: GatePassColors.ink,
    fontSize: 16,
    fontWeight: '800',
    minHeight: 50,
    paddingHorizontal: 12,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    backgroundColor: GatePassColors.surfaceSoft,
    borderColor: GatePassColors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterChipActive: {
    backgroundColor: GatePassColors.primary,
    borderColor: GatePassColors.primary,
  },
  filterText: {
    color: GatePassColors.muted,
    fontSize: 13,
    fontWeight: '900',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
});
