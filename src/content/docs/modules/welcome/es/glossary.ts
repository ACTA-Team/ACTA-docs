import type { DocPage } from "@/@types/docs";

export const glossary: DocPage = {
  slug: "glossary",
  title: "Glosario",
  section: "Ayuda",
  tocItems: [
    "Credenciales",
    "Identidad",
    "Bóvedas y contratos",
    "Transacciones y API",
  ],
  content: `
# Glosario

Los términos usados en toda esta documentación, en lenguaje sencillo.

## Credenciales

- **Credencial Verificable (VC)**: una atestación digital (un certificado, una insignia, un recibo, una membresía...) cuya existencia y estado pueden comprobarse en la blockchain. ACTA sigue el modelo de datos de Credenciales Verificables del W3C.
- **Emisor (issuer)**: la wallet que crea y firma una credencial, y paga la comisión de emisión on-chain. Debe tener una identidad did:stellar registrada.
- **Holder / sujeto**: de quién trata la credencial. Se identifica con un DID en el campo \`credentialSubject.id\` de la credencial.
- **Propietario (owner)**: la wallet cuya bóveda guarda la credencial. A menudo es la wallet del holder, pero formalmente es quien posee la bóveda receptora.
- **\`vcId\`**: el identificador único de una credencial dentro de una bóveda (máx. 64 caracteres).
- **\`vcData\`**: el contenido de la credencial (JSON). Se cifra antes de guardarse on-chain.
- **Revocación**: marcar una credencial como ya no válida. La hace el propietario de la bóveda; el cambio de estado queda registrado on-chain con una fecha.
- **Divulgación selectiva**: compartir solo algunos campos de una credencial (lo que hace la función de compartir de la dApp).

## Identidad

- **DID (Identificador Descentralizado)**: un identificador de identidad portable que ninguna autoridad central controla. Se ve como \`did:stellar:testnet:znfx...\`.
- **did:stellar**: el método DID de ACTA en Stellar; la identidad obligatoria para los emisores. Consulta la [sección DID](doc:did-overview).
- **Controller**: la wallet de Stellar que controla un DID y firma sus cambios.
- **DID Document**: el documento público que obtienes al resolver un DID: sus claves, sus propósitos y sus servicios.
- **Resolver**: un servicio que convierte un string DID en su DID Document. ACTA aloja uno en \`did.acta.build\`.
- **Desactivación / tombstone**: deshabilitar un DID de forma permanente. Irreversible; el DID pasa a resolver como un documento "tombstone" vacío.

## Bóvedas y contratos

- **Bóveda (\`vc-vault\`)**: el contrato inteligente que guarda las credenciales de un propietario. Single-tenant: una bóveda por propietario.
- **Factory (\`vc-vault-factory\`)**: el contrato que despliega bóvedas (un factory por red) y cotiza la comisión de emisión.
- **\`userSalt\`**: un valor opcional de 32 bytes que permite a un propietario tener más de una bóveda. Si se omite, obtienes la bóveda canónica.
- **Deny-by-exception**: el modelo de emisores de ACTA: cualquiera puede emitir hacia una bóveda salvo que el propietario lo bloquee explícitamente.
- **Bóveda patrocinada (sponsored vault)**: una bóveda desplegada y pagada por un tercero (el sponsor) en nombre de un propietario. La ruta HTTP requiere una API key de admin; las claves de admin las provisiona el equipo de ACTA, no son autoservicio (escríbenos vía [Soporte](doc:support)).
- **Soroban**: la plataforma de contratos inteligentes de Stellar, donde corren los contratos de ACTA.
- **Contract ID**: la dirección de un contrato Soroban, que empieza con \`C...\`.

## Transacciones y API

- **XDR**: el formato binario de una transacción de Stellar. La API devuelve las transacciones como strings XDR sin firmar.
- **Prepare/submit**: el flujo de escritura en dos pasos de ACTA: la API prepara un XDR sin firmar, tu wallet lo firma y tú reenvías el XDR firmado.
- **\`signTransaction\` / Signer**: el callback que tu app provee para que la wallet del usuario firme un XDR.
- **Network passphrase**: un string que identifica la red de Stellar (testnet o mainnet) y que debe usarse al firmar.
- **API key**: la credencial para llamar a la API de ACTA, enviada en el header \`X-ACTA-Key\`. Una por wallet por red, expira a los 6 meses.
- **Rate limit**: el tope por clave de requests por minuto; excederlo devuelve HTTP 429.
- **Idempotency key**: un header opcional que hace seguro reintentar una escritura: la misma clave repite la respuesta original en lugar de ejecutar dos veces.
- **Trustline**: el opt-in de una cuenta Stellar para poder tener un token como USDC. Los emisores de mainnet necesitan una trustline de USDC para pagar la comisión.
- **Testnet / Mainnet**: la red de pruebas gratuita de Stellar frente a la red de producción. ACTA corre ambas, con claves, DIDs y bóvedas separadas.
    `,
};
