# Come si scrive una categoria

I file che iniziano con `_` (come questo) vengono ignorati dal sito.
Ogni altro `.md` di questa cartella è una **categoria**; il nome del file diventa l'ancora (`dns.md` → `#dns`).

```md
---
title: "DNS & Domain"                 # obbligatorio: nome mostrato
when: "domain not resolving"          # facoltativo: suggerimento "quando usarla"
order: 1                              # facoltativo: posizione (1 = prima); senza, in fondo per nome file
---

- [MXToolbox](https://mxtoolbox.com): Descrizione breve del tool.
- [dig](https://ss64.com/mac/dig.html) `dig A example.com`: Con un comando da terminale.
```

## Una riga = un tool

```
- [Nome](https://indirizzo): descrizione
- [Nome](https://indirizzo) `comando`: descrizione
```

- Il link deve iniziare con `http://` o `https://`.
- Tra link (o comando) e descrizione ci vogliono i due punti seguiti da uno spazio (va bene anche `—`).
- Il `comando` tra backtick è facoltativo: se c'è, la card lo mostra al posto dell'indirizzo.
- Le righe vuote e i commenti `<!-- così -->` su una riga sono ignorati; qualsiasi altra riga fa fallire la build con un errore che indica file e riga.
- I tool compaiono nell'ordine in cui li scrivi.

## Nuova categoria

Crea `content/nome.md` con l'intestazione `---` qui sopra e almeno un tool.
