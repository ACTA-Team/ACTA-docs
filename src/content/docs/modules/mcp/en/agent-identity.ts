import type { DocPage } from "@/@types/docs";

export const agentIdentity: DocPage = {
  slug: "agent-identity",
  title: "Identity for AI Agents",
  section: "AI",
  tocItems: [
    "The problem",
    "ACTA primitives applied to agents",
    "Anatomy of an agent credential",
    "Integration patterns",
    "Security considerations",
    "Status and next steps",
  ],
  content: `
# Identity for AI agents

As AI agents act more autonomously (calling APIs, moving funds, talking to other agents), a trust question appears: **how does an agent prove who it is, who operates it, and what it is allowed to do?** ACTA addresses this with the same primitives it uses for people and organizations.

> This page is conceptual and describes patterns. The primitives it references (DIDs, vaults, and credentials) exist in ACTA today; the agent-specific packaging is an integration pattern, not a new endpoint.

## The problem

An API key identifies a client, but says nothing verifiable about the agent behind it: who deployed it, under which organization it operates, what scope it has, or whether it is still authorized. When two agents interact, or when a service receives an agent's request, it needs a **portable, verifiable** proof, not implicit trust in a shared secret.

## ACTA primitives applied to agents

- **DID (\`did:stellar\`):** the agent gets its own decentralized identifier, independent of any platform. This is its verifiable "who". See [DID](/en/did-overview).
- **Verifiable credentials:** the operator (a person or organization with their own DID) issues credentials to the agent's DID declaring its role, permissions, and validity.
- **Vault:** stores and manages the agent's credentials in a queryable, revocable way. See [useVault](/en/useVault).

The trust chain becomes: **the operator (issuer) signs a credential for the agent's DID, and any verifier can check the signature and validity** without depending on ACTA as an online intermediary.

## Anatomy of an agent credential

An agent credential typically declares:

- **subject:** the agent's DID.
- **issuer:** the operator's DID (the responsible person or organization).
- **claims:** role or purpose, permission scope, limits (for example, amounts or domains), and an expiry date.
- **status:** active or revoked, verifiable at the moment of use.

This turns "trust this agent" into something checkable: who vouches for it, what it may do, and until when.

## Integration patterns

1. **Agent onboarding:** when deploying an agent, create its DID and issue an initial credential from the operator's DID with the minimum scope needed.
2. **Presentation:** the agent presents its credential (or a derived proof) to the service or agent it interacts with.
3. **Verification:** the verifier checks the issuer signature, scope, and revocation status before acting. See [Verifying Credentials](/en/verify-credentials).
4. **Rotation and revocation:** if the agent is compromised or its scope changes, the operator revokes or reissues. Revocation is immediate for future verifications.

## Security considerations

- **Least privilege:** issue the narrowest scope possible and prefer short-lived credentials with reissuance.
- **Key separation:** the operator's signing key must never live inside the agent. The agent carries credentials, not the ability to issue them.
- **No autonomy on sensitive operations:** issuing, revoking, or signing value transactions should require operator approval, not sit in the model's autonomous loop.
- **Auditability:** log which credential the agent presented for each relevant action.

## Status and next steps

The building blocks (DID, vaults, credentials, verification) are documented and available today. If you want to build an agent-identity flow, start with [DID](/en/did-overview) and [Verifying Credentials](/en/verify-credentials), and use [Prompt Recipes](/en/ai-prompts) to have your assistant guide you from the official docs.
  `,
};
