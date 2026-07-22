# Security Policy

This repository is the ACTA documentation site at
[`docs.acta.build`](https://docs.acta.build), plus the
**`@acta-team/docs-mcp`** MCP server that exposes those docs to AI assistants.

Two different surfaces, one policy. The MCP server is the more interesting one
— it is code that runs on developers' machines.

## Supported Versions

| Component                     | Version            | Supported          |
| ----------------------------- | ------------------ | ------------------ |
| Docs site (`docs.acta.build`) | currently deployed | :white_check_mark: |
| `@acta-team/docs-mcp`         | 0.1.x              | :white_check_mark: |
| Anything older                |                    | :x:                |

The site is hosted: we patch forward and redeploy. For the MCP server, only
the latest `0.1.x` is supported.

## Scope

**In scope — docs site**

- XSS or HTML injection in rendered documentation or search results
- Leaking a secret through the client bundle or build output
- Content injection, or anything letting a third party alter what readers see
- **Documented examples that are insecure if copied as written.** This is the
  one we most want to hear about: bad sample code in docs propagates into real
  integrations. Examples that put an API key in client-side code, skip
  verification, or disable a security check are in scope even though the site
  itself is static
- A dependency vulnerability reachable from the deployed bundle

**In scope — `@acta-team/docs-mcp`**

- Path traversal or arbitrary file read through the MCP tools
- Prompt injection through documentation content that redirects an assistant,
  exfiltrates a user's repository, or induces unrelated actions
- The server reaching any network destination other than the documented ACTA
  docs endpoints
- Command execution, or any capability beyond reading and searching docs
- A published tarball containing files not present in this repository

**Out of scope**

- Documentation being wrong, outdated or unclear with no security consequence
  — open a normal issue
- Vulnerabilities in the API, SDK, dApp or contracts, which have their own
  policies
- Vulnerabilities in MCP clients or the assistants themselves
- Missing security headers with no demonstrated impact
- Automated scanner output with no verified impact

## Reporting a Vulnerability

**Do not open a public issue for a security report.**

Use GitHub's private reporting:
[**Report a vulnerability**](https://github.com/ACTA-Team/ACTA-docs/security/advisories/new)

Or email **acta.xyz@gmail.com** with `SECURITY` in the subject.

Include which surface is affected (site or MCP server), the page or tool, how
to reproduce, and what an attacker gains. For MCP issues, the client you used
and a transcript help.

### What happens next

| Stage                                   | Timeline                             |
| --------------------------------------- | ------------------------------------ |
| We acknowledge your report              | Within **5 business days**           |
| We confirm or reject it, with reasoning | Within **15 business days**          |
| Fix for a confirmed high or critical    | Target **14 days** from confirmation |
| Fix for moderate or low                 | Target **90 days** from confirmation |

MCP server issues are treated one severity level higher than the equivalent
issue on the site, because that code runs on developer machines with access to
their projects.

**If we accept it:** we fix and deploy or publish, and credit you however you
prefer. If insecure example code was live long enough to have been copied, we
say so publicly rather than quietly editing the page.

**If we decline it:** we explain why in writing.

### Disclosure

We ask for **90 days** or until the fix ships, whichever comes first. If we go
quiet, disclose — we will not object.

## Licensing note

Code here is MIT, documentation content is CC BY 4.0. Neither grants any right
to ACTA trademarks. Security research on this repository is welcome under both.
