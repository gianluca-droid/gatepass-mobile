# GatePass Backend Decision

## Decisione Fase 2A

Per la Fase 2A GatePass usera **Supabase/Postgres** come backend e database
principale.

La Fase 2A deve trasformare l'app da mock/local a sistema reale mantenendo un
perimetro minimo: eventi, gate, partecipanti, ticket, gate consentiti,
assegnazioni staff e storico accessi. La scelta del backend deve quindi
privilegiare coerenza relazionale, audit, controllo accessi e una funzione di
check-in transazionale.

## Perche Supabase/Postgres

Supabase/Postgres e la scelta consigliata perche il modello dati di GatePass e
relazionale per natura:

- un evento ha molti gate, ticket, partecipanti e access log
- un ticket appartiene a un evento e puo essere associato a piu gate consentiti
- lo staff deve vedere solo eventi e gate assegnati
- ogni tentativo di ingresso deve essere salvato in `access_logs`
- il check-in deve evitare doppi ingressi con logica transazionale

Postgres gestisce bene vincoli, join, indici, relazioni molti-a-molti e query di
audit. Supabase aggiunge Auth, Row Level Security, API e una strada naturale
verso realtime e storage in fasi successive.

## Confronto sintetico

### Supabase/Postgres

Punti forti:

- schema relazionale nativo
- vincoli e indici adatti a ticket, gate e access log
- Supabase Auth integrabile con utenti staff/admin
- Row Level Security per limitare visibilita per ruolo, evento e gate
- funzioni RPC/server-side per check-in transazionale
- realtime disponibile in futuro senza cambiare piattaforma

Rischi:

- RLS da progettare con cura
- funzioni SQL/RPC da testare bene
- serve disciplina nel non mettere troppa logica nel client mobile

### Firebase

Punti forti:

- ottimo ecosistema mobile
- Firebase Auth maturo
- realtime e offline molto forti
- sviluppo rapido per dati documentali

Limiti per GatePass Fase 2A:

- Firestore e documentale, non relazionale
- relazioni ticket/gate/evento richiederebbero denormalizzazione
- audit e report su access log possono diventare piu scomodi
- vincoli come gate consentiti e check-in atomico richiedono maggiore attenzione

Firebase resta interessante per funzionalita realtime/offline, ma non e la
scelta piu naturale per il primo schema relazionale di GatePass.

### Backend custom

Punti forti:

- massimo controllo su API, sicurezza, logica e scalabilita
- adatto a requisiti enterprise o integrazioni complesse
- possibilita di usare Postgres con architettura completamente personalizzata

Limiti per GatePass Fase 2A:

- maggiore costo iniziale
- piu DevOps, deploy, monitoraggio e manutenzione
- auth, policy, API e migrazioni da costruire e gestire direttamente
- rischio di rallentare la transizione da mock/local a database reale

Un backend custom potra essere rivalutato in futuro se GatePass superera il
perimetro di un backend-as-a-service.

## Cosa useremo in Fase 2A

In Fase 2A useremo:

- **Postgres** come database relazionale principale
- **Supabase Auth** per login staff/admin
- **Row Level Security** per proteggere accesso ai dati per ruolo, evento e gate
- **RPC/funzione server-side** per il check-in ticket
- **access_logs sempre registrati**, anche per `NO`, `STOP` e `Gate errato`

La funzione di check-in dovra verificare il ticket, controllare evento, stato,
`checked_in_at` e gate consentito, poi registrare sempre il tentativo in
`access_logs`. Se il check-in e valido, dovra aggiornare `tickets.checked_in_at`
in modo transazionale.

## Cosa non useremo subito

Non fanno parte della Fase 2A:

- realtime obbligatorio
- comunicazioni interne
- messaggi vocali
- pagamenti/acquisti ticket
- dashboard admin completa

Questi elementi restano rimandati a fasi successive, dopo avere consolidato
schema dati, auth, RLS e check-in reale.

## Rischi principali

### RLS configurata male

Policy troppo permissive possono esporre dati sensibili. Policy troppo
restrittive possono bloccare staff o admin durante l'evento.

### Doppio check-in

Se la logica non e transazionale, due dispositivi potrebbero validare lo stesso
ticket quasi nello stesso momento.

### Indici mancanti

Senza indici su ticket, evento, gate e access log, gli eventi grandi potrebbero
avere query lente proprio nei momenti di massimo traffico.

### Troppa logica nel client mobile

Il client non deve decidere da solo se un ticket entra. La decisione deve stare
in una funzione server-side controllata e auditabile.

### Offline mode non deciso

La Fase 2A puo partire online-first, ma bisogna decidere presto come gestire
venue con rete instabile, code e dispositivi multipli.

## Decisioni aperte prima di implementare

Prima di scrivere codice o migrazioni, vanno chiuse queste decisioni:

- Supabase project setup
- schema SQL/migrations
- auth staff/admin
- policy RLS
- funzione `check_in_ticket`
- strategia offline

Queste decisioni devono essere prese prima di collegare l'app mobile al backend,
cosi da evitare una transizione fragile dal mock/local al sistema reale.
