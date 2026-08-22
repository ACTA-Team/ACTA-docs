import type { DocPage } from "@/@types/docs";

export const overview: DocPage = {
  slug: "api-overview",
  title: "Resumen",
  section: "Referencia API",
  tocItems: [
    "Arquitectura",
    "URLs base",
    "Autenticación",
    "Formato de solicitud",
    "Formato de respuesta",
    "Flujo Prepare/Submit",
    "Comisiones",
    "Requisito de DID del emisor",
    "Configuración de red",
    "Manejo de errores",
    "Límites de tasa",
    "Idempotencia",
    "Pruébalo en Swagger",
  ],
  content: `
# Resumen de Referencia API

API RESTful para la gestión de credenciales ACTA en la blockchain Stellar. Todos los endpoints soportan redes mainnet y testnet.

## Arquitectura

Las bóvedas de ACTA son **mono-inquilino**: cada owner tiene su propio contrato \`vc-vault\`. Las bóvedas se despliegan de forma determinista mediante un único **\`vc-vault-factory\`** por red. Como el despliegue es determinista, la API y el SDK derivan la dirección de la bóveda de un owner a partir de \`(factory, owner, userSalt)\` sin almacenarla: solo pasas el \`owner\`.

- **\`userSalt\`** (opcional): salt de 32 bytes que distingue varias bóvedas para el mismo owner. El valor por defecto son **32 bytes en cero**, lo que produce una única bóveda canónica por owner. Usa un \`userSalt\` distinto solo si quieres ejecutar más de una bóveda por owner.
- **\`vaultContract\`** (opcional, lecturas): el id del contrato de bóveda ya resuelto (\`C...\`). Si se omite, la API lo resuelve desde \`owner\` (y \`userSalt\`) vía el factory. Úsalo para saltarte la resolución si ya conoces la dirección.

La mayoría de los endpoints reciben \`owner\` (y opcionalmente \`userSalt\`). Ya no hay un \`contractId\` por solicitud para sobrescribir la bóveda: el factory es dueño del despliegue y de la derivación de direcciones.

## URLs base

**Testnet:**

\`\`\`
https://sandbox-api.acta.build
\`\`\`

**Mainnet:**

\`\`\`
https://production-api.acta.build
\`\`\`

## Autenticación

Las rutas de **contrato** (\`/contracts/*\` - bóveda lectura/escritura, bóveda patrocinada, operaciones VC, versión del contrato, etc.) requieren una API key válida en cada solicitud. Envíala en el header:

\`\`\`
X-ACTA-Key: tu_api_key_aqui
\`\`\`

\`X-ACTA-Key\` es el header canónico; también se aceptan \`x-api-key\` y \`Authorization: Bearer <key>\`. Las API keys son cadenas hex de 64 caracteres (sin prefijo).

Las **rutas públicas** no necesitan API key: \`GET /health\` y \`GET /config\`. Todo lo demás requiere una key.

**Enforcement de propiedad:** los endpoints que leen o mueven datos de credenciales de un holder (\`/contracts/vault/list-vc-ids\`, \`/contracts/vault/get-vc\`, \`/contracts/vault/push\`) requieren que el \`owner\` (o \`fromOwner\`) de la solicitud coincida con el \`wallet_address\` vinculado a tu API key. Las keys con rol admin están exentas. \`verify-vc\` está intencionalmente abierto a cualquier key válida para que terceros puedan verificar credenciales.

**Enforcement de emisor:** \`/contracts/vc/issue\` y \`/contracts/vc/batch-issue\` atan el **\`issuer\`** en su lugar (y el \`sourcePublicKey\`, si se envía). El \`owner\` es el destinatario y queda deliberadamente sin restricción, así se puede emitir a cualquiera. Atar el destinatario, como hacían antes estas rutas, significaba que solo podías emitirte credenciales a vos mismo.

La emisión se autoriza on-chain de todos modos: \`issue\` llama a \`issuer_addr.require_auth()\`, así que ninguna API key puede emitir en nombre de una wallet sin la firma de esa wallet.

**Scopes:** una key puede llevar scopes que acotan lo que puede hacer: \`credentials:issue\`, \`credentials:read\`, \`credentials:revoke\`, \`vault:write\`, \`vault:admin\`, \`sponsor\`. Se eligen al crear la key, por ejemplo una integración que emite pero nunca puede leer el contenido de un vault. Una key sin scopes no tiene restricción, así que toda key emitida antes de que existieran sigue funcionando igual. Un scope faltante responde \`403 insufficient_scope\`.

**Enforcement de sponsor:** \`POST /contracts/sponsored-vault/create\` está abierto a keys estándar, pero el \`sponsor\` (y el \`sourcePublicKey\`, si se envía) debe coincidir con el \`wallet_address\` vinculado a tu API key, de modo que solo puedas pagar un despliegue con tu propia cuenta. El \`owner\` queda deliberadamente sin restricción: patrocinar la bóveda de otra persona es justamente para lo que sirve el endpoint.

**Rol admin:** las mutaciones del issuer-registry (\`POST\`, \`PATCH\` y \`DELETE\` bajo \`/contracts/issuer-registry/\`) requieren una key con rol **admin**. El resto de endpoints documentados aquí acepta una key standard.

### Obtener una API Key

Creá una desde la [dApp de ACTA](https://dapp.acta.build/) conectando tu wallet de Stellar e iniciando sesión. La key queda ligada a esa wallet, lleva rol standard y no caduca. Ver [API Keys](/docs/api-keys) para el detalle.

## Formato de solicitud

Todas las solicitudes usan formato JSON. El header Content-Type debe ser \`application/json\`.

### Operaciones de escritura (Prepare/Submit)

Las operaciones de escritura soportan dos modos:

1. **Prepare**: Envía solicitud sin \`signedXdr\` → devuelve XDR sin firmar
2. **Submit**: Envía solicitud con \`signedXdr\` → ejecuta la transacción

Ejemplo de solicitud prepare:

\`\`\`json
{
  "owner": "G...",
  "vcId": "credential-123",
  "vcData": "...",
  "issuer": "G...",
  "sourcePublicKey": "G..."
}
\`\`\`

Ejemplo de solicitud submit:

\`\`\`json
{
  "signedXdr": "AAAA..."
}
\`\`\`

## Formato de respuesta

### Respuesta exitosa

El modo prepare devuelve XDR sin firmar + network passphrase:

\`\`\`json
{
  "xdr": "AAAA...",
  "network": "Test SDF Network ; September 2015"
}
\`\`\`

El modo submit devuelve el ID de la transacción:

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

### Respuesta de error

\`\`\`json
{
  "error": "error_code",
  "message": "Mensaje de error legible"
}
\`\`\`

## Flujo Prepare/Submit

1. **Prepare**: Llama al endpoint con parámetros de operación (sin \`signedXdr\`)
2. **Firmar**: Firma el \`xdr\` devuelto con tu wallet Stellar usando el \`network\` passphrase
3. **Submit**: Llama al mismo endpoint con \`signedXdr\` para ejecutar

## Comisiones

Las comisiones de emisión se cobran **on-chain en la bóveda** mediante \`quote_fee\` del factory. La comisión la paga el **emisor** al momento de emitir (mainnet: 1 USDC por credencial; testnet: 5 XLM por credencial). La API **ya no acepta un override de comisión** en ningún cuerpo de solicitud. No hay niveles de comisión por rol: hay una única comisión estándar más una comisión personalizada opcional por emisor, ambas resueltas on-chain.

## Requisito de DID del emisor

El emisor debe ser un **\`did:stellar\`** registrado y resoluble. Las direcciones de wallet "a secas" y los valores \`did:pkh\` **ya no se aceptan** como DID del emisor. La API exige una vinculación controlador-DID: el controlador on-chain del DID debe ser igual al emisor que firma; de lo contrario la solicitud falla con el error \`issuerDid_controller_mismatch\`.

El **holder** de la credencial se expresa dentro de \`vcData\` como \`credentialSubject.id\` (un DID). No existe un campo \`holder\` o de wallet aparte en las solicitudes de emisión.

## Configuración de red

### GET /config

Devuelve la configuración pública de la red. **No requiere API key** y no tiene límite de tasa: es el endpoint público de bootstrap que los SDKs llaman una vez por sesión.

**Respuesta:**

\`\`\`json
{
  "rpcUrl": "https://soroban-testnet.stellar.org:443",
  "networkPassphrase": "Test SDF Network ; September 2015",
  "networkType": "testnet",
  "factoryContractId": "C...",
  "vaultWasmHash": "2bd0323a...",
  "didStellarRegistryId": "C...",
  "actaContractId": "C..."
}
\`\`\`

- **factoryContractId**: id del contrato \`vc-vault-factory\` para esta red.
- **networkType**: \`testnet\` o \`mainnet\`.
- **vaultWasmHash**: hash del WASM plantilla \`vc-vault\` que despliega el factory.
- **didStellarRegistryId**: id del contrato del registro \`did:stellar\` usado para resolver los DID de emisores.
- **actaContractId**: alias de retrocompatibilidad de \`factoryContractId\`.

## Manejo de errores

Todos los errores devuelven JSON con:
- \`error\`: Identificador del código de error
- \`message\`: Descripción del error legible

Códigos HTTP comunes:
- \`200\`: Éxito
- \`400\`: Solicitud incorrecta (parámetros inválidos)
- \`401\`: No autorizado (API key faltante o inválida)
- \`403\`: Prohibido (permisos insuficientes)
- \`404\`: No encontrado
- \`429\`: Límite de tasa excedido
- \`500\`: Error interno del servidor

## Límites de tasa

Los endpoints autenticados tienen límite de tasa **por API key** sobre una ventana deslizante de 60 segundos, con buckets separados de lectura y escritura que dependen del rol de la key:

| Rol | Lecturas / min | Escrituras / min |
|------|-------------|--------------|
| standard | 60 | 20 |
| early | 300 | 100 |
| admin | 200 | 50 |

- Headers de respuesta: \`X-RateLimit-Limit\` / \`X-RateLimit-Remaining\` (lecturas), \`X-WriteRateLimit-*\` (escrituras) y \`Retry-After\` en \`429\` (\`rate_limit_exceeded\` / \`write_rate_limit_exceeded\`)

## Idempotencia

Las rutas de escritura de contratos aceptan un header opcional \`Idempotency-Key\` (hasta 200 caracteres). La primera respuesta para una key dada se guarda en caché durante 24 horas y se reproduce en los reintentos con el header \`Idempotency-Replayed: true\` - útil para reintentar submits de forma segura.

## Pruébalo en Swagger

Usa **[Swagger UI (testnet)](https://sandbox-api.acta.build/docs)** para revisar el OpenAPI, ver esquemas de petición y respuesta, y ejecutar **Try it out** en el navegador cuando el endpoint lo permita.

1. Abre **[https://sandbox-api.acta.build/docs](https://sandbox-api.acta.build/docs)**
2. Despliega una operación, revisa parámetros y ejemplos, y usa **Try it out** si está disponible
3. En rutas que requieran API key, configura el header **\`X-ACTA-Key\`** (o **Authorize** en Swagger, si existe) tras crear una clave (ver **Obtener una API Key** arriba)

> Swagger UI está disponible **solo en testnet**: en instancias de mainnet todas las rutas \`/docs\` están deshabilitadas y devuelven 404. Usa testnet para explorar y las mismas rutas contra \`https://production-api.acta.build\` en producción.
    `,
};
