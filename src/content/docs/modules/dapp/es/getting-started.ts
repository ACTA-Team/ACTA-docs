import type { DocPage } from "@/@types/docs";

export const gettingStarted: DocPage = {
  slug: "dapp-getting-started",
  title: "Primeros Pasos",
  section: "dApp",
  tocItems: [
    "Paso 1: Conectar Wallet",
    "Paso 2: Crear Bóveda",
    "Paso 3: Registrar tu DID",
    "Paso 4: Emitir Credenciales",
    "Gestionar el Acceso de Emisores",
    "Siguientes pasos",
  ],
  content: `
# Primeros Pasos con el dApp de ACTA

Sigue estos pasos para comenzar a usar el dApp de ACTA para la gestión de credenciales.

## Paso 1: Conectar Wallet y Elegir Red

El primer paso es conectar tu wallet Stellar al dApp.

1. Visita [https://dapp.acta.build](https://dapp.acta.build)
2. Haz clic en el botón de conexión de wallet
3. Selecciona tu wallet Stellar
4. Aprueba la solicitud de conexión
5. Elige tu red:
   - **Testnet** - Para pruebas y desarrollo
   - **Mainnet** - Para uso en producción

Una vez conectado, tu dirección de wallet se mostrará en el header.

## Paso 2: Crear tu Bóveda Personal

Tu bóveda es tu almacenamiento seguro para credenciales. Cada propietario tiene su **propia** bóveda mono-inquilino, desplegada de forma determinista por el \`vc-vault-factory\`.

1. Navega a la sección **Dashboard** o **Vault**
2. Si aún no tienes una bóveda, verás una opción para crear una
3. Haz clic en **Create Vault** o **Initialize Vault**
4. Firma la transacción con tu wallet
5. Tu bóveda ahora está lista para almacenar credenciales

La creación de la bóveda es una operación única por propietario.

## Paso 3: Registrar tu DID

Para **emitir** credenciales debes controlar un \`did:stellar\` registrado y resoluble. (No necesitas autorizar emisores — la emisión es abierta por defecto.)

1. Ve a la sección **Mi DID** en el sidebar
2. Si aún no tienes un \`did:stellar\`, sigue la indicación para registrar uno
3. Firma la transacción de registro con tu wallet
4. El controlador on-chain de tu DID debe coincidir con tu wallet emisora — el dApp gestiona este vínculo por ti

**Nota:** Las direcciones de wallet planas y \`did:pkh\` ya no se aceptan como DID del emisor.

## Paso 4: Emitir Credenciales

Una vez que tengas una bóveda y un DID registrado, puedes comenzar a emitir credenciales.

1. Navega a la sección **Issue**
2. Completa el formulario de credencial:
   - **Credential ID** - Identificador único
   - **Credential Data** - La información real de la credencial en formato JSON
   - **Owner** - La dirección de wallet cuya bóveda recibirá la credencial
   - **Issuer DID** - Tu \`did:stellar\` registrado
3. Haz clic en **Issue Credential**
4. Firma la transacción con tu wallet (se te cobra una tarifa on-chain, por defecto 1 USDC, como emisor)
5. La credencial se almacenará en la bóveda del propietario y se marcará como válida

La credencial ahora está on-chain y puede ser verificada.

## Gestionar el Acceso de Emisores

Como la emisión es abierta por defecto, solo actúas cuando quieres **detener** a un emisor:

1. Ve a la sección **Acceso de emisores** en el sidebar
2. Ingresa la dirección de wallet del emisor que quieres bloquear, luego **Bloquéalo** (y firma)
3. Para restaurar el acceso más tarde, **Desbloquea** al emisor (y firma)

Los emisores bloqueados ya no pueden escribir en tu bóveda; el resto puede emitir libremente.

## Siguientes pasos

Después de completar la configuración inicial:

- **Ver Credenciales** - Ve a la sección **Vault** o **Credentials** para ver todas tus credenciales
- **Compartir Credenciales** - Usa la función de compartir para crear enlaces con campos seleccionados de la credencial
- **Gestionar API Keys** - Crea API keys para acceso programático en la sección **API Keys**
- **Explorar Tutoriales** - Revisa la sección **Tutorials** para guías paso a paso

Para más información sobre funcionalidades específicas, consulta la guía de [Funcionalidades del dApp](#dapp-features).
    `,
};
