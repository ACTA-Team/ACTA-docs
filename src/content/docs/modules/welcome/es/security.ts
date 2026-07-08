import type { DocPage } from "@/@types/docs";

export const security: DocPage = {
  slug: "security",
  title: "Seguridad y Modelo de Datos",
  section: "Bienvenida",
  tocItems: [
    "Principios",
    "Quién firma qué",
    "Qué vive dónde",
    "Cifrado de credenciales",
    "Qué puede y qué no puede hacer ACTA",
    "Seguridad de identidad",
    "Control de acceso de la API",
    "Inmutabilidad de contratos",
    "Links de compartir",
    "Reportar problemas",
  ],
  content: `
# Seguridad y Modelo de Datos

Un mapa honesto y preciso de dónde viven tus datos, quién puede leerlos y quién firma qué. Esta es la página que hay que leer antes de llevar ACTA a producción.

## Principios

- **No custodial**: ACTA nunca guarda claves privadas. Cada cambio de estado es una transacción Stellar firmada por tu wallet.
- **Prepare/submit en todas partes**: la API construye un XDR sin firmar, tu wallet lo firma localmente y la API lo envía. La clave de firma nunca sale de tu dispositivo.
- **Sin PII en claro on-chain**: los payloads de credenciales se cifran antes de anclarse.
- **Verificación trust-minimized**: el estado de una credencial y la resolución de DIDs son lecturas on-chain que cualquiera puede hacer.

## Quién firma qué

| Acción | Firmante |
|--------|----------|
| Crear bóveda | El propietario de la bóveda |
| Emitir / emitir en lote | El emisor (también paga la tarifa on-chain) |
| Revocar credencial | El propietario de la bóveda |
| Bloquear / desbloquear emisor | El admin de la bóveda (el propietario por defecto) |
| Registrar / actualizar / desactivar un DID | La wallet controller del DID |
| Deploy de bóveda patrocinada | El sponsor |

## Qué vive dónde

| Dato | Dónde | Forma |
|------|-------|-------|
| Payload de la credencial (\`vcData\`) | On-chain, dentro de la bóveda del propietario | **Ciphertext AES-256-GCM** |
| Estado de la credencial (válida / revocada + fecha) | On-chain | Público |
| Metadata de la bóveda (owner, DID URI, contadores) | On-chain | Público |
| Registro del DID del emisor (claves, controller, servicios) | On-chain (registro did:stellar) | Público por diseño |
| API keys | Base de datos de ACTA | **Hasheadas** (lookup SHA-256 + verificación Argon2id); el texto plano se muestra una vez y nunca se guarda |
| Payloads de links de compartir | Base de datos de ACTA, con expiración | **Sellados con AES-256-GCM**, links firmados con HMAC, expiran a los 7 días por defecto |
| Claves privadas (wallet o DID) | Tu wallet / tu navegador | Nunca se envían a ACTA |

## Cifrado de credenciales

Cuando emites, \`vcData\` viaja a la API por TLS y se cifra **del lado del servidor** con AES-256-GCM bajo una clave maestra del servidor, con la dirección del owner vinculada como dato autenticado (AAD). Lo que se ancla on-chain es el ciphertext.

Consecuencias prácticas:

- Cualquiera puede ver **que** una credencial existe y su estado; nadie puede leer su contenido desde la cadena.
- \`GET /contracts/vault/get-vc\` descifra del lado del servidor, y por eso la API exige que solo la API key del owner (o un admin) pueda llamarlo.
- \`verify-vc\` expone **solo el estado** y está abierto a cualquier key válida: los terceros verifican sin ver nunca el payload.

## Qué puede y qué no puede hacer ACTA

**Puede**: procesar el payload en claro al emitir y cuando el owner lo lee de vuelta (inherente al cifrado server-side); ver metadata de emisión (quién emitió a quién y cuándo); no puede revocar nada ni firmar nada en tu nombre.

**No puede**: leer tus credenciales desde la cadena sin el contexto de la clave maestra, mover fondos, emitir a tu nombre, rotar tu DID ni revocar tus credenciales: todo eso requiere firmas de tu wallet.

Si tu modelo de amenazas exige que ACTA nunca vea el payload, cifra \`vcData\` del lado del cliente antes de emitir; la plataforma trata el payload como opaco.

## Seguridad de identidad

- Cada mutación de un DID requiere la firma de la **wallet controller** on-chain (\`require_auth\`); el resolver no tiene ningún rol privilegiado.
- **Rotación de claves** sin perder identidad: \`transfer_controller\` mueve el control a otra wallet y el string del DID no cambia.
- La **desactivación** es de una sola vía: un DID desactivado se resuelve como tumba (HTTP 410) y ya no puede firmar.
- La emisión exige **vínculo con el controller**: el controller on-chain del DID debe ser igual al emisor firmante, así que un string de DID robado no sirve por sí solo.

## Control de acceso de la API

- Las API keys son hex aleatorio de 64 caracteres, guardadas hasheadas, con **expiración de 6 meses** y rate limits por rol (ver **[Resumen de API](doc:api-overview)**).
- **Vínculo de propiedad**: los endpoints que exponen o escriben datos de un titular (\`issue\`, \`batch-issue\`, \`list-vc-ids\`, \`get-vc\`, \`push\`) exigen que el \`owner\` del request sea la wallet de la key. Las superficies admin (\`/admin/*\`, bóveda patrocinada) requieren rol admin.
- Las escrituras soportan \`Idempotency-Key\` para reintentos seguros; todos los errores llevan \`request_id\` para trazabilidad (ver **[Errores](doc:api-errors)**).

## Inmutabilidad de contratos

- Las bóvedas se despliegan desde un **template WASM fijo** y **no tienen entrypoint de upgrade**: el código que guarda tus credenciales no puede cambiarse por debajo.
- La factory tampoco puede cambiar el template; publicar código nuevo de bóveda implica desplegar una factory nueva, nunca mutar bóvedas existentes.
- Los traspasos de admin (factory, registro) son **de dos pasos** (nominar y aceptar), evitando transferencias por error.

## Links de compartir

Compartir una credencial crea una copia sellada del lado del servidor con solo los campos que seleccionaste. Los links van firmados con HMAC, expiran (7 días por defecto) y la página pública de verificación siempre re-consulta el estado **on-chain**, así que una credencial revocada se muestra revocada incluso desde un link viejo.

## Reportar problemas

¿Encontraste una vulnerabilidad o algo que se ve mal? Abre un issue en **[GitHub](https://github.com/ACTA-Team/ACTA-docs/issues)** o contacta al equipo en **[Discord](https://discord.gg/DsUSE3aMDZ)**. Por favor no publiques detalles de explotación antes de que el equipo haya podido responder.
    `,
};
