# Dev / IT Toolkit

Una pagina statica con link a tool raggruppati per problema (DNS, hosting, SSL, performance, email, Shopify, terminale…), pensata per accorciare la prima valutazione di un problema. Look da terminale, ricerca, password facoltativa.

**I contenuti sono solo file Markdown.** Aggiungi o modifichi un `.md` in `content/`, fai commit su `main`, e GitHub Actions ricostruisce e ripubblica il sito su GitHub Pages. Nessun database, nessun CMS.

```
content/            una categoria = un file .md (15 già pronte)
  _tags.md          vocabolario dei tag condivisi
  _FORMATO.md       promemoria del formato (ignorato dal sito)
  percorsi/         percorsi di diagnosi: una checklist = un file .md
src/                Astro: parser dei .md, pagine, componenti, stile
public/favicons/    icone del sito (favicon, apple-touch-icon, manifest)
.github/workflows/
  deploy.yml        build + pubblicazione su Pages a ogni push su main
  check.yml         solo validazione, sulle pull request
.github/dependabot.yml   aggiorna da solo Astro e le azioni dei workflow (apre una pull request)
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

## Tag e filtri

Ogni tool può avere dei tag in fondo alla riga, che sul sito diventano filtri cliccabili nella barra laterale (più tag insieme = devono valere tutti, e si combinano con la ricerca; lo stato resta nell'indirizzo, per esempio `?tag=cli,brew`):

```md
- [nmap](https://nmap.org/book/man.html) `nmap -p 1-1000 host`: Scan open ports. #cli #brew #security
```

I tag ammessi sono elencati in `content/_tags.md` (una riga `- nome: descrizione`). Un tag che non è nell'elenco fa fallire la build: per crearne uno nuovo si aggiunge la riga lì. Vale la pena tenerli pochi e trasversali alle categorie (`#cli`, `#status`, `#no-signup`…): quelli che coincidono con una categoria non servono.

> I tag `#no-signup` li ho assegnati dalla mia conoscenza dei tool, senza poterli verificare uno per uno: controllali la prima volta che passi dal sito.

## Percorsi di diagnosi

Le categorie rispondono a "che tipo di problema è"; i **percorsi** rispondono a "da dove comincio". Sono checklist ordinate per un sintomo ("il sito non carica", "le email finiscono in spam"…), in `content/percorsi/`. Sul sito stanno sotto *diagnosis paths*, in alto nella barra laterale.

```md
---
title: "The site won't load"
when: "a client says \"the site is down\""
order: 1
---

## Does the domain still resolve?
Cosa controllare e come leggere il risultato.

- [[dns/DNS Checker]]
- [[terminal/dig]]: `dig +short A example.com`
```

Ogni `## Titolo` è un passo; `- [[categoria/Nome del tool]]` pesca il tool dalla categoria (nome, link e descrizione restano in un posto solo). Dopo i due punti si può aggiungere una nota valida solo per quel passo. Se un riferimento non esiste più, la build fallisce con file e riga. Per un percorso nuovo basta un nuovo file in `content/percorsi/`.

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

## Icone (favicon)

I file sono in `public/favicons/`: Astro pubblica solo ciò che sta in `public/`, e `src/layouts/Base.astro` li collega alla pagina aggiungendo da solo il percorso base di GitHub Pages. Per cambiare le icone basta sostituire i file tenendo gli stessi nomi (altrimenti aggiorna i link in `Base.astro` e in `site.webmanifest`). Nel manifest i percorsi delle icone sono relativi (`web-app-manifest-192x192.png`, senza `/` iniziale): con un `/` iniziale su Pages darebbero 404.

## Variabili

| Variabile | Dove | Effetto |
|---|---|---|
| `PUBLIC_GATE_HASH` | secret `GATE_HASH` / `.env` | attiva il gate con password (hash SHA-256) |
| `PUBLIC_EDIT_URL` | impostata dal workflow / `.env` | mostra il link **edit** accanto a ogni categoria |
| `ASTRO_SITE`, `ASTRO_BASE` | impostate dal workflow | indirizzo e percorso base per Pages |

## Sicurezza

**Cosa protegge davvero e cosa no.** La password è un deterrente, non una protezione (vedi sopra): l'hash e tutti i link sono nel sorgente della pagina, e l'hash è un SHA-256 senza sale, quindi una password debole si scopre offline in pochi secondi. Perciò usa una passphrase lunga (20+ caratteri, da password manager) e **mai una password che usi altrove**. Il repo di un sito su Pages gratuito è pubblico: in `content/` non va nulla di riservato.

**Cosa è stato messo in sicurezza nel codice**
- *Testo dei file Markdown*: viene sempre "escapato", non può generare HTML o script. I link devono essere `http(s)`. Provato con script, `javascript:`, attributi `on…=` e virgolette in titoli, descrizioni, passi e note: niente viene eseguito.
- *Righe enormi*: tetto di 1000 caratteri per riga, con errore chiaro (una riga di 60.000 spazi bloccava la build per 8 secondi: oggi fallisce subito).
- *Pagina*: `noindex` e `referrer: no-referrer` (cliccando un tool non si comunica agli altri siti l'indirizzo del toolkit).
- *Workflow*: permessi minimi (`contents: read`; `pages`/`id-token` solo per il deploy), timeout su ogni job, nessun testo esterno interpolato nei comandi. Le pull request partono da fork senza accesso ai secret.
- *Dipendenze*: una sola (`astro`); `npm audit` pulito. Dependabot apre una pull request quando esce un aggiornamento o un avviso.

**Da fare una volta sul repository** (non si può fare da codice)
1. Account con autenticazione a due fattori.
2. *Settings → Code security*: attiva *Secret scanning* con *Push protection* e *Dependabot alerts*.
3. *Settings → Branches*: regola su `main` che richiede la pull request e il controllo `Check / build` (opzionale se lavori da solo, ma ferma una build rotta prima del merge).
4. *Settings → Actions → General*: permessi del workflow su *Read repository contents* e approvazione obbligatoria per i workflow dei nuovi collaboratori esterni.
5. *Settings → Pages*: lascia attivo *Enforce HTTPS*.

**Limiti noti**
- Le azioni dei workflow sono indicate per versione (`@v4`), non per SHA: se un tag venisse manomesso il workflow userebbe il codice nuovo. Il rischio è basso per azioni ufficiali; per annullarlo si fissano gli SHA (con Dependabot restano aggiornati).
- Il font arriva da Google Fonts: chi apre il sito comunica il proprio IP a Google. Per evitarlo si può includere il font nel progetto (pacchetto `@fontsource/ibm-plex-mono`).

## Problemi comuni

- **Build rossa dopo una modifica**: apri il log di Actions, la prima riga d'errore indica file e riga.
- **Sito con stile rotto o pagina bianca su Pages**: `ASTRO_BASE` deve essere `/nome-repo` (o `/` per `utente.github.io`).
- **Una categoria non compare**: il nome del file inizia con `_`, o l'estensione non è `.md`.
- **Il link "edit" non appare**: manca `PUBLIC_EDIT_URL` (nel deploy lo imposta il workflow).
- **Ho cambiato la password ma vale ancora la vecchia**: aggiorna il secret `GATE_HASH` e rilancia il workflow; la cache del browser può tenere la vecchia pagina.

## Cosa è stato provato e cosa no

**Provato**: build con i 15 file (15 categorie, 59 tool, identici ai dati originali); riga malformata, indirizzo non http(s), duplicato, categoria vuota e `title` mancante fanno fallire la build con file e riga; annotazione `::error` di GitHub Actions; file `_*.md` ignorati e nuovo file aggiunto correttamente; build con base path `/nome-repo`; nel browser gate (password errata e corretta), ricerca, link "edit".

**Provato anche** (tag, percorsi, sicurezza): script e attributi malevoli nei file Markdown (niente viene eseguito), righe patologiche per le regex; tag sconosciuto, tag senza descrizione, riferimento a tool o categoria inesistente, riferimento malformato e percorso senza passi fanno fallire la build con file e riga; filtri per tag nel browser (AND, combinazione con la ricerca, reset, `?tag=` nell'indirizzo); pagine dei percorsi con base path e gate sulla sessione nuova.

**Non provato**: i workflow GitHub Actions (non eseguibili fuori da GitHub: il primo push è il primo test reale; i passi sono quelli standard di `withastro/action` e `actions/deploy-pages`) e il deploy su Cloudflare/Netlify.
