import type { DocPage } from "@/@types/docs";

export const mainnetGuide: DocPage = {
  slug: "mainnet-guide",
  title: "Pasar a Mainnet",
  section: "Guías",
  tocItems: [
    "Qué cambia en mainnet",
    "Checklist",
    "1. Apunta a la API de mainnet",
    "2. Crea una API key de mainnet",
    "3. Fondea el emisor con USDC",
    "4. Registra tu DID en mainnet",
    "5. Recrea la bóveda",
    "Direcciones de contratos en mainnet",
    "Puntos a tener en cuenta",
  ],
  content: `
# Pasar a Mainnet

Todo lo que validaste en testnet funciona igual en mainnet, pero cambian cuatro cosas: la URL base, la API key, el token de la comisión y la red donde viven tu DID y tu bóveda. Esta página es el checklist.

## Qué cambia en mainnet

| Aspecto | Testnet | Mainnet |
|--------|---------|---------|
| URL base | \`https://sandbox-api.acta.build\` | \`https://production-api.acta.build\` |
| Constante del SDK | \`testNet\` | \`mainNet\` |
| Comisión de emisión | 5 XLM (nativo, sin trustline) | **1 USDC** por credencial |
| Prerrequisito de la comisión | Cuenta de testnet fondeada | **Trustline de USDC + saldo** en la wallet del emisor |
| Registro DID | Registro de testnet | Registro de mainnet (un DID de testnet **no** funciona) |
| Bóveda | Desplegada en testnet | Debe desplegarse de nuevo en mainnet |
| Swagger UI | \`/docs\` disponible | Deshabilitado (devuelve 404) |

## Checklist

1. Cambia la URL base / constante del SDK a mainnet
2. Crea una API key de **mainnet**
3. Dale a la wallet del emisor una **trustline de USDC y saldo**
4. Registra (o deja que el auto-onboarding registre) el **DID del emisor en mainnet**
5. Crea la **bóveda del propietario en mainnet**
6. Emite una credencial de prueba y verifícala

## 1. Apunta a la API de mainnet

\`\`\`tsx
import { ActaConfig, mainNet } from "@acta-team/credentials";

<ActaConfig baseURL={mainNet} apiKey={process.env.NEXT_PUBLIC_ACTA_API_KEY_MAINNET}>
\`\`\`

El SDK infiere la red desde la URL. Si usas claves por variables de entorno, la variable específica de red es \`ACTA_API_KEY_MAINNET\`.

## 2. Crea una API key de mainnet

Las claves son **por red**: tu clave de testnet no funciona en mainnet. En la [ACTA dApp](https://dapp.acta.build), cambia la red a **Mainnet** en Settings y luego crea la clave en **API Keys**. Las mismas reglas que en testnet: una clave por wallet, se muestra una sola vez, expira a los 6 meses.

## 3. Fondea el emisor con USDC

En mainnet la comisión de emisión es **1 USDC por credencial**, cobrada on-chain al **emisor** en el momento de emitir vía el \`quote_fee\` del factory. Eso requiere que la wallet del emisor:

- Tenga una **trustline a USDC** (el Stellar Asset Contract que usa el factory es \`CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75\`)
- Tenga suficiente USDC para cubrir las credenciales que planeas emitir

Los dos fallos de emisión más comunes en mainnet son exactamente estos: *"trustline entry is missing for account"* y *"balance is not sufficient"*. Ambos vienen del contrato del token USDC, no de la bóveda; consulta **[Errores de contrato](doc:contract-errors)**.

## 4. Registra tu DID en mainnet

Los DID tienen alcance por red: \`did:stellar:testnet:...\` no resuelve en mainnet, y usarlo devuelve \`issuerDid_network_mismatch\`.

- **Con el SDK**: el auto-onboarding guarda identidades por red, así que el primer \`issue\` contra la API de mainnet acuña y registra un nuevo \`did:stellar:mainnet:...\` con una sola firma de wallet.
- **Con la dApp o la librería DID**: registra en mainnet explícitamente (consulta la **[sección DID](doc:did-overview)**). El registro de mainnet es \`CD6LSWW5ZSXOO5WAIHKQLQ262TW7BPI37PNEVMMA273BAPC65NN2AYXQ\`.

## 5. Recrea la bóveda

Las bóvedas también son por red: el factory en mainnet despliega una bóveda nueva para tu wallet la primera vez que llamas a \`createVault\` (o \`POST /contracts/vault/create\`) contra la API de mainnet. La derivación de direcciones es el mismo esquema determinista \`(factory, owner, userSalt)\`.

## Direcciones de contratos en mainnet

| Contrato | ID |
|----------|----|
| vc-vault-factory | \`CCWNZ6UMUXCDOVP2TWOPVLI4KP4VY4YF7VKPN6XLYVHNFAT24NDB33CX\` |
| Registro did:stellar | \`CD6LSWW5ZSXOO5WAIHKQLQ262TW7BPI37PNEVMMA273BAPC65NN2AYXQ\` |
| Hash WASM de la plantilla vc-vault | \`2bd0323a98acb8469606808368da6c79824f2dd8391494b94ddbeb3d22c1a957\` |
| USDC (token de la comisión, SAC) | \`CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75\` |

Passphrase de red: \`Public Global Stellar Network ; September 2015\`. Puedes confirmar todo esto en tiempo de ejecución con el \`GET /config\` público en la URL base de mainnet.

## Puntos a tener en cuenta

- **Swagger es solo de testnet**: \`https://production-api.acta.build/docs\` devuelve 404 por diseño. Explora en testnet; las rutas son idénticas.
- **Red de la wallet**: asegúrate de que tu wallet (p. ej. Freighter) esté en Mainnet antes de firmar, o las firmas llevarán la passphrase de red equivocada.
- **Mantén ambos entornos**: nada te obliga a abandonar testnet; úsalo para desarrollo siempre y reserva las claves de mainnet para producción.
    `,
};
