import type { DocPage } from "@/@types/docs";

export const keys: DocPage = {
  slug: "api-keys",
  title: "API Keys",
  section: "Referencia API",
  tocItems: [
    "Obtener una clave",
    "Usar la clave",
    "Scopes",
    "Límites",
    "Si pierdes una clave",
  ],
  content: `
# API Keys

Cada endpoint protegido se autentica con una API key. Las claves se emiten desde
la [dApp de ACTA](https://dapp.acta.build/), no desde esta API.

## Obtener una clave

1. Abre la [dApp de ACTA](https://dapp.acta.build/) y conecta tu wallet de Stellar.
2. Inicia sesión. Se te pedirá firmar una transacción de reto, construida para
   que nunca pueda enviarse (número de secuencia 0, límite temporal de dos
   minutos y una sola operación que no cambia nada). Firmarla no mueve fondos.
3. Crea la clave desde la sección de API keys.

La clave queda ligada a la wallet que inició sesión, y esa ligadura es lo que da
sentido a las comprobaciones de propiedad: una clave solo puede actuar por su
propia wallet, y nadie puede emitir una clave a nombre de una wallet que no
controla.

Las claves se emiten con rol **standard** y **no caducan**. El secreto se
muestra una sola vez y no se puede recuperar, así que guárdalo antes de cerrar
el diálogo.

> Crea una clave por red. Una clave pertenece a la red en la que se creó, y usar
> una de testnet contra mainnet responde \`401\`.

## Usar la clave

Envíala en cada petición protegida:

\`\`\`bash
curl https://sandbox-api.acta.build/contracts/version \\
  -H "X-ACTA-Key: tu_api_key"
\`\`\`

\`X-ACTA-Key\` es la cabecera canónica. También se aceptan \`x-api-key\` y
\`Authorization: Bearer <clave>\`. Las claves son cadenas hexadecimales de 64
caracteres, sin prefijo.

Mantén la clave del lado del servidor. Todo lo que llegue al navegador puede
leerlo cualquiera que abra las herramientas de desarrollo, y una clave portadora
demuestra posesión, no identidad: quien tenga la cadena puede usarla.

## Scopes

Una clave puede acotarse a un subconjunto de lo que su rol permite:

| Scope | Permite |
| --- | --- |
| \`credentials:issue\` | Emitir credenciales, individuales y por lote |
| \`credentials:read\` | Leer la lista de credenciales de un vault y su contenido |
| \`credentials:revoke\` | Revocar una credencial |
| \`vault:write\` | Crear un vault y empujar credenciales a él |
| \`vault:admin\` | Cambiar la propiedad, el DID y los permisos de emisor del vault |
| \`sponsor\` | Pagar el despliegue del vault de otra persona |

Se eligen al crear la clave. El caso habitual es una integración que emite pero
nunca debe leer las credenciales del titular.

Una clave **sin** scopes no tiene restricción dentro de su rol, así que las
claves creadas antes de que existieran los scopes siguen funcionando igual. Una
petición a la que le falte un scope responde \`403 insufficient_scope\`.

## Límites

- Hasta **5 claves activas por wallet y por red**. Revoca una que ya no uses
  antes de crear otra.
- Crear una clave nunca revoca las anteriores, así que rotar en un dispositivo
  no rompe los demás.

## Si pierdes una clave

El secreto se guarda hasheado y no se puede volver a mostrar. Si lo pierdes,
revoca esa clave desde la dApp y crea otra. La revocación surte efecto en la
siguiente petición; no hay periodo de gracia.
    `,
};
