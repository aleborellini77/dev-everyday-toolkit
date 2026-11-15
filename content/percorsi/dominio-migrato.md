---
title: "Domain just moved or changed DNS"
when: "migration, new records, \"it works for me but not for the client\""
order: 2
---

Propagation is rarely the whole story: caches, wrong records and old nameservers explain most "it works for me" cases.

## Is the registration in order?
Check the nameservers the registry hands out, not the ones you think you set.

- [[dns/WHOIS Lookup]]

## Do all resolvers agree?
Different answers in different places mean propagation is still going on, or one record is wrong.

- [[dns/DNS Checker]]
- [[dns/Google Public DNS]]: Google's cache refreshes on its own TTL.
- [[terminal/dig]]: `dig A example.com @8.8.8.8` against `dig A example.com @1.1.1.1` shows two resolvers side by side.

## Are all the records there?
Subdomains and records forgotten during a migration are the usual culprits.

- [[dns/DNSdumpster]]
- [[dns/Google Admin Toolbox Dig]]

## Does mail still work?
Moving the zone often drops MX, SPF or DKIM records.

- [[email/MXToolbox SuperTool]]

## Is the certificate still valid for the new server?
- [[ssl/SSL Labs]]
