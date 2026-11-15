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
- I **tag** (facoltativi) vanno in fondo alla descrizione: `... descrizione. #cli #brew`. Devono essere elencati in `content/_tags.md`, altrimenti la build fallisce (così un refuso non crea un tag nuovo).
- Le righe vuote e i commenti `<!-- così -->` su una riga sono ignorati; qualsiasi altra riga fa fallire la build con un errore che indica file e riga.
- I tool compaiono nell'ordine in cui li scrivi.

## Nuova categoria

Crea `content/nome.md` con l'intestazione `---` qui sopra e almeno un tool.

## Tag

`content/_tags.md` è il vocabolario: una riga `- nome-tag: descrizione` per ogni tag.
Per aggiungerne uno basta una riga lì e poi usarlo nei tool. Sul sito compaiono come filtri cliccabili (più tag = devono valere tutti).

## Percorsi di diagnosi

Un percorso è una checklist ordinata per un sintomo: un file in `content/percorsi/`.

```md
---
title: "The site won't load"
when: "a client says \"the site is down\""
order: 1
---

## Does the domain still resolve?
Testo libero: cosa controllare e come leggere il risultato. Va bene `codice` e **grassetto**.

- Un punto elenco normale resta un punto elenco.

- [[dns/DNS Checker]]
- [[terminal/dig]]: `dig +short A example.com`  (dopo i due punti, una nota valida solo per questo passo)

## Next step
...
```

- `## Titolo` apre un passo; i passi compaiono nell'ordine in cui li scrivi.
- `- [[categoria/Nome del tool]]` pesca il tool da `content/<categoria>.md`: nome e descrizione vengono da lì, quindi non si duplicano.
- Il nome deve coincidere con quello in categoria (maiuscole a parte). Se un tool viene rinominato o tolto, la build fallisce indicando il riferimento rotto.
- Usa solo titoli di secondo livello (`##`).
