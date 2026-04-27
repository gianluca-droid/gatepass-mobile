import { StyleSheet, Text, View } from 'react-native';

import { Section } from '@/components/gatepass/cards';
import { PrimaryButton } from '@/components/gatepass/primary-button';
import { GatePassScreen } from '@/components/gatepass/screen';
import { GatePassColors } from '@/constants/theme';
import { useGatePassStore } from '@/lib/gatepass-store';

export default function ManageScreen() {
  const { activeGate, gates, resetDemo, setActiveGate } = useGatePassStore();

  return (
    <GatePassScreen title="Demo" subtitle="Strumenti temporanei per sviluppo e test mock.">
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
            Funzione temporanea solo per test/demo: ripristina lo stato mock iniziale
            dell'app.
          </Text>
          <PrimaryButton label="Reset demo" variant="danger" onPress={resetDemo} />
        </View>
      </Section>
    </GatePassScreen>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: GatePassColors.surface,
    borderColor: GatePassColors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 16,
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
