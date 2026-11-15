---
title: "Terminal (macOS / Unix)"
when: "faster than opening a browser tab"
order: 14
---

- [dig](https://ss64.com/mac/dig.html) `dig A example.com`: Query any DNS record type straight from the resolver.
- [curl](https://curl.se/docs/manpage.html) `curl -I url`: Check headers, redirects, and status codes without a browser.
- [traceroute](https://ss64.com/mac/traceroute.html) `traceroute host`: See exactly which hop a connection dies on.
- [nmap](https://nmap.org/book/man.html) `nmap -p 1-1000 host`: Scan open ports before assuming it's a firewall issue. brew install nmap
- [lsof](https://ss64.com/mac/lsof.html) `lsof -i :3000`: Find the process locking a port before killing it blindly.
- [openssl](https://ss64.com/mac/openssl.html) `openssl s_client -connect host:443`: Inspect a TLS handshake and certificate chain by hand.
- [mtr](https://github.com/traviscross/mtr) `mtr host`: Combine ping and traceroute into one live view. brew install mtr
- [htop](https://htop.dev) `htop`: Watch CPU, memory, and runaway processes in real time. brew install htop
- [httpie](https://httpie.io/docs/cli) `http GET url`: Send readable, colorized API requests without curl's flags. brew install httpie
