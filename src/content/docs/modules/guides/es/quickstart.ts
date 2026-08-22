import type { DocPage } from "@/@types/docs";

export const quickstart: DocPage = {
  slug: "quickstart",
  title: "Quickstart",
  section: "Guías",
  tocItems: [
    "Qué vas a construir",
    "Requisitos",
    "Paso 1: Consigue una API key",
    "Paso 2: Instala y configura el SDK",
    "Paso 3: Obtén tu DID de emisor",
    "Paso 4: Crea la bóveda",
    "Paso 5: Emite una credencial",
    "Paso 6: Verifícala",
    "Componente completo",
    "Para seguir",
  ],
  content: `
# Quickstart

De cero a una **credencial verificable en Stellar testnet**, de punta a punta, con un solo ejemplo continuo. Todo lo de abajo también funciona sobre la API REST directamente (ver **[Resumen de API](doc:api-overview)**); esta guía usa el SDK de React porque es el camino más corto.

## Qué vas a construir

Un flujo pequeño de React que:

1. Obtiene una identidad de emisor (**did:stellar**) automáticamente
2. Crea una **bóveda** single-tenant para tu wallet
3. **Emite** una credencial dentro de ella
4. La **verifica** on-chain

## Requisitos

- Una wallet Stellar (p. ej. **Freighter**) con una cuenta de **testnet** fondeada con XLM: usa **[Stellar Lab (fondear cuenta)](https://lab.stellar.org/account/fund)**. En testnet, emitir cobra una tarifa on-chain de **5 XLM** por credencial, pagada por el emisor.
- Una app React / Next.js (los hooks del SDK requieren React 18+; \`ActaConfig\` es un componente cliente).
- Node 18+ para tooling.

## Paso 1: Consigue una API key

Crea tu key en el **[dApp de ACTA](https://dapp.acta.build)** → **API Keys** → **Create API Key**, en la red **Testnet**, y guárdala de inmediato (se muestra una sola vez).

> Datos clave: una key por wallet por red, rol standard, expira en 6 meses. El endpoint público de creación está restringido por Origin, así que el dApp es la vía para conseguirla. Detalles en **[API Keys](doc:api-keys)**.

## Paso 2: Instala y configura el SDK

\`\`\`bash
npm install @acta-team/credentials
\`\`\`

Envuelve tu app con el provider, apuntando a testnet:

\`\`\`tsx
"use client";
import { ActaConfig, testNet } from "@acta-team/credentials";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ActaConfig baseURL={testNet} apiKey={process.env.NEXT_PUBLIC_ACTA_API_KEY}>
      {children}
    </ActaConfig>
  );
}
\`\`\`

También necesitas un callback \`signTransaction\` que le pida a tu wallet firmar. Con Freighter:

\`\`\`ts
import { signTransaction } from "@stellar/freighter-api";

const sign = async (xdr: string, opts: { networkPassphrase: string }) => {
  const res = await signTransaction(xdr, {
    networkPassphrase: opts.networkPassphrase,
  });
  return res.signedTxXdr;
};
\`\`\`

## Paso 3: Obtén tu DID de emisor

Emitir requiere un **did:stellar** registrado y resoluble. El SDK puede crearlo y registrarlo por ti con **una sola firma de wallet** (auto-onboarding):

\`\`\`ts
import { useActaClient } from "@acta-team/credentials";

const client = useActaClient();

const identity = await client.getOrCreateIssuerIdentity({
  controller: walletAddress, // tu cuenta G...
  signTransaction: sign,
});
// identity.did => "did:stellar:testnet:..."
\`\`\`

La primera llamada genera una clave Ed25519, registra el DID on-chain y persiste la identidad (IndexedDB en el navegador). Las siguientes solo la leen, sin prompt. Detalles completos en la **[sección DID](doc:did-overview)**.

## Paso 4: Crea la bóveda

Cada propietario tiene una bóveda determinística single-tenant. Crearla es una operación única por wallet:

\`\`\`ts
import { useVault } from "@acta-team/credentials";

const { createVault } = useVault();

const { txId } = await createVault({
  owner: walletAddress,
  ownerDid: identity.did,
  signTransaction: sign,
});
\`\`\`

Si la bóveda ya existe en esa dirección, el deploy on-chain falla con "already deployed": puedes tratarlo como éxito.

## Paso 5: Emite una credencial

\`\`\`ts
import { useCredential } from "@acta-team/credentials";

const { issue } = useCredential();

const { txId } = await issue({
  owner: walletAddress,          // la bóveda que la recibe
  vcId: "employee-badge-001",    // id único, máx. 64 caracteres
  vcData: {
    "@context": ["https://www.w3.org/ns/credentials/v2"],
    type: ["VerifiableCredential"],
    credentialSubject: {
      id: identity.did,          // el DID del titular
      name: "Ada Lovelace",
      role: "Engineer",
    },
  },
  issuer: walletAddress,
  signTransaction: sign,
  // issuerDid puede omitirse: el SDK reutiliza la identidad del Paso 3
});
\`\`\`

Una firma de wallet después, la credencial queda cifrada, guardada en la bóveda y marcada como **válida** on-chain. El emisor paga los 5 XLM de testnet en la misma transacción.

## Paso 6: Verifícala

La verificación es una lectura gratuita, abierta a cualquiera con API key:

\`\`\`ts
import { useVaultRead } from "@acta-team/credentials";

const { verifyVc, listVcIds, getVc } = useVaultRead();

const status = await verifyVc({
  owner: walletAddress,
  vcId: "employee-badge-001",
});
// { status: "valid", since: "..." }

const ids = await listVcIds({ owner: walletAddress });
const vc = await getVc({ owner: walletAddress, vcId: "employee-badge-001" });
\`\`\`

O desde cualquier terminal contra la API:

\`\`\`bash
curl -X POST https://sandbox-api.acta.build/contracts/vault/verify-vc \\
  -H "X-ACTA-Key: your_key" \\
  -H "Content-Type: application/json" \\
  -d '{ "owner": "G...", "vcId": "employee-badge-001" }'
\`\`\`

## Componente completo

Todo el flujo en un solo handler:

\`\`\`tsx
"use client";
import {
  useActaClient,
  useVault,
  useCredential,
  useVaultRead,
} from "@acta-team/credentials";
import { signTransaction } from "@stellar/freighter-api";

export function IssueDemo({ wallet }: { wallet: string }) {
  const client = useActaClient();
  const { createVault } = useVault();
  const { issue } = useCredential();
  const { verifyVc } = useVaultRead();

  const sign = async (xdr: string, o: { networkPassphrase: string }) =>
    (await signTransaction(xdr, { networkPassphrase: o.networkPassphrase }))
      .signedTxXdr;

  const run = async () => {
    const identity = await client.getOrCreateIssuerIdentity({
      controller: wallet,
      signTransaction: sign,
    });

    try {
      await createVault({ owner: wallet, ownerDid: identity.did, signTransaction: sign });
    } catch {
      // la bóveda ya existe: ok
    }

    await issue({
      owner: wallet,
      vcId: "employee-badge-001",
      vcData: {
        "@context": ["https://www.w3.org/ns/credentials/v2"],
        type: ["VerifiableCredential"],
        credentialSubject: { id: identity.did, name: "Ada Lovelace" },
      },
      issuer: wallet,
      signTransaction: sign,
    });

    const status = await verifyVc({ owner: wallet, vcId: "employee-badge-001" });
    console.log(status); // { status: "valid", ... }
  };

  return <button onClick={run}>Emitir credencial</button>;
}
\`\`\`

## Para seguir

- **[Seguridad y Modelo de Datos](doc:security)** - qué está on-chain, qué va cifrado, quién firma qué
- **[Errores](doc:api-errors)** - cada código de error HTTP y cómo manejarlo
- **[Operaciones de Credenciales](doc:api-credentials)** - emisión en lote, revocación
- **Mainnet**: cambia \`baseURL\` a \`mainNet\`, crea una API key de mainnet y asegúrate de que la wallet emisora tenga **USDC con trustline** (la tarifa es 1 USDC por credencial)
    `,
};
