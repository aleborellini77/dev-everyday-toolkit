---
title: "Email not arriving / going to spam"
when: "bounces, missing messages, \"it lands in spam\""
order: 3
---

## Are the MX records correct?
Without valid MX records nothing can be delivered to the domain.

- [[email/MXToolbox SuperTool]]
- [[terminal/dig]]: `dig MX example.com`

## Does the message pass SPF, DKIM and DMARC?
Send a real message from the affected address to the test inbox and read the score.

- [[email/Mail-Tester]]: any red item is a likely cause of spam placement.

## Is the sending IP or domain blacklisted?
- [[dns/MXToolbox]]: use the blacklist check on the sending IP and domain.

## What does Gmail think of the domain?
- [[email/Google Postmaster Tools]]: reputation only appears once the domain sends enough volume.

## Does the mail server accept connections?
Check that SMTP ports are open and that TLS works before blaming the DNS.

- [[terminal/nmap]]: `nmap -p 25,465,587 mail.example.com`
- [[terminal/openssl]]: `openssl s_client -starttls smtp -connect mail.example.com:587`
