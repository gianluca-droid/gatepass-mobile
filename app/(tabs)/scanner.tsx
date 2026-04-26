import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/gatepass/primary-button';
import { GatePassScreen } from '@/components/gatepass/screen';
import { activeEvent } from '@/constants/mock-data';
import { GatePassColors } from '@/constants/theme';

type ScanResult = {
  title: string;
  message: string;
  tone: 'success' | 'warning' | 'danger';
  signal: string;
};

const results: Record<string, ScanResult> = {
  valid: {
    title: 'Entra',
    message: 'Marco Leone - GP-SUM-002',
    tone: 'success',
    signal: 'OK',
  },
  used: {
    title: 'Gia usato',
    message: 'Giulia Conti - check-in gia registrato alle 18:12',
    tone: 'warning',
    signal: 'STOP',
  },
  invalid: {
    title: 'Respinto',
    message: 'Codice non valido per questo evento',
    tone: 'danger',
    signal: 'NO',
  },
};

export default function ScannerScreen() {
  const [result, setResult] = useState<ScanResult | null>(null);

  return (
    <GatePassScreen title="Scanner" subtitle={`Evento assegnato: ${activeEvent.name}.`}>
      <View style={styles.scannerBox}>
        <View style={styles.scanFrame}>
          <Text style={styles.scanText}>QR</Text>
        </View>
        <Text style={styles.scannerHint}>Ingresso A - pronto alla scansione</Text>
      </View>

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

      <View style={styles.actions}>
        <PrimaryButton label="Simula QR valido" variant="success" onPress={() => setResult(results.valid)} />
        <PrimaryButton label="Simula QR gia usato" variant="warning" onPress={() => setResult(results.used)} />
        <PrimaryButton label="Simula QR non valido" variant="danger" onPress={() => setResult(results.invalid)} />
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
    width: '68%',
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
    borderWidth: 2,
    gap: 8,
    justifyContent: 'center',
    minHeight: 190,
    padding: 22,
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
    fontSize: 50,
    fontWeight: '900',
    lineHeight: 56,
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
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
  },
  resultMessage: {
    color: GatePassColors.ink,
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 24,
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
  actions: {
    gap: 12,
  },
});
