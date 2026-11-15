---
title: "The site feels slow"
when: "\"it was faster yesterday\", slow pages, poor Core Web Vitals"
order: 4
---

## Is it your connection?
Rule out bandwidth first, otherwise you will chase a problem that is not there.

- [[network/Speedtest]]

## Measure instead of guessing
Get a baseline: field data from real users and a lab run, so you know what you are trying to improve.

- [[perf/PageSpeed Insights]]
- [[perf/WebPageTest]]

## Which asset is heavy?
The waterfall shows the largest or slowest request, which is usually the answer.

- [[perf/GTmetrix]]

## Is the server itself slow?
If the first byte takes long, the problem is the backend or the hosting, not the page.

- [[terminal/curl]]: `curl -o /dev/null -s -w '%{time_starttransfer}\n' https://example.com` prints the time to first byte.

## Is the JavaScript heavy?
- [[code/Bundlephobia]]: check what a dependency adds to the bundle.

## What is it running on?
Knowing the stack tells you where to look: CMS, CDN, caching layer.

- [[frontend/Wappalyzer]]

## Shopify theme?
- [[shopify/Shopify Theme Inspector]]: profile Liquid rendering to find the slow snippet.
