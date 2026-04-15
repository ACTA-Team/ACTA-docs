import type { DocPage } from "@/@types/docs";

export const scf42: DocPage = {
  slug: "scf-42",
  title: "SCF 42",
  section: "SCF",
  tocItems: [
    "Resumen",
    "Stellar DID Method (v0.1)",
    "Formato de identificador y binding de red",
    "Modelo DID Document",
    "Derivación de claves nativa",
    "Prueba de control",
    "Resolución determinística",
    "Resolver de referencia (OSS)",
    "Contratos Soroban",
    "API/SDK testnet",
    "Hito ZK (Stellar X-Ray)",
    "Resumen ZK",
    "Circuitos y predicados",
    "Binding de credencial y DID",
    "Nullifier y protección contra replay",
    "Interfaz del contrato verificador",
    "Primitivos BN254",
    "Setup de confianza y artefactos",
    "Modelo de amenazas y límites",
    "PoC ejecutable mínimo",
  ],
  content: `
# SCF 42

Arquitectura técnica de SCF 42: método DID Stellar, tooling de resolución, contratos Soroban para credenciales y bóvedas, y API/SDK en testnet.

## Resumen

- **Stellar DID Method (v0.1) + tooling de resolución** — Especificación y resolver open-source para que los identificadores \`did:stellar\` resuelvan a DID Documents para emisión y verificación de Credenciales Verificables.
- **Contratos Soroban** — Ciclo de vida de credenciales, bóvedas cifradas, aceptación de emisores controlada por el holder, niveles de fee en USDC y versionado.
- **API/SDK testnet** — Release estable y versionada en testnet con firma por wallet y flujos reproducibles de extremo a extremo.

## Stellar DID Method (v0.1)

El alcance v0.1 es single-signature y listo para el ecosistema.

### Formato de identificador y binding de red

Sintaxis normativa del identificador ligada a redes Stellar:

\`\`\`
did:stellar:<network>:<accountId>
\`\`\`

- **<network>**: \`mainnet\` | \`testnet\`
- **<accountId>**: clave pública Stellar StrKey (G...)

Representación de cuenta agnóstica de cadena (estilo blockchainAccountId):

\`\`\`
stellar:mainnet:<G...>   /   stellar:testnet:<G...>
\`\`\`

### Modelo mínimo de DID Document (listo para VC)

El DID Document v0.1 incluye el material de verificación mínimo para flujos VC y sigue el modelo de datos [W3C DID Core](https://w3c.github.io/did/#did-document-properties). Propiedades requeridas: \`id\`, \`verificationMethod\`, \`authentication\`, \`assertionMethod\`.

Ejemplo de estructura para \`did:stellar\` (v0.1, single-sig, Ed25519). Esta estructura puede variar en versiones futuras:

\`\`\`json
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/ed25519-2020/v1"
  ],
  "id": "did:stellar:testnet:GEXAMPLE1234567890ABCDEFGHIJKLM",
  "verificationMethod": [{
    "id": "did:stellar:testnet:GEXAMPLE1234567890ABCDEFGHIJKLM#controller",
    "type": "Ed25519VerificationKey2020",
    "controller": "did:stellar:testnet:GEXAMPLE1234567890ABCDEFGHIJKLM",
    "publicKeyMultibase": "z6Mk...",
    "blockchainAccountId": "stellar:testnet:GEXAMPLE1234567890ABCDEFGHIJKLM"
  }],
  "authentication": [
    "did:stellar:testnet:GEXAMPLE1234567890ABCDEFGHIJKLM#controller"
  ],
  "assertionMethod": [
    "did:stellar:testnet:GEXAMPLE1234567890ABCDEFGHIJKLM#controller"
  ]
}
\`\`\`

Consulta [DID Document properties (W3C)](https://w3c.github.io/did/#did-document-properties) para la definición normativa completa.

### Derivación de claves nativa desde estado de cuenta Stellar (solo single-sig)

El DID Document se construye de forma determinística desde la configuración de la cuenta on-ledger:

- \`verificationMethod\` se deriva del signer de la cuenta (clave Ed25519).
- v0.1 se limita a cuentas de una sola firma (un signer Ed25519 efectivo).
- Las cuentas con multisig (múltiples signers y/o umbrales) quedan fuera de alcance y DEBEN devolver un error tipado (ej. \`unsupportedAccountConfiguration\`) o tratarse como no soportadas por política.
- En v0.1 solo se exponen claves Ed25519 como \`verificationMethod\`; otros tipos de signer no se soportan o solo se reflejan en metadata.

### Prueba de control (issuer/holder)

Mecanismo estándar para probar control del identificador \`did:stellar\` vía firma de wallet:

- **Opción A (simple)**: Firma Ed25519 sobre un challenge canónico (nonce + domain + DID + timestamp).
- **Opción B (wallet-friendly)**: Firma de challenge estilo SEP-10 para flujos de wallet Stellar existentes.

En v0.1 se define una opción como recomendada y la otra como alternativa compatible, con canonicalización y reglas anti-replay (nonce, binding de dominio, expiración).

### Reglas de resolución determinística (normativas)

La resolución es determinística y usa solo estado público del ledger:

1. Parsear y validar el DID (network, StrKey).
2. Obtener estado de la cuenta vía Horizon/RPC.
3. Validar restricciones de cuenta v0.1 (single-sig).
4. Construir el DID Document desde: signer de la cuenta (verification methods), entradas ManageData opcionales bajo un namespace reservado (services/attributes). Por límites de tamaño de ManageData, v0.1 almacena sobre todo punteros/URIs cortos, no payloads grandes.
5. Devolver un DID Resolution Result con: \`didDocument\`, \`didResolutionMetadata\` (errores: \`invalidDid\`, \`unknownNetwork\`, \`notFound\`, \`unsupportedFormat\`, \`unsupportedAccountConfiguration\`), \`didDocumentMetadata\` (network, info de ledger, updated/versioning donde exista).

### Resolver de referencia (OSS)

Resolver open-source compatible con la interfaz DIF did-resolver (JS/TS):

- Multi-red (mainnet/testnet)
- \`did+json\` y \`did+ld+json\`
- Utilidades SDK: parse/normalización de DID, builder/verificador de challenge canónico (prueba de control), ejemplos de extremo a extremo para emisores/verificadores en flujos VC.

El borrador se desarrolla con asesoría de un contribuidor activo en estandarización de identidad W3C (alineación con DID Core / DID Resolution).

## Contratos Soroban (credenciales + bóvedas cifradas)

Los contratos Soroban (Rust) ofrecen una superficie clara y orientada a producción en testnet:

- **Ciclo de vida de credenciales**: Emitir, verificar, revocar; anclaje on-chain y chequeos de estado, incluyendo estado de revocación.
- **Bóvedas cifradas**: Operaciones de bóveda por holder (store/list/get), compartición y transferencia controlada de credenciales donde aplique.
- **Aceptación de emisores controlada por el holder** (permissionless, anti-spam): ACTA no restringe quién puede emitir en Stellar; controles por holder a nivel de bóveda: **Requerido**: blocklist de emisores por holder aplicada en escritura de bóveda (las escrituras de emisores bloqueados fallan de forma determinística). **Por defecto configurable**: política de bóveda soporta modo “accept-all” con camino extensible a modos más estrictos.
- **Niveles de fee en USDC**: Lógica de fees on-chain en USDC (configuración de niveles y aplicación), con semántica clara de pagador y cobro.
- **Versionado y despliegue**: Contract IDs publicados, documentación de interfaz y estrategia clara de upgrade/versión para testnet.

## API/SDK testnet

La API/SDK de testnet (emisión y verificación on-chain) se endurece en una release estable y versionada:

- **Estabilidad API/SDK**: Versionado, manejo de errores consistente y contratos request/response documentados.
- **Firma por wallet**: Freighter (y WalletConnect donde aplique); las transacciones se preparan en servidor y se firman en cliente.
- **Demo reproducible**: Flujo documentado y scripteable de extremo a extremo: el emisor prepara la transacción de emisión (XDR), firma vía wallet, la credencial se ancla on-chain, el holder la almacena o usa vía bóveda, el verificador realiza la verificación on-chain (incluyendo estado y revocación), con enlaces de transacción en cada paso.

## Hito ZK (Stellar X-Ray / Protocol 25)

El trabajo ZK entrega un componente de **revelación selectiva** completamente especificado y un **proof of concept ejecutable mínimo** que demuestra verificación on-chain preservando privacidad en Stellar usando los primitivos BN254 de Stellar X-Ray (Protocol 25). Esta sección amplía el alcance ZK del Tranche 3 para revisores técnicos.

### Resumen ZK

- **Curva**: BN254 (tal y como la expone Stellar X-Ray / Protocol 25).
- **Sistema de pruebas**: zk-SNARK Groth16.
- **Host functions utilizadas**:
  - \`bn254_g1_mul\`
  - \`bn254_g1_add\`
  - \`bn254_multi_pairing_check\`
  - Funciones Poseidon (para derivación de nullifier, donde aplique).
- **Verificador on-chain**: contrato Soroban (\`zk_verifier\`) desplegado en una red con Protocolo 25+ (testnet y mainnet para el PoC).
- **Tooling off-chain**: stack de prover compatible con BN254 (p.ej. circom + snarkjs u otro equivalente) que compila circuitos, genera claves de prueba/verificación y produce pruebas Groth16 compatibles con el encoding on-chain.

### Circuitos y predicados

Se implementa un predicado concreto y auditable, por ejemplo:

- **Predicado A (edad)**: “el holder es al menos mayor de 18 años”, o
- **Predicado B (no expirado)**: “la credencial no ha expirado en un instante de referencia”.

El predicado elegido se fija y se documenta explícitamente en el PoC.

#### Inputs

- **Inputs privados** (solo los conoce el holder / prover):
  - \`dob\`: fecha de nacimiento codificada como entero (timestamp Unix o YYYYMMDD).
  - \`salt\`: salt aleatorio usado en el hashing de atributos.
  - \`credential_secret_fields\`: campos secretos adicionales que ligan la prueba a una credencial ACTA concreta.
- **Inputs públicos**:
  - \`cred_hash\`: hash de la credencial (o campos seleccionados) tal como se almacena / referencia en ACTA.
  - Parámetros del predicado (p.ej. \`age_threshold = 18\`).
  - \`nullifier\`: nullifier público derivado de valores privados y públicos (ver más abajo).
  - \`holder_binding\` opcional: representación del DID del holder o de \`blockchainAccountId\`.

#### Lógica del circuito (ejemplo “edad ≥ 18”)

1. Recalcular un **binding hash** a partir de campos privados y salt:
   - \`h_internal = H(dob || salt || credential_secret_fields)\`
2. Combinarlo con metadata pública (issuer, schema, etc.) para recomputar \`cred_hash\`:
   - \`cred_hash' = H(h_internal || public_metadata)\`
3. Forzar \`cred_hash' == cred_hash\` (ligando la prueba a una credencial concreta).
4. Derivar la edad o comparar fechas para hacer cumplir el predicado (p.ej. \`age >= 18\` o “dob es al menos 18 años anterior a una fecha de corte”).
5. Opcionalmente derivar o comprobar el **nullifier** dentro del circuito para alinear la semántica con las comprobaciones on-chain.

El circuito documenta claramente variables privadas vs públicas, estrategia de hashing y semántica del predicado. El código fuente del circuito (p.ej. \`.circom\`) y los artefactos compilados se versionan y publican.

### Binding de credencial y DID

Las credenciales ACTA están ligadas al holder vía \`did:stellar:<network>:<accountId>\`. La prueba ZK debe quedar:

- **Ligada a una credencial concreta**, para que no pueda reutilizarse con otro cuerpo de credencial.
- **Ligada a un holder concreto**, para evitar “préstamo de pruebas”.

Esto se consigue mediante:

- **Hash de credencial** (\`cred_hash\`):
  - Calculado a partir de una forma canónica de la credencial (issuer DID, holder DID, schema ID y el atributo privado + salt).
  - La misma estructura se reproduce lógicamente dentro del circuito usando hashes “field-friendly”.
- **Holder binding**:
  - Se incluye una representación del DID del holder o de \`blockchainAccountId\` (p.ej. \`stellar:mainnet:G...\`) en:
    - El cómputo de \`cred_hash\`.
    - La derivación del nullifier.

Así se evita reutilizar una prueba para otra credencial u otro holder sin regenerarla.

### Nullifier y protección contra replay

#### Objetivos

- **Protección contra replay**: evitar aceptar la misma prueba (o el mismo uso lógico) varias veces cuando la aplicación requiera uso único.
- **Auditabilidad**: registrar que un nullifier concreto ha sido consumido.

#### Construcción del nullifier

El nullifier se deriva con funciones Poseidon de X-Ray para que la derivación sea idéntica off-chain y on-chain. Ejemplo:

\`\`\`text
nullifier = Poseidon(
  cred_hash
  || predicate_id
  || holder_binding
  || context
)
\`\`\`

Donde:

- \`cred_hash\`: liga al contenido de la credencial.
- \`predicate_id\`: distingue circuitos/predicados (p.ej. \`"isAdult"\` vs \`"notExpired"\`).
- \`holder_binding\`: liga al holder (hash de \`did:stellar:...\` o de \`blockchainAccountId\`).
- \`context\`: separador de dominio opcional (ID de aplicación / caso de uso).

La documentación especifica el encoding, el mapeo a campos y si el nullifier se recalcula en el circuito, en el contrato o en ambos.

#### Manejo on-chain

El contrato verificador:

- Recibe \`nullifier\` como input público.
- Antes de aceptar una prueba:
  - Comprueba si \`nullifier\` ya está almacenado; si lo está, devuelve un error (p.ej. \`NullifierUsed\`).
  - Si no, continúa con la verificación Groth16.
- Tras una verificación exitosa:
  - Almacena \`nullifier\` en el estado del contrato.
  - Emite un evento con \`nullifier\`, \`predicate_id\` y el resultado.

### Interfaz del contrato verificador

El contrato Soroban expone una función mínima y versionada, por ejemplo:

\`\`\`text
fn verify_proof(
  circuit_id: String,      // p.ej. "isAdult"
  proof: Bytes,            // prueba Groth16 serializada (A, B, C)
  public_inputs: Bytes,    // elementos de campo BN254 codificados
  nullifier: Bytes         // elemento de campo para protección contra replay
) -> Result<VerificationResult, VerificationError>
\`\`\`

- \`circuit_id\` se mapea a una clave de verificación concreta y a un layout de inputs públicos esperado.
- \`proof\` codifica los puntos G1/G2 \`A, B, C\` con un formato documentado compatible con el prover.
- \`public_inputs\` es una concatenación de elementos de campo en orden fijo (p.ej. \`[cred_hash, age_threshold, nullifier, holder_binding]\`).
- \`nullifier\` se pasa también por separado para indexación/comprobación de replay.

El contrato devuelve un resultado estructurado y emite eventos para que las verificaciones puedan indexarse on-chain. Los errores incluyen \`InvalidProof\`, \`NullifierUsed\`, \`InvalidInputs\`, \`UnsupportedCircuit\`.

### Primitivos BN254 (verificación Groth16 on-chain)

El verificador on-chain:

- Usa \`bn254_g1_mul\` y \`bn254_g1_add\` para reconstruir \`vk_x\` a partir de la verification key y de los inputs públicos.
- Usa \`bn254_multi_pairing_check\` para evaluar:

  > **e(−A,B) · e(α,β) · e(vkₓ,γ) · e(C,δ) = 1**

No se implementa aritmética de curvas ni pairings en Rust; todas las operaciones de curva provienen de las host functions de X-Ray. Las funciones Poseidon se utilizan, donde aplique, para derivar o comprobar el nullifier.

### Setup de confianza y artefactos

Como Groth16 requiere un trusted setup:

- Se definen los circuitos en un repositorio público (p.ej. \`isAdult.circom\`).
- Se ejecuta una ceremonia documentada (o se reutiliza una MPC compatible) para generar:
  - Proving key.
  - Verification key.
- Se publican:
  - Código fuente del circuito y versión (commit hash).
  - Hashes de las claves de prueba/verificación.
  - Encoding exacto de las constantes de la verification key usadas on-chain.

On-chain, el contrato embebe o referencia la VK para cada \`circuit_id\` soportado y mantiene un mapeo \`circuit_id -> vk_id\`.

### Modelo de amenazas y límites

Se explicita:

- **Qué se protege**:
  - Los atributos privados (DOB, expiración) nunca se revelan on-chain.
  - Los verificadores sólo ven el resultado del predicado y los inputs públicos (hash de credencial, nullifier, etc.).
  - La reutilización de pruebas se evita mediante el mecanismo de nullifier.
- **Qué queda fuera de alcance**:
  - Metadata de red (IP, timing) y correlación entre aplicaciones.
  - Issuers maliciosos que metan PII en campos públicos.
  - Ataques de canal lateral sobre el entorno del prover off-chain.
- **Dependencias**:
  - Correctitud y seguridad de las host functions BN254/Poseidon de Stellar y del stack Groth16 elegido.

También se fijan límites superiores razonables para tamaño de circuitos, número de inputs públicos y coste estimado de verificación.

### PoC ejecutable mínimo

El PoC ejecutable mínimo demuestra, de forma reproducible:

- **Credencial y claim** — Un holder posee una credencial ACTA (emitida y almacenada vía ACTA) con un **atributo privado** (ej. DOB exacta o timestamp de expiración).
- **Revelación selectiva y generación de prueba** — El holder revela sólo lo necesario (ej. “soy mayor de 18” o “esta credencial no ha expirado”) y genera una **prueba ZK** usando un circuito compatible con BN254, produciendo una prueba Groth16 e inputs públicos compatibles con BN254 más un nullifier.
- **Verificación on-chain** — Una transacción envía \`circuit_id\`, \`proof\`, \`public_inputs\` y \`nullifier\` al contrato verificador en Soroban. El contrato reconstruye \`vk_x\`, llama a \`bn254_multi_pairing_check\`, comprueba/almacena el nullifier y registra el éxito vía estado y eventos.
- **Resultado observable** — Un tercero puede verificar **on-chain** que una prueba válida fue verificada, **sin** que el verificador o la cadena conozcan el PII subyacente. La documentación incluye red/versión de protocolo, ID de contrato y comandos CLI/SDK para reproducir el flujo completo.
    `,
};
