# Dev / IT Toolkit

Una pagina statica con link a tool raggruppati per problema (DNS, hosting, SSL, performance, email, Shopify, terminale…), pensata per accorciare la prima valutazione di un problema. Look da terminale, ricerca, password facoltativa.

**I contenuti sono solo file Markdown.** Aggiungi o modifichi un `.md` in `content/`, fai commit su `main`, e GitHub Actions ricostruisce e ripubblica il sito su GitHub Pages. Nessun database, nessun CMS.

```
content/            una categoria = un file .md (15 già pronte)
  _FORMATO.md       promemoria del formato (ignorato dal sito)
src/                Astro: parser dei .md, pagina, componenti, stile
.github/workflows/
  deploy.yml        build + pubblicazione su Pages a ogni push su main
  check.yml         solo validazione, sulle pull request
.env.example        variabili per lo sviluppo locale
```

---

## Aggiungere o modificare un tool

Apri `content/<categoria>.md` (da GitHub puoi farlo dal browser: il pulsante **edit** accanto a ogni categoria sul sito porta direttamente al file) e aggiungi una riga:

```md
- [Nome](https://indirizzo): descrizione breve
- [dig](https://ss64.com/mac/dig.html) `dig A example.com`: con un comando da terminale
```

Commit su `main` → in uno-due minuti il sito è aggiornato.

## Aggiungere una categoria

Crea un nuovo file in `content/`, per esempio `content/backup.md`:

```md
---
title: "Backup & Recovery"
when: "restore needed, backup failing"
order: 16
---

- [Restic](https://restic.net): Backup incrementali cifrati.
```

Il nome del file diventa l'ancora (`#backup`). Non serve registrarlo da nessuna parte.

## Formato

**Frontmatter** (tra i `---` in cima):

| Campo | Obbligatorio | Significato |
|---|---|---|
| `title` | sì | nome mostrato |
| `when` | no | suggerimento "quando usarla" |
| `order` | no | posizione (1 = prima); senza, in fondo |

**Corpo**: una riga = un tool, nel formato `- [Nome](https://url) \`comando\`: descrizione`.

- Il link deve iniziare con `http://` o `https://`.
- Prima della descrizione vanno i due punti (vale anche `—` o `–`).
- Il `comando` tra backtick è facoltativo: se c'è, la card lo mostra al posto dell'host.
- Righe vuote e commenti `<!-- su una riga -->` sono ignorati.
- I file che iniziano con `_` sono ignorati.

### Errori

Una riga sbagliata **non viene saltata in silenzio**: la build fallisce con file e riga, per esempio

```
content/dns.md:10: riga non valida: «- Mancano link e due punti». Formato atteso: - [Nome](https://indirizzo): descrizione
```

Su GitHub Actions l'errore compare anche come annotazione sul file. Falliscono: riga non valida, indirizzo non http(s), indirizzo duplicato nella stessa categoria, categoria senza tool, `title` mancante. **Se la build fallisce il sito precedente resta online**, quindi un errore di battitura non lo rompe.

---

## Sviluppo in locale

Serve Node 22+.

```sh
npm install
npm run dev        # http://localhost:4321, si aggiorna salvando i .md
npm run build      # build completa in dist/ (stessa validazione del deploy)
npm run preview    # serve dist/
```

Per provare gate e link "edit": `cp .env.example .env` e compila le variabili.

---

## Pubblicare su GitHub Pages

1. Crea un repository su GitHub e fai push di questo progetto sul ramo `main`.
2. **Settings → Pages → Source: GitHub Actions**.
3. Facoltativo, password: **Settings → Secrets and variables → Actions → New repository secret** con nome `GATE_HASH` e valore l'hash SHA-256 della password:
   ```sh
   printf '%s' 'la-tua-password' | shasum -a 256 | cut -d' ' -f1
   ```
   Senza il secret il sito è pubblico.
4. Il push su `main` lancia `deploy.yml`; l'indirizzo è `https://UTENTE.github.io/NOME-REPO/`. Se il repo si chiama `UTENTE.github.io` imposta `ASTRO_BASE: /` nel workflow.

Il workflow si avvia a ogni push su `main`, tranne quando cambiano solo `README.md` o `docs/`. Si può lanciare anche a mano dalla scheda *Actions*.

### Controllo sulle pull request

`check.yml` esegue la build quando una PR tocca `content/`, `src/` o i `package*.json`: se un file è scritto male la PR risulta rossa prima del merge.

### La password è solo un deterrente

Su hosting statico non esiste una password vera: l'hash è nel sorgente della pagina e i link anche, quindi chiunque sappia leggere il sorgente può aggirarla. Serve a tenere il toolkit fuori dalla portata dei curiosi, non a proteggere dati sensibili. Per una protezione reale usa un host con controllo d'accesso, per esempio **Cloudflare Pages + Cloudflare Access** (gratuito fino a 50 utenti).

### Alternative a GitHub Pages

Il progetto è un normale sito Astro statico: Cloudflare Pages o Netlify si collegano al repo e ripubblicano a ogni push, come fa il workflow. Build command `npm run build`, cartella di output `dist`. Le variabili `PUBLIC_GATE_HASH` e `PUBLIC_EDIT_URL` si impostano nel pannello del servizio; `ASTRO_BASE` non serve (il sito sta alla radice).

---

## Variabili

| Variabile | Dove | Effetto |
|---|---|---|
| `PUBLIC_GATE_HASH` | secret `GATE_HASH` / `.env` | attiva il gate con password (hash SHA-256) |
| `PUBLIC_EDIT_URL` | impostata dal workflow / `.env` | mostra il link **edit** accanto a ogni categoria |
| `ASTRO_SITE`, `ASTRO_BASE` | impostate dal workflow | indirizzo e percorso base per Pages |

## Problemi comuni

- **Build rossa dopo una modifica**: apri il log di Actions, la prima riga d'errore indica file e riga.
- **Sito con stile rotto o pagina bianca su Pages**: `ASTRO_BASE` deve essere `/nome-repo` (o `/` per `utente.github.io`).
- **Una categoria non compare**: il nome del file inizia con `_`, o l'estensione non è `.md`.
- **Il link "edit" non appare**: manca `PUBLIC_EDIT_URL` (nel deploy lo imposta il workflow).
- **Ho cambiato la password ma vale ancora la vecchia**: aggiorna il secret `GATE_HASH` e rilancia il workflow; la cache del browser può tenere la vecchia pagina.

## Cosa è stato provato e cosa no

**Provato**: build con i 15 file (15 categorie, 59 tool, identici ai dati originali); riga malformata, indirizzo non http(s), duplicato, categoria vuota e `title` mancante fanno fallire la build con file e riga; annotazione `::error` di GitHub Actions; file `_*.md` ignorati e nuovo file aggiunto correttamente; build con base path `/nome-repo`; nel browser gate (password errata e corretta), ricerca, link "edit".

**Non provato**: i workflow GitHub Actions (non eseguibili fuori da GitHub: il primo push è il primo test reale; i passi sono quelli standard di `withastro/action` e `actions/deploy-pages`) e il deploy su Cloudflare/Netlify.
