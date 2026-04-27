import { type Href, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/gatepass/primary-button';
import { GatePassScreen } from '@/components/gatepass/screen';
import { GatePassColors } from '@/constants/theme';
import { type ScanResult, useGatePassStore } from '@/lib/gatepass-store';

export default function ScannerScreen() {
  const router = useRouter();
  const { activeEvent, activeGate, scanTicket } = useGatePassStore();
  const [result, setResult] = useState<ScanResult | null>(null);

  return (
    <GatePassScreen title="Scanner" subtitle={`Evento assegnato: ${activeEvent.name}.`}>
      {result ? (
        <View style={[styles.result, styles[result.tone]]}>
          <Text style={[styles.signal, styles[`${result.tone}Text`]]}>{result.signal}</Text>
          <Text style={styles.resultTitle}>{result.title}</Text>
          <Text style={styles.resultMessage}>{result.message}</Text>
        </View>
      ) : (
        <View style={styles.emptyResult}>
          <Text style={styles.emptyText}>In attesa di scansione</Text>
        </View>
      )}

      {result ? (
        <View style={styles.quickActions}>
          <PrimaryButton label="Scansiona prossimo" size="large" onPress={() => setResult(null)} />
          <PrimaryButton
            label={result.tone === 'danger' ? 'Controlla lista' : 'Vedi partecipante'}
            variant="neutral"
            onPress={() => router.push('/participants' as Href)}
          />
        </View>
      ) : null}

      <View style={styles.scannerBox}>
        <View style={styles.scanFrame}>
          <Text style={styles.scanText}>QR</Text>
        </View>
        <Text style={styles.scannerHint}>{activeGate.name} - pronto alla scansione</Text>
      </View>

      <View style={styles.actions}>
        <PrimaryButton
          label="Simula QR valido"
          variant="success"
          onPress={() => setResult(scanTicket('GP-SUM-002'))}
        />
        <PrimaryButton
          label="Simula QR gia usato"
          variant="warning"
          onPress={() => setResult(scanTicket('GP-SUM-001'))}
        />
        <PrimaryButton
          label="Simula QR bloccato"
          variant="danger"
          onPress={() => setResult(scanTicket('GP-SUM-003'))}
        />
        <PrimaryButton
          label="Simula QR non valido"
          variant="danger"
          onPress={() => setResult(scanTicket('GP-FAKE-404'))}
        />
      </View>
    </GatePassScreen>
  );
}

const styles = StyleSheet.create({
  scannerBox: {
    alignItems: 'center',
    backgroundColor: GatePassColors.ink,
    borderRadius: 8,
    gap: 16,
    padding: 24,
  },
  scanFrame: {
    alignItems: 'center',
    aspectRatio: 1,
    borderColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 3,
    justifyContent: 'center',
    width: '58%',
  },
  scanText: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: 0,
  },
  scannerHint: {
    color: '#CBD5E1',
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },
  result: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 3,
    gap: 8,
    justifyContent: 'center',
    minHeight: 230,
    padding: 24,
  },
  success: {
    backgroundColor: GatePassColors.successSoft,
    borderColor: GatePassColors.success,
  },
  warning: {
    backgroundColor: GatePassColors.warningSoft,
    borderColor: GatePassColors.warning,
  },
  danger: {
    backgroundColor: GatePassColors.dangerSoft,
    borderColor: GatePassColors.danger,
  },
  signal: {
    fontSize: 64,
    fontWeight: '900',
    lineHeight: 70,
    textAlign: 'center',
  },
  successText: {
    color: GatePassColors.success,
  },
  warningText: {
    color: GatePassColors.warning,
  },
  dangerText: {
    color: GatePassColors.danger,
  },
  resultTitle: {
    color: GatePassColors.ink,
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
  },
  resultMessage: {
    color: GatePassColors.ink,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 25,
    textAlign: 'center',
  },
  emptyResult: {
    alignItems: 'center',
    backgroundColor: GatePassColors.surface,
    borderColor: GatePassColors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: 20,
  },
  emptyText: {
    color: GatePassColors.muted,
    fontSize: 16,
    fontWeight: '800',
  },
  quickActions: {
    gap: 10,
  },
  actions: {
    gap: 12,
  },
});
