import { AccessLogRow, Section } from '@/components/gatepass/cards';
import { GatePassScreen } from '@/components/gatepass/screen';
import { useGatePassStore } from '@/lib/gatepass-store';

export default function HistoryScreen() {
  const { accessLogs } = useGatePassStore();

  return (
    <GatePassScreen title="Storico accessi" subtitle="Monitoraggio rapido degli ultimi tentativi di ingresso.">
      <Section title="Accessi registrati">
        {accessLogs.map((log) => (
          <AccessLogRow key={log.id} log={log} />
        ))}
      </Section>
    </GatePassScreen>
  );
}
