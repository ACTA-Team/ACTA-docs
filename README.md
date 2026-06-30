# ACTA

### *Revolutionizing credential verification through blockchain technology*

[![Stellar Network](https://img.shields.io/badge/Stellar-Network-7B4BFF?style=for-the-badge&logo=stellar)](https://stellar.org)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-Powered-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-22C55E?style=for-the-badge)](./LICENSE)

---

## **What is ACTA?**

**ACTA** is a Verifiable Credentials API built on the Stellar network that enables startups, DAOs and companies to issue and verify trusted digital credentials. Our vision is to make trust in digital records as seamless and transparent as a blockchain transaction.

The problem we address is the fragmentation and inefficiency of current credential systems, from universities validating diplomas to DAOs verifying member contributions. ACTA provides a simple API layer that abstracts the complexity of blockchain, allowing any platform to issue tamper-proof credentials anchored on Stellar's public ledger.

Technically, ACTA leverages Soroban smart contracts and off-chain verification logic to create, store, and validate verifiable credentials following the W3C standard. Issuers and holders are identified by a portable `did:stellar` resolved on-chain; each holder owns a single-tenant credential vault deployed by a factory contract, so status and revocation are publicly verifiable while sensitive data stays off-chain behind our API.

This hybrid approach ensures scalability, low cost, and interoperability with other identity frameworks. We are currently focused on integrations with educational institutions, companies and startups in LATAM, with the vision to expand globally and empower users to control and share their credentials securely.

By combining open-source principles with Stellar's trust and efficiency, ACTA aims to become the backbone for verifiable identity and credential infrastructure across the ecosystem.

---

## **Our Mission**

**ACTA's mission** is to build the infrastructure that enables the secure, transparent, and accessible issuance and verification of verifiable digital credentials, leveraging the Stellar network to ensure trust and traceability without exposing personal data.

---

## **Official Links**

These are the official ACTA resources.
If you are looking for the correct website, docs, demo or support channels, start here:

- 🌐 Website (Landing): https://acta.build
- 🧪 dApp: https://dapp.acta.build
- 📚 API Docs: https://docs.acta.build
- 🪪 DID Resolver: https://did.acta.build

> ACTA is built on Stellar + Soroban, following the W3C Verifiable Credentials standard.

---

## **SEO & Discoverability**

ACTA is actively developed as an open-source infrastructure for **verifiable credentials on Stellar**.
If you found this repository via search, these keywords describe the project:

- Verifiable Credentials (W3C)
- Blockchain credentials infrastructure
- Stellar / Soroban smart contracts
- `did:stellar` decentralized identity
- Digital trust & credential verification
- Identity & credential interoperability

---

## **Documentation site**

This repository powers [docs.acta.build](https://docs.acta.build): the reference for the ACTA API, SDK, Soroban contracts, dApp, and MCP server, in English and Spanish.

```bash
npm install
npm run dev   # http://localhost:3000
```

Content is authored as typed `DocPage` modules under `src/content/docs/modules/<module>/<lang>/`. After editing, run `npm run mcp:generate-docs` to refresh the search index and the `@acta-team/docs-mcp` data.

---

## **Built for Meridian Hackathon**

*Showcasing the future of decentralized credential management.*

**Meet us at:** https://acta.build • **Try demo:** https://dapp.acta.build • **API Docs:** https://docs.acta.build

---

## **License**

MIT. See [LICENSE](./LICENSE).

---

*The new infrastructure for digital trust.*
