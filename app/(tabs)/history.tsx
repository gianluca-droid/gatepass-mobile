import { AccessLogRow, Section } from '@/components/gatepass/cards';
import { GatePassScreen } from '@/components/gatepass/screen';
import { accessLogs } from '@/constants/mock-data';

export default function HistoryScreen() {
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
