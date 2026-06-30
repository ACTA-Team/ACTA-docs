import type { DocPage } from "@/@types/docs";

export const gettingStarted: DocPage = {
  slug: "dapp-getting-started",
  title: "Primeros Pasos",
  section: "dApp",
  tocItems: [
    "Paso 1: Conectar Wallet",
    "Paso 2: Crear Bóveda",
    "Paso 3: Gestionar Acceso de Emisores",
    "Paso 4: Emitir Credenciales",
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

Tu bóveda es tu almacenamiento seguro para credenciales. Cada propietario tiene su propio contrato de bóveda dedicado de un solo inquilino, desplegado de forma determinista por un factory tras bambalinas.

1. Navega a la sección **Dashboard** o **Vault**
2. Si aún no tienes una bóveda, verás una opción para crear una
3. Haz clic en **Create Vault** o **Initialize Vault**
4. Firma la transacción con tu wallet
5. Tu bóveda ahora está lista para almacenar credenciales

La creación de la bóveda es una operación única por dirección de wallet.

## Paso 3: Gestionar Acceso de Emisores

La emisión está **abierta por defecto**: cualquier emisor puede emitir credenciales a tu bóveda sin aprobación previa, así que no necesitas pre-autorizar a nadie. Solo gestionas el acceso cuando quieres detener a un emisor específico.

1. Ve a la sección **Issuer Access** en el sidebar
2. Ingresa el emisor que quieres **bloquear**
3. Haz clic en **Block Issuer** y firma la transacción con tu wallet
4. El emisor bloqueado ya no puede emitir credenciales a tu bóveda
5. Para restaurar el acceso, **desbloquea** al emisor en cualquier momento

**Nota:** Como la emisión está abierta por defecto, el bloqueo es un control de denegación por excepción. Cualquiera puede emitir hacia ti a menos que lo bloquees explícitamente.

## Paso 4: Emitir Credenciales

Una vez que tengas una bóveda, puedes comenzar a emitir credenciales. Emitir requiere que el emisor tenga una identidad **did:stellar** registrada y resoluble (no una simple dirección de wallet); el dApp te guía en su configuración. Emitir también cobra una tarifa on-chain pagada por el emisor (en mainnet, 1 USDC por credencial).

1. Navega a la sección **Issue**
2. Completa el formulario de credencial:
   - **Credential ID** - Identificador único
   - **Credential Data** - La información real de la credencial en formato JSON
   - **Owner** - La dirección de wallet cuya bóveda recibirá la credencial
   - **Issuer DID** (opcional) - Tu identidad de emisor did:stellar registrada
3. Haz clic en **Issue Credential**
4. Firma la transacción con tu wallet
5. La credencial se almacenará en la bóveda del propietario y se marcará como válida

La bóveda del propietario recibe la credencial, mientras que el titular se identifica mediante un DID (el \`credentialSubject.id\`); no hay un campo separado de wallet o de titular. La credencial ahora está on-chain y puede ser verificada.

## Siguientes pasos

Después de completar la configuración inicial:

- **Ver Credenciales** - Ve a la sección **Vault** o **Credentials** para ver todas tus credenciales
- **Compartir Credenciales** - Usa la función de compartir para crear enlaces con campos seleccionados de la credencial
- **Gestionar API Keys** - Crea API keys para acceso programático en la sección **API Keys**
- **Explorar Tutoriales** - Revisa la sección **Tutorials** para guías paso a paso

Para más información sobre funcionalidades específicas, consulta la guía de [Funcionalidades del dApp](#dapp-features).
    `,
};
