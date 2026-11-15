---
title: "The site won't load"
when: "a client says \"the site is down\""
order: 1
---

## Is it down for everyone, or just for you?
Rule out your own connection and the client's network before touching anything.

- [[hosting/Down For Everyone Or Just Me]]
- [[hosting/IsItDownRightNow]]: compare it with the reports from other users.

## Does the domain still resolve?
An expired or misconfigured domain looks exactly like a dead server. Check that the name points to the IP you expect.

- [[dns/DNS Checker]]: the answers should be the same everywhere; different answers mean propagation or a bad record.
- [[terminal/dig]]: `dig +short A example.com`, then `dig +short NS example.com` to see who answers for the zone.
- [[dns/WHOIS Lookup]]: check the expiry date.

## Does the server answer?
If the name resolves, find out whether something answers on the other side.

- [[hosting/Ping.eu]]
- [[hosting/Site24x7 Tools]]: port 80/443 check.
- [[terminal/curl]]: `curl -I https://example.com` shows the status code, redirects and headers.
- [[terminal/mtr]]: shows the hop where the connection dies.

## Is the certificate valid?
An expired certificate makes browsers refuse to load the page even though the server is fine.

- [[ssl/SSL Labs]]
- [[terminal/openssl]]

## Is a third party down?
CDN, platform or package registry outages are not your fault, and knowing that saves hours.

- [[uptime/DownDetector]]
- [[hosting/UptimeRobot Status]]
- [[shopify/Shopify Status]]: only if the store is on Shopify.

## Who actually hosts it?
If everything on your side looks fine, you need the provider's name to open a ticket.

- [[hosting/IPinfo]]: ASN and provider behind the IP.
