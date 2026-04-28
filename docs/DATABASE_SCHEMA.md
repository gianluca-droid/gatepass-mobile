# GatePass Database Schema

## Fase 2A - Database reale minimo

Questo documento definisce il primo schema database minimo per trasformare
GatePass da app mock/local a sistema reale. La Fase 2A deve sostituire i dati
hardcoded con dati persistenti per eventi, gate, partecipanti, ticket,
assegnazioni staff e storico accessi.

La Fase 2A non include ancora:

- orders/payments/acquisto ticket
- override_logs dedicati
- communications
- messaggi vocali
- dashboard admin completa
- realtime/notifiche avanzate

Nota importante sui ticket: `tickets.status` non deve essere usato per indicare
che un ticket e gia entrato. Lo stato del ticket indica solo condizioni come
`valid`, `blocked`, `cancelled` o `refunded`. Per sapere se un ticket e gia stato
usato si usa `tickets.checked_in_at`.

## Tabelle

## events

### Scopo

Rappresenta gli eventi gestiti da GatePass.

### Campi principali

- `id`
- `name`
- `venue`
- `starts_at`
- `ends_at`
- `status` (`draft`, `active`, `closed`)
- `created_at`
- `updated_at`

### Relazioni

- un evento ha molti `gates`
- un evento ha molti `participants`
- un evento ha molti `tickets`
- un evento ha molti `access_logs`
- un evento ha molti `staff_assignments`

### Vincoli importanti

- `name` obbligatorio
- `starts_at` obbligatorio
- `status` deve essere uno dei valori previsti
- `ends_at`, se presente, deve essere successivo a `starts_at`

### Indici consigliati

- indice su `status`
- indice su `starts_at`

## gates

### Scopo

Rappresenta gli ingressi configurabili di un evento.

### Campi principali

- `id`
- `event_id`
- `name`
- `code`
- `description`
- `is_active`
- `created_at`
- `updated_at`

### Relazioni

- ogni gate appartiene a un `event`
- un gate puo essere collegato a molti ticket tramite `ticket_allowed_gates`
- un gate puo avere molti `access_logs`
- un gate puo avere molte assegnazioni staff tramite `staff_assignments`

### Vincoli importanti

- `event_id` obbligatorio
- `name` obbligatorio
- `code` obbligatorio
- `code` univoco all'interno dello stesso evento
- un gate non dovrebbe essere cancellato se esistono access log collegati

### Indici consigliati

- indice su `event_id`
- indice composto unico su `event_id`, `code`
- indice su `is_active`

## participants

### Scopo

Rappresenta le persone associate a un evento.

### Campi principali

- `id`
- `event_id`
- `first_name`
- `last_name`
- `email`
- `phone`
- `notes`
- `created_at`
- `updated_at`

### Relazioni

- ogni partecipante appartiene a un `event`
- un partecipante puo avere uno o piu `tickets`
- un partecipante puo comparire in molti `access_logs`

### Vincoli importanti

- `event_id` obbligatorio
- almeno uno tra nome, cognome o email dovrebbe essere presente
- l'email non deve essere necessariamente unica globalmente, per permettere piu
  eventi o piu ticket collegati alla stessa persona

### Indici consigliati

- indice su `event_id`
- indice su `email`
- indice su `last_name`

## tickets

### Scopo

Rappresenta il titolo di accesso verificato dallo staff.

### Campi principali

- `id`
- `event_id`
- `participant_id`
- `ticket_code`
- `ticket_type`
- `sector`
- `status` (`valid`, `blocked`, `cancelled`, `refunded`)
- `checked_in_at`
- `created_at`
- `updated_at`

### Relazioni

- ogni ticket appartiene a un `event`
- ogni ticket puo appartenere a un `participant`
- ogni ticket puo avere uno o piu gate consentiti tramite
  `ticket_allowed_gates`
- ogni ticket puo comparire in molti `access_logs`

### Vincoli importanti

- `event_id` obbligatorio
- `ticket_code` obbligatorio e univoco
- `status` deve essere uno dei valori previsti
- `checked_in_at` indica se il ticket e gia entrato
- `tickets.status` non deve mai diventare `checked_in`
- `participant_id`, se presente, deve appartenere allo stesso evento del ticket

### Indici consigliati

- indice unico su `ticket_code`
- indice su `event_id`
- indice su `participant_id`
- indice su `status`
- indice su `checked_in_at`

## ticket_allowed_gates

### Scopo

Rappresenta quali gate sono consentiti per ogni ticket.

### Campi principali

- `id`
- `ticket_id`
- `gate_id`
- `created_at`

### Relazioni

- ogni riga collega un `ticket` a un `gate`
- un ticket puo avere piu gate consentiti
- un gate puo essere consentito per molti ticket

### Vincoli importanti

- `ticket_id` obbligatorio
- `gate_id` obbligatorio
- la coppia `ticket_id`, `gate_id` deve essere unica
- ticket e gate devono appartenere allo stesso evento

### Indici consigliati

- indice composto unico su `ticket_id`, `gate_id`
- indice su `ticket_id`
- indice su `gate_id`

## access_logs

### Scopo

Registra ogni tentativo di verifica o ingresso, sia riuscito sia respinto.

### Campi principali

- `id`
- `event_id`
- `ticket_id`
- `participant_id`
- `gate_id`
- `staff_user_id`
- `ticket_code_checked`
- `status` (`ok`, `stop`, `no`, `wrong_gate`)
- `method` (`scanner`, `manual`, `override`)
- `message`
- `reason`
- `created_at`

### Relazioni

- ogni log appartiene a un `event`
- ogni log puo essere collegato a un `ticket`
- ogni log puo essere collegato a un `participant`
- ogni log puo essere collegato a un `gate`
- ogni log puo essere collegato a uno `user` dello staff

### Vincoli importanti

- `event_id` obbligatorio
- `ticket_code_checked` obbligatorio
- `status` deve essere uno dei valori previsti
- `method` deve essere uno dei valori previsti
- anche i tentativi non validi devono essere registrati
- `ticket_id`, `participant_id`, `gate_id` e `staff_user_id` possono essere null
  quando il dato non e disponibile o il codice e sconosciuto

### Indici consigliati

- indice su `event_id`
- indice su `ticket_id`
- indice su `participant_id`
- indice su `gate_id`
- indice su `staff_user_id`
- indice su `created_at`
- indice composto su `event_id`, `created_at`

## users

### Scopo

Rappresenta gli utenti reali che possono accedere al sistema.

### Campi principali

- `id`
- `name`
- `email`
- `role` (`steward`, `supervisor`, `event_admin`, `security`)
- `status` (`active`, `disabled`)
- `created_at`
- `updated_at`

### Relazioni

- un utente puo avere molte `staff_assignments`
- un utente puo essere autore di molti `access_logs`

### Vincoli importanti

- `email` obbligatoria e univoca
- `role` deve essere uno dei valori previsti
- `status` deve essere uno dei valori previsti
- solo utenti attivi possono operare nell'app staff

### Indici consigliati

- indice unico su `email`
- indice su `role`
- indice su `status`

## staff_assignments

### Scopo

Rappresenta l'assegnazione dello staff a eventi e gate.

### Campi principali

- `id`
- `event_id`
- `user_id`
- `gate_id`
- `role`
- `shift_starts_at`
- `shift_ends_at`
- `status` (`active`, `inactive`)
- `created_at`
- `updated_at`

### Relazioni

- ogni assegnazione appartiene a un `event`
- ogni assegnazione appartiene a uno `user`
- ogni assegnazione puo essere collegata a un `gate`

### Vincoli importanti

- `event_id` obbligatorio
- `user_id` obbligatorio
- `role` obbligatorio
- `gate_id` puo essere null per ruoli evento non legati a un singolo ingresso
- `shift_ends_at`, se presente, deve essere successivo a `shift_starts_at`
- `gate_id`, se presente, deve appartenere allo stesso evento

### Indici consigliati

- indice su `event_id`
- indice su `user_id`
- indice su `gate_id`
- indice su `status`
- indice composto su `event_id`, `user_id`

## Flusso di validazione check-in

Il check-in deve essere gestito da una funzione/API transazionale, in modo da
evitare doppi ingressi quando due dispositivi verificano lo stesso ticket quasi
nello stesso momento.

Passi di validazione:

1. Ricevere da app staff `event_id`, `gate_id`, `staff_user_id`,
   `ticket_code_checked` e `method`.
2. Cercare il ticket tramite `ticket_code`.
3. Verificare che il ticket esista.
4. Verificare che il ticket appartenga all'evento richiesto.
5. Verificare che `tickets.status` non sia `blocked`, `cancelled` o `refunded`.
6. Verificare che `tickets.checked_in_at` sia vuoto.
7. Verificare che il gate usato sia tra quelli consentiti in
   `ticket_allowed_gates`.
8. Se tutto e OK:
   - registrare un `access_log` con `status = ok`
   - aggiornare `tickets.checked_in_at`
9. Se il ticket e gia entrato:
   - registrare un `access_log` con `status = stop`
   - non modificare `tickets.checked_in_at`
10. Se il ticket non esiste, non appartiene all'evento, e bloccato, cancellato o
    rimborsato:
    - registrare un `access_log` con `status = no`
    - non modificare `tickets.checked_in_at`
11. Se il gate e errato:
    - registrare un `access_log` con `status = wrong_gate`
    - non modificare `tickets.checked_in_at`

In tutti i casi, anche per `NO`, `STOP` e `Gate errato`, il tentativo deve essere
salvato in `access_logs` per audit, supporto operativo e storico evento.

## Rimandato a fasi future

Questi moduli non fanno parte della Fase 2A:

- `orders`, `payments` e flussi di acquisto ticket
- tabella dedicata `override_logs`
- comunicazioni operative interne
- messaggi vocali e storage audio
- dashboard admin completa
- realtime, notifiche push e monitoraggio live avanzato

In Fase 2A eventuali override possono essere tracciati in modo minimo dentro
`access_logs` tramite `method = override` e `reason`, rimandando la tabella
dedicata alla fase successiva.
