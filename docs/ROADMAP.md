# GatePass Roadmap

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
