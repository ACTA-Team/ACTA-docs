import type { DocPage } from "@/@types/docs";

export const architecture: DocPage = {
  slug: "architecture",
  title: "Arquitectura",
  section: "Bienvenida",
  tocItems: [
    "Componentes del sistema",
    "Vault Factory (vc-vault-factory)",
    "Contrato de bóveda (vc-vault)",
    "Capa de API",
    "Almacenamiento",
    "Modelo de identidad",
    "Direcciones de contratos",
    "Soporte de red",
  ],
  content: `
# Arquitectura

Vista técnica de la arquitectura de ACTA y sus componentes.

## Componentes del sistema

La capa on-chain de ACTA (v0.4.0) se construye sobre dos contratos Soroban: una única **Vault Factory** por red y una **bóveda single-tenant** propiedad de cada emisor.

### Vault Factory (vc-vault-factory)

Existe exactamente un \`vc-vault-factory\` por red. Se encarga de desplegar y tarifar las bóvedas de cada propietario:

- **Despliegue determinista**: Despliega un nuevo \`vc-vault\` para un propietario a partir de un WASM plantilla. La dirección de la bóveda se deriva de \`(factory, owner, userSalt)\`.
- **Bóveda canónica**: El \`userSalt\` por defecto son 32 bytes en cero, lo que produce una única bóveda canónica por propietario. Salts distintos permiten bóvedas adicionales para el mismo propietario.
- **Bóvedas inmutables**: Las bóvedas se despliegan desde un WASM plantilla fijo y son inmutables una vez creadas.
- **Cotización de tarifa**: Expone \`quote_fee\`, la tarifa de emisión on-chain que paga el emisor (mainnet: 1 USDC por credencial; testnet: 5 XLM por credencial).

### Contrato de bóveda (vc-vault)

Cada propietario tiene su **propio** contrato \`vc-vault\` single-tenant. No existe un almacén compartido multi-tenant. La bóveda gestiona todo el ciclo de vida de la credencial on-chain:

- **Emitir / Emisión por lotes**: Crea nuevas credenciales en la bóveda (individual o hasta 5 por lote). La emisión cobra una tarifa on-chain vía el \`quote_fee\` de la factory, pagada por el emisor.
- **Verificar**: Verificación pública del estado de la credencial (\`valid\`, \`revoked\` o \`invalid\`).
- **Revocar**: Revoca credenciales con fecha de revocación opcional (firmado por el propietario de la bóveda).
- **Listar / Obtener / Contar**: Recupera IDs de credenciales (paginados) y datos de credenciales de la bóveda del propietario.
- **Push**: Mueve una credencial a otra bóveda desplegada por la factory con el mismo propietario.
- **DID de la bóveda**: La bóveda almacena el DID URI del propietario, modificable con \`set_vault_did\`.
- **Control de emisores**: La emisión es **abierta por defecto** (denegación por excepción). No hay lista de permitidos. El admin de la bóveda puede **bloquear** a un emisor con \`deny_issuer\` y **desbloquear** con \`allow_issuer\`.

Las funciones del contrato se exponen vía endpoints de la API. Revisa la referencia de API para más detalles.

### Capa de API

API REST que provee:

- **Operaciones de credenciales**: emitir, verificar, revocar
- **Operaciones de bóveda**: desplegar, almacenar, recuperar y gestionar bóvedas por propietario
- **Preparación de transacciones**: genera XDR sin firmar para firma del lado del cliente
- **Operaciones de lectura**: consulta de credenciales y estado de la bóveda (sin firma)

Todos los endpoints soportan automáticamente mainnet y testnet vía la configuración de \`NETWORK_TYPE\`.

### Almacenamiento

- **On-chain**: Hashes de credenciales y metadatos de estado (contratos inteligentes Soroban)
- **Off-chain**: Payload cifrado de la credencial (bóvedas controladas por el propietario)

## Modelo de identidad

La identidad del emisor es un \`did:stellar\` registrado y resoluble:

\`\`\`
did:stellar:{network}:{address}
\`\`\`

- **DID del emisor**: El emisor debe tener un \`did:stellar\` registrado en un registro did:stellar. Ya no se usa una clave de wallet simple ni \`did:pkh\` como DID del emisor.
- **Sujeto / titular**: El titular de la credencial se identifica con un DID, expresado como \`credentialSubject.id\` dentro de la credencial.

> **Nota**: v0.4.0 usa \`did:stellar\` para la identidad del emisor, resuelto a través del registro did:stellar on-chain. La documentación completa del método (sintaxis, registro, resolver, librería) vive en la **[sección DID](doc:did-overview)**.

## Direcciones de contratos

**Mainnet**

- **vc-vault-factory**: \`CCWNZ6UMUXCDOVP2TWOPVLI4KP4VY4YF7VKPN6XLYVHNFAT24NDB33CX\`
- **registro did:stellar**: \`CD6LSWW5ZSXOO5WAIHKQLQ262TW7BPI37PNEVMMA273BAPC65NN2AYXQ\`
- **hash WASM de la plantilla vc-vault**: \`2bd0323a98acb8469606808368da6c79824f2dd8391494b94ddbeb3d22c1a957\`

**Testnet**

- **vc-vault-factory**: \`CDRFQRIP4FA3WMPWCSAM3XEY6EM6EGKRYZRSCSVZ5NHCF6AGEVR2XEPQ\`
- **registro did:stellar**: \`CB7ATU7SF5QUKJMSULJDJVWJZVDXC23HTZX6NFUDTSFPVT6MA575NNZJ\`
- **hash WASM de la plantilla vc-vault**: \`2bd0323a98acb8469606808368da6c79824f2dd8391494b94ddbeb3d22c1a957\`

> El contrato \`vc-vault\` **no tiene un contract ID independiente**: es un WASM plantilla instanciado por propietario por la factory.

## Soporte de red

ACTA maneja automáticamente la configuración de red:

- **Testnet**: \`https://sandbox-api.acta.build\` o \`NETWORK_TYPE=testnet\`
- **Mainnet**: \`https://production-api.acta.build\` o \`NETWORK_TYPE=mainnet\`

Los IDs de contratos, URLs RPC y passphrases de red se configuran automáticamente según el tipo de red.
    `,
};
