import type { DocPage } from "@/@types/docs";

export const architecture: DocPage = {
  slug: "architecture",
  title: "Arquitectura",
  section: "Bienvenida",
  tocItems: [
    "Componentes del sistema",
    "Contrato de emisión",
    "Contrato de bóveda",
    "Capa de API",
    "Almacenamiento",
    "Modelo de identidad",
    "Flujo de credenciales",
    "Soporte de red",
  ],
  content: `
# Arquitectura

Vista técnica de la arquitectura de ACTA y sus componentes.

## Componentes del sistema

### Contrato de emisión (Soroban)

Gestiona el ciclo de vida de la credencial on-chain:

- **Emitir**: Crea nuevas credenciales y ancla el hash on-chain  
- **Verificar**: Verificación pública del estado de la credencial  
- **Revocar**: Revoca credenciales con fecha de revocación opcional  

Las funciones del contrato se exponen vía endpoints de la API. Revisa la referencia de API para más detalles.

### Contrato de bóveda (Soroban)

Repositorio multi-tenant de almacenamiento de credenciales:

- **Inicializar**: Crea una nueva bóveda para un usuario  
- **Almacenar**: Guarda credenciales cifradas en la bóveda del usuario  
- **Listar/Obtener**: Recupera IDs y datos de credenciales  
- **Verificar**: Verifica credenciales delegando al contrato de emisión  
- **Autorización**: Gestiona las listas de emisores autorizados

Cada usuario tiene una bóveda aislada con controles de administración e autorización de emisores independientes.

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

## Modelo de identidad 1.0

Usa el formato DID:pkh:

\`\`\`
did:pkh:stellar:{network}:{wallet_address}
\`\`\`

- **network**: \`mainnet\` o \`testnet\`  
- **wallet_address**: clave pública de Stellar (G...)  

No se requiere infraestructura de identidad adicional: las claves de la wallet Stellar actúan como identidad.

> **Nota**: La versión 1.0 es la primera versión en ACTA. Se está trabajando en la versión 2.0 donde se usará el DID oficial de Stellar.

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
