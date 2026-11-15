---
title: "API returns something unexpected"
when: "malformed response, 4xx/5xx, payload rejected"
order: 6
---

## Reproduce it outside the app
If it fails the same way from the terminal, the problem is the request, not your client code.

- [[terminal/curl]]: `curl -i -X POST -H 'Content-Type: application/json' -d @body.json https://api.example.com/endpoint`
- [[terminal/httpie]]
- [[api/Postman]]: save the request so it can be replayed and shared.

## Is the payload valid?
One stray comma is enough to get a 400.

- [[api/JSONLint]]

## What is really being sent?
Compare headers and body with what you think you are sending.

- [[api/httpbin]]

## Parsing a field?
- [[api/Regex101]]: test the pattern against real samples and read the explanation of each group.
