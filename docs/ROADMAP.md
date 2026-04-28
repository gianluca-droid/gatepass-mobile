# GatePass Roadmap

## Stato fasi

La **Fase 1 mock/local** e sostanzialmente completata. L'app mobile valida il
flusso operativo staff usando dati locali e mock hardcoded, senza backend,
database, login, ruoli o dashboard admin reale.

Funzioni coperte nella Fase 1:

- Home staff
- scanner mock tramite codici ticket mock
- check-in manuale
- override supervisore
- multi-gate mock hardcoded
- partecipanti con ricerca, filtri e dettagli operativi
- storico accessi
- reset demo
- area Demo/Gestione temporanea per test locali

Prima del passaggio alla Fase 2 resta consigliato solo uno smoke test manuale
end-to-end su Expo Go. Nuove funzioni strutturali, persistenza dati,
autenticazione e configurazioni reali non devono essere aggiunte alla Fase 1.

## Gate e ingressi

I gate attuali presenti nell'app sono solo mock/demo per validare il flusso staff
dell'MVP locale. Non rappresentano una funzione definitiva e non devono essere
considerati una configurazione reale dell'evento. Oggi quantita, nomi e codici
dei gate sono mock hardcoded nell'app mobile.

La sezione Demo/Gestione presente nell'app non e una dashboard admin reale. Serve
solo a simulare scenari locali e a rendere testabile il comportamento dello staff
senza backend, database o configurazioni evento reali.

Nella versione reale, l'organizzatore o admin dovra poter creare, nominare e
configurare liberamente gli ingressi di ogni evento. Il numero di gate dovra
essere variabile per evento e non hardcoded nell'app mobile. Quantita e nomi dei
gate dovranno essere inseriti dal gestore nella futura dashboard admin.

Ogni gate dovra avere almeno:

- nome libero, per esempio `Ingresso Curva Nord`
- codice breve, per esempio `NORD`
- descrizione operativa, per esempio indicazioni o note per lo staff
- stato attivo/non attivo

I ticket e i partecipanti dovranno essere associabili a uno o piu gate
consentiti. Questo permettera casi reali come ticket VIP ammessi da piu ingressi,
staff con varchi dedicati, settori con gate obbligatorio e regole operative
specifiche per grandi venue.

I dati generati dall'acquisto ticket dovranno essere salvati nel database reale.
Ogni ticket dovra essere associato almeno a:

- evento
- settore
- uno o piu gate consentiti

L'app staff dovra leggere questi dati reali dal database nella Fase 2/3, invece
di usare gate, ticket o associazioni hardcoded. In quelle fasi scanner, check-in
manuale, override supervisore e storico accessi dovranno validare i ticket usando
le configurazioni effettive di evento, settore e gate consentiti.

Questa funzione appartiene alla futura dashboard admin e al futuro database. Non
fa parte della fase mock/local attuale, che serve solo a testare il comportamento
di base di scanner, check-in manuale, override supervisore e storico accessi.

## Fase 2 - Bozza modello dati/database reale

La Fase 2 dovra introdurre un modello dati reale per sostituire i mock locali.
L'obiettivo e permettere alla app staff di leggere eventi, gate, ticket,
partecipanti, assegnazioni e storico da un database, mantenendo la dashboard
admin come fonte delle configurazioni evento.

Entita principali previste:

### events

Rappresenta gli eventi gestiti dalla piattaforma.

Campi indicativi:

- id
- nome
- venue
- data e ora
- stato evento
- organizzatore/admin responsabile
- configurazioni operative principali

### gates

Rappresenta gli ingressi configurabili per evento.

Campi indicativi:

- id
- event_id
- nome
- codice breve
- descrizione operativa
- stato attivo/non attivo

### participants

Rappresenta le persone associate a un evento o a un ticket.

Campi indicativi:

- id
- event_id
- nome
- email
- telefono, se necessario
- stato partecipante
- metadati utili allo staff

### tickets

Rappresenta il titolo di accesso generato dall'acquisto o assegnazione.

Campi indicativi:

- id
- event_id
- participant_id
- codice ticket
- tipo ticket
- settore
- stato ticket
- gate consentiti
- dati acquisto o ordine collegato

Per gestire ticket ammessi da piu ingressi, i gate consentiti potranno essere
modellati con una relazione dedicata, per esempio `ticket_allowed_gates`.

### access_logs

Rappresenta ogni tentativo di accesso o verifica ticket.

Campi indicativi:

- id
- event_id
- ticket_id
- participant_id
- gate_id
- staff_user_id
- codice verificato
- stato verifica
- metodo ingresso
- ora
- messaggio operativo
- motivo eventuale

### staff/users

Rappresenta utenti reali con login e ruolo operativo.

Campi indicativi:

- id
- nome
- email
- ruolo
- stato account
- ultimo accesso

Ruoli previsti:

- hostess/steward
- supervisore
- admin evento
- security

### staff assignments

Rappresenta l'assegnazione dello staff a eventi e gate.

Campi indicativi:

- id
- event_id
- staff_user_id
- gate_id
- ruolo operativo nell'evento
- turno o fascia oraria
- stato assegnazione

### override logs

Rappresenta le autorizzazioni speciali o gli ingressi fuori regola.

Campi indicativi:

- id
- event_id
- access_log_id
- ticket_id
- participant_id
- gate_id
- supervisor_user_id
- motivo override
- ora
- esito

Gli override potranno anche restare collegati ad `access_logs`, ma una tabella
dedicata rende piu chiari audit, responsabilita e controlli post-evento.

### future communications

Rappresenta le future comunicazioni operative interne.

Campi indicativi:

- id
- event_id
- gate_id
- author_user_id
- ruolo autore
- ticket_id eventuale
- tipo messaggio
- contenuto testuale o riferimento audio
- motivo operativo eventuale
- ora
- destinatari o ambito visibilita

Questa parte dovra restare futura finche non saranno disponibili login, ruoli,
database, storage audio e notifiche/realtime.

## Comunicazioni operative interne

Le comunicazioni operative interne sono una funzione futura e non fanno parte
della Fase 1 mock/local. Non devono essere implementate come chat fittizia o
flusso locale definitivo finche non saranno disponibili login, ruoli e database.

In futuro, ogni messaggio dovra essere associato automaticamente all'utente
loggato e al suo ruolo operativo, per esempio:

- hostess/steward
- supervisore
- admin evento
- security

La funzione potra includere:

- messaggi testuali tra operatori
- avvisi admin verso uno o piu gate
- segnalazioni operative
- richieste di supporto
- richieste o note per override supervisore
- messaggi vocali rapidi per chi lavora all'ingresso
- storico comunicazioni evento

Ogni messaggio, testuale o vocale, dovra salvare almeno:

- autore
- ruolo
- evento
- gate
- ora
- contenuto o audio
- eventuale ticket collegato
- eventuale motivo operativo

I messaggi vocali rapidi sono utili per lo staff all'ingresso perche gli
operatori possono avere fretta, rumore intorno, code da gestire o mani occupate.
Questa funzione richiedera pero componenti futuri non presenti nella Fase 1:

- permessi microfono
- storage audio
- database
- login/ruoli
- notifiche o realtime
- eventuale trascrizione
