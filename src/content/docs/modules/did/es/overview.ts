import type { DocPage } from "@/@types/docs";

export const overview: DocPage = {
  slug: "did-overview",
  title: "Resumen",
  section: "DID",
  tocItems: [
    "¿Qué es did:stellar?",
    "Sintaxis del DID",
    "Por qué el DID no es tu wallet",
    "Modelo de controller",
    "El Documento DID",
    "Tipos de claves",
    "Roles de un DID",
    "Ciclo de vida",
    "Proof of Control",
    "Cómo usa ACTA did:stellar",
  ],
  content: `
# did:stellar

**did:stellar** es un método de [Identificadores Descentralizados (DID) del W3C](https://www.w3.org/TR/did-1.1/) construido sobre la red **Stellar**. Le da a cada emisor y titular una identidad portable y auto-controlada cuyo estado vive en un contrato Soroban (el **did-stellar-registry**), de modo que cualquiera puede resolverla y verificarla con solo un endpoint RPC de Stellar.

El método fue desarrollado por ACTA y está registrado en el **registro de extensiones DID del W3C** como el método \`stellar\`. Es la identidad de emisor obligatoria para emitir credenciales en ACTA: no se aceptan direcciones de wallet simples ni \`did:pkh\`.

## ¿Qué es did:stellar?

- **Descentralizado**: la fuente de verdad es el contrato de registro on-chain, no un servidor de ACTA. Un DID es válido si y solo si está registrado on-chain.
- **Trust-minimized**: cualquier verificador puede resolver cualquier \`did:stellar\` usando solo una URL RPC de Stellar y el id del contrato de registro. El resolver alojado en \`https://did.acta.build\` es una conveniencia sin estado, no un guardián.
- **No custodial**: ni el resolver ni las librerías guardan claves privadas. Cada mutación la firma la propia wallet Stellar del controller.

## Sintaxis del DID

\`\`\`
did:stellar:{network}:{didId}
\`\`\`

| Parte | Regla |
|-------|-------|
| \`network\` | \`mainnet\` o \`testnet\` (conjunto cerrado, sin alias) |
| \`didId\` | 16 bytes aleatorios codificados en base32 RFC 4648 **minúscula**, sin padding: exactamente 26 caracteres \`[a-z2-7]\` |

La regex canónica de validación es:

\`\`\`
^did:stellar:(mainnet|testnet):([a-z2-7]{26})$
\`\`\`

Ejemplo (un DID real de testnet, resoluble de forma permanente):

\`\`\`
did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi
\`\`\`

El identificador se genera con Web Crypto (\`crypto.getRandomValues\`); la generación falla explícitamente si no hay una fuente aleatoria segura.

## Por qué el DID no es tu wallet

El \`didId\` de 128 bits es **opaco**: deliberadamente no se deriva de ninguna cuenta Stellar. Esto tiene tres consecuencias prácticas:

- El string del DID **sobrevive a la rotación de claves**: puedes ceder el control a otra wallet con \`transfer_controller\` y el DID no cambia.
- Una wallet puede controlar **muchos DIDs**.
- La wallet aparece solo como el campo \`controller\` dentro del registro on-chain, nunca en el string del DID.

## Modelo de controller

El **controller** es una cuenta Stellar clásica (\`G...\`). Cada mutación del registro (\`update\`, \`transfer_controller\`, \`deactivate\`) requiere la firma del controller actual: el contrato exige \`controller.require_auth()\`. No hay ningún rol privilegiado en la capa HTTP.

## El Documento DID

Resolver un \`did:stellar\` produce un documento conforme a W3C DID Core 1.1. Las claves usan el formato **Multikey**, las relaciones de verificación contienen referencias por fragmento (\`#auth-1\`, \`#assert-1\`, \`#keyagr-1\`), y no hay campo \`controller\` raíz (el documento es auto-controlado).

\`\`\`json
{
  "didDocument": {
    "@context": [
      "https://www.w3.org/ns/did/v1",
      "https://w3id.org/security/multikey/v1"
    ],
    "id": "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi",
    "verificationMethod": [
      {
        "id": "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi#auth-1",
        "type": "Multikey",
        "controller": "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi",
        "publicKeyMultibase": "z6MkwBw2szL21i4Ym1wqzV8bPWwJyp1WDt8oRofTEs9ZntSq"
      }
    ],
    "authentication": [
      "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi#auth-1"
    ],
    "assertionMethod": [],
    "keyAgreement": [],
    "service": []
  },
  "didDocumentMetadata": {
    "versionId": "1",
    "deactivated": false,
    "method": {
      "network": "testnet",
      "stellarAccount": "G..."
    }
  },
  "didResolutionMetadata": { "contentType": "application/did+ld+json" }
}
\`\`\`

\`didDocumentMetadata.method.stellarAccount\` expone la cuenta controller, así los verificadores pueden vincular el DID con la wallet que lo controla.

## Tipos de claves

| Relación | Curva | Prefijo multibase | Máx. claves |
|----------|-------|-------------------|-------------|
| \`authentication\` | Ed25519 | \`z6Mk...\` | 1 a 3 (mínimo 1 obligatoria) |
| \`assertionMethod\` | Ed25519 | \`z6Mk...\` | 0 a 3 |
| \`keyAgreement\` | X25519 | \`z6LS...\` | 0 o 1 |

Las claves crudas deben ser de 32 bytes. La **misma clave puede aparecer en más de una relación** (la forma idiomática de un emisor es una clave Ed25519 en \`authentication\` y \`assertionMethod\` a la vez); los duplicados **dentro** de una misma relación se rechazan con \`duplicate_key\`.

## Roles de un DID

- **Titular (holder)**: solo clave de \`authentication\`.
- **Emisor (issuer)**: \`authentication\` **más al menos una clave de \`assertionMethod\`** (obligatoria; los verificadores W3C rechazan credenciales firmadas sin clave de aserción).
- **Receptor DIDComm**: agrega una clave X25519 de \`keyAgreement\`.

## Ciclo de vida

| Operación | Firma | Notas |
|-----------|-------|-------|
| \`register\` | El controller del registro | Crea el DID; \`version\` empieza en 1 |
| \`update\` | Controller actual | **Reemplazo completo del registro** (no un patch); requiere \`expectedVersion\` |
| \`transfer_controller\` | Controller actual | Rota la wallet controladora; el string del DID no cambia |
| \`deactivate\` | Controller actual | **Irreversible**; el DID se resuelve como tumba (tombstone) con HTTP \`410 Gone\` |

Cada mutación incrementa \`version\` (concurrencia optimista): enviar un \`expectedVersion\` desactualizado falla con \`version_mismatch\`.

## Proof of Control

did:stellar define un protocolo off-chain de **Proof of Control** (por ejemplo, para login con DID):

1. El verificador emite un challenge \`{ did, domain, nonce, timestamp }\`.
2. El firmante lo canonicaliza con JCS (RFC 8785) y lo firma con una clave Ed25519 de \`authentication\` (firma en base64url, sin padding).
3. El verificador comprueba, en orden: timestamp dentro de una ventana de 5 minutos, coincidencia de dominio, frescura del nonce y la firma Ed25519 contra cada clave de \`authentication\` del documento resuelto.

La librería TypeScript trae este protocolo listo para usar (ver **[Librería TypeScript](doc:did-library)**).

## Cómo usa ACTA did:stellar

- **La identidad del emisor es obligatoria**: \`POST /contracts/vc/issue\` exige un \`issuerDid\` que resuelva en el registro de la red y cuyo **controller on-chain sea igual al emisor firmante** (si no, la API devuelve \`issuerDid_controller_mismatch\`).
- **El SDK de credenciales lo auto-registra**: llamar a \`issue\` sin \`issuerDid\` genera claves, registra un did:stellar con una sola firma de wallet y lo reutiliza después (ver **[SDK de credenciales](doc:sdk-overview)**).
- **El dApp guía el registro** con una sola firma de wallet.
- **Dominios de confianza separados**: la API de credenciales deliberadamente no importa la librería DID; identidad y credenciales evolucionan por separado.

Continúa con **[Registro y Resolver](doc:did-registry)** para el contrato on-chain y la API HTTP, o **[Librería TypeScript](doc:did-library)** para código.
    `,
};
