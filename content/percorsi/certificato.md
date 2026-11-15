---
title: "Certificate warning / mixed content"
when: "\"your connection is not private\", padlock missing"
order: 5
---

## What exactly does the certificate say?
Read the expiry date and the chain before changing anything.

- [[ssl/SSL Labs]]: grade, chain problems and expiry.
- [[terminal/openssl]]: `openssl s_client -connect example.com:443 -servername example.com | openssl x509 -noout -dates`

## Is the domain pointing at the right server?
A certificate issued for another host usually means the DNS points somewhere unexpected.

- [[dns/DNS Checker]]

## Are the security headers sane?
Redirects to HTTPS and HSTS problems often show up here.

- [[ssl/Security Headers]]
- [[ssl/Mozilla Observatory]]

## Mixed content
Open the browser console: every blocked request is listed with its URL. Fix the `http://` references in the markup.

- [[code/W3C Validator]]: catches broken markup that hides the real reference.
