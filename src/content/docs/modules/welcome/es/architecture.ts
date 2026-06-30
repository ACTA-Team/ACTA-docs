import type { DocPage } from "@/@types/docs";

export const architecture: DocPage = {
  slug: "architecture",
  title: "Arquitectura",
  section: "Bienvenida",
  tocItems: [
    "Componentes del sistema",
    "Factory de bóvedas",
    "Bóveda mono-inquilino",
    "Capa de API",
    "Almacenamiento",
    "Modelo de identidad (did:stellar)",
    "IDs de contratos",
    "Flujo de credenciales",
    "Soporte de red",
  ],
  content: `
# Arquitectura

Vista técnica de la arquitectura de ACTA y sus componentes (v0.4.0).

## Componentes del sistema

La capa on-chain de ACTA es un **\`vc-vault-factory\`** más contratos **\`vc-vault\`** por propietario. Hay un factory por red; cada propietario obtiene su propia bóveda, desplegada de forma determinista por el factory.

### Factory de bóvedas (Soroban)

El **\`vc-vault-factory\`** despliega y rastrea bóvedas mono-inquilino:

- **Deploy**: Despliega de forma determinista una bóveda para un propietario a partir de \`(factory, owner, userSalt)\`; el \`userSalt\` por defecto (32 bytes en cero) da una bóveda canónica por propietario.
- **Deploy patrocinado**: \`deploy_sponsored\` permite que cualquier sponsor despliegue una bóveda para un propietario (abierto, sin lista blanca).
- **Tarifas**: \`quote_fee\` resuelve la tarifa de emisión cobrada on-chain (por defecto 1 USDC por credencial, pagada por el emisor). Aplica una sola tarifa estándar, con una tarifa personalizada opcional por emisor (con expiración opcional).

### Bóveda mono-inquilino (Soroban)

La **\`vc-vault\`** de cada propietario es un almacén de credenciales inmutable y mono-inquilino:

- **Emitir / Emisión por lote**: Almacena credenciales y las marca como válidas; cobra la tarifa vía el factory.
- **Listar / Obtener / Verificar / Conteo**: Lee IDs, datos, estado y conteos de credenciales.
- **Revocar**: Revoca una credencial con fecha opcional.
- **Acceso de emisores (denegar-por-excepción)**: La emisión es **abierta por defecto**. El propietario puede **bloquear** emisores (\`deny_issuer\`) y **desbloquearlos** (\`allow_issuer\`); no hay lista de autorizados.

Los emisores deben controlar un \`did:stellar\` registrado y resoluble (el controlador on-chain del DID debe ser igual a la cuenta emisora).

### Capa de API

API REST que provee:

- **Operaciones de credenciales**: emitir, verificar, revocar  
- **Operaciones de bóveda**: almacenar, recuperar y gestionar bóvedas  
- **Preparación de transacciones**: genera XDR sin firmar para firma del lado del cliente  
- **Operaciones de lectura**: consulta de credenciales y estado de la bóveda (sin firma)  

Todos los endpoints soportan automáticamente mainnet y testnet vía la configuración de \`NETWORK_TYPE\`.

### Almacenamiento

- **On-chain**: Hashes de credenciales y metadatos de estado (contratos inteligentes Soroban)  
- **Off-chain**: Payload cifrado de la credencial (bóvedas controladas por el usuario)  

## Modelo de identidad

Usa el método \`did:stellar\` - una identidad compatible con W3C DID Core 1.1 anclada en un contrato registry de Soroban:

\`\`\`
did:stellar:{network}:{didId}
\`\`\`

- **network**: \`mainnet\` o \`testnet\`
- **didId**: identificador base32 de 26 caracteres (128 bits aleatorios, registrado on-chain)

Capacidades principales: rotación de claves, múltiples claves de verificación, endpoints de servicio, transferencia de controlador y desactivación irreversible. Consulta la [documentación de DID:Stellar](#did-stellar-overview) para más detalles.

## IDs de contratos

**Mainnet:**

| Contrato | ID |
|----------|----|
| \`vc-vault-factory\` | \`CCWNZ6UMUXCDOVP2TWOPVLI4KP4VY4YF7VKPN6XLYVHNFAT24NDB33CX\` |
| \`did-stellar-registry\` | \`CD6LSWW5ZSXOO5WAIHKQLQ262TW7BPI37PNEVMMA273BAPC65NN2AYXQ\` |
| Hash Wasm de plantilla de bóveda | \`2bd0323a98acb8469606808368da6c79824f2dd8391494b94ddbeb3d22c1a957\` |

Tarifa de emisión en mainnet: **1 USDC por credencial**, pagada por el emisor.

**Testnet:**

| Contrato | ID |
|----------|----|
| \`vc-vault-factory\` | \`CDRFQRIP4FA3WMPWCSAM3XEY6EM6EGKRYZRSCSVZ5NHCF6AGEVR2XEPQ\` |
| \`did-stellar-registry\` | \`CBUNQ3GX3ZQ4MF64H7JCYZMXLGOS47VPIQQS7NCR6V3KX6YP7O72L5QF\` |

## Flujo de credenciales

![Issuance Flow](/issuance-flow.png)  

![Verification Flow](/credential-verifier.png)  

## Soporte de red

ACTA maneja automáticamente la configuración de red:

- **Testnet**: \`https://api.testnet.acta.build\` o \`NETWORK_TYPE=testnet\`  
- **Mainnet**: \`https://api.mainnet.acta.build\` o \`NETWORK_TYPE=mainnet\`  

Los IDs de contratos, URLs RPC y passphrases de red se configuran automáticamente según el tipo de red.
    `,
};
