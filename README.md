# GatePass Mobile

GatePass Mobile e un'app mobile mock/local per lo staff all'ingresso degli
eventi. Serve a validare il flusso operativo dell'MVP senza backend, database o
configurazioni evento reali.

## Stato attuale

Il progetto si trova in **Fase 1 mock/local**.

In questa fase i dati sono dimostrativi e hardcoded nell'app. L'obiettivo e
testare il comportamento base dello staff: controllo ingressi, gestione
partecipanti, verifica gate, override supervisore e storico accessi.

## Funzioni implementate

- Home staff
- Scanner mock
- Check-in manuale
- Override supervisore
- Multi-gate mock
- Partecipanti
- Storico accessi
- Reset demo

## Non ancora implementato

Queste funzioni non fanno parte della Fase 1 mock/local:

- database
- login/ruoli
- dashboard admin reale
- acquisto ticket
- QR/camera reale
- gate dinamici configurabili dal gestore

## Comandi Windows

Avvio progetto:

```powershell
npm.cmd start
```

Lint:

```powershell
npm.cmd run lint
```

Avvio Expo su LAN con cache pulita:

```powershell
npx.cmd expo start --lan --clear
```

Su PowerShell, usare `npm.cmd` e `npx.cmd` se `npm.ps1` o `npx.ps1` sono
bloccati dalla execution policy del sistema.

## Roadmap

La roadmap funzionale e tecnica si trova in [docs/ROADMAP.md](docs/ROADMAP.md).
