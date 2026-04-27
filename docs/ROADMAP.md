# GatePass Roadmap

## Gate e ingressi

I gate attuali presenti nell'app sono solo mock/demo per validare il flusso staff
dell'MVP locale. Non rappresentano una funzione definitiva e non devono essere
considerati una configurazione reale dell'evento.

Nella versione reale, l'organizzatore o admin dovra poter creare, nominare e
configurare liberamente gli ingressi di ogni evento. Il numero di gate dovra
essere variabile per evento e non hardcoded nell'app mobile.

Ogni gate dovra avere almeno:

- nome libero, per esempio `Ingresso Curva Nord`
- codice breve, per esempio `NORD`
- descrizione operativa, per esempio indicazioni o note per lo staff
- stato attivo/non attivo

I ticket e i partecipanti dovranno essere associabili a uno o piu gate
consentiti. Questo permettera casi reali come ticket VIP ammessi da piu ingressi,
staff con varchi dedicati, settori con gate obbligatorio e regole operative
specifiche per grandi venue.

Questa funzione appartiene alla futura dashboard admin e al futuro database. Non
fa parte della fase mock/local attuale, che serve solo a testare il comportamento
di base di scanner, check-in manuale, override supervisore e storico accessi.
