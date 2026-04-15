import type { DocPage } from "@/@types/docs";

export const gettingStarted: DocPage = {
  slug: "dapp-getting-started",
  title: "Primeros Pasos",
  section: "dApp",
  tocItems: [
    "Paso 1: Conectar Wallet",
    "Paso 2: Crear Bóveda",
    "Paso 3: Autorizar Emisores",
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
3. Selecciona tu wallet Stellar (Freighter, WalletConnect, etc.)
4. Aprueba la solicitud de conexión
5. Elige tu red:
   - **Testnet** - Para pruebas y desarrollo
   - **Mainnet** - Para uso en producción

Una vez conectado, tu dirección de wallet se mostrará en el header.

## Paso 2: Crear tu Bóveda Personal

Tu bóveda es tu almacenamiento seguro para credenciales. Cada dirección de wallet tiene su propia bóveda aislada.

1. Navega a la sección **Dashboard** o **Vault**
2. Si aún no tienes una bóveda, verás una opción para crear una
3. Haz clic en **Create Vault** o **Initialize Vault**
4. Firma la transacción con tu wallet
5. Tu bóveda ahora está lista para almacenar credenciales

La creación de la bóveda es una operación única por dirección de wallet.

## Paso 3: Autorizar Emisores

Antes de poder recibir credenciales, necesitas autorizar wallets que puedan emitir credenciales a tu bóveda.

1. Ve a la sección **Authorize** en el sidebar
2. Ingresa la dirección de wallet del emisor que quieres autorizar
3. Haz clic en **Authorize Issuer**
4. Firma la transacción con tu wallet
5. El emisor autorizado aparecerá en tu lista de emisores autorizados

**Nota:** Solo los emisores autorizados pueden crear credenciales en tu bóveda. Esto te da control sobre quién puede emitir credenciales para ti.

## Paso 4: Emitir Credenciales

Una vez que tengas una bóveda y emisores autorizados, puedes comenzar a emitir credenciales.

1. Navega a la sección **Issue**
2. Completa el formulario de credencial:
   - **Credential ID** - Identificador único
   - **Credential Data** - La información real de la credencial (formato JSON)
   - **Owner** - La dirección de wallet que recibirá la credencial
   - **Issuer DID** (opcional) - Tu DID de emisor
3. Haz clic en **Issue Credential**
4. Firma la transacción con tu wallet
5. La credencial se almacenará en la bóveda del propietario y se marcará como válida

La credencial ahora está on-chain y puede ser verificada por cualquiera.

## Siguientes pasos

Después de completar la configuración inicial:

- **Ver Credenciales** - Ve a la sección **Vault** o **Credentials** para ver todas tus credenciales
- **Compartir Credenciales** - Usa la función de compartir para crear enlaces compartibles con pruebas ZK
- **Gestionar API Keys** - Crea API keys para acceso programático en la sección **API Keys**
- **Explorar Tutoriales** - Revisa la sección **Tutorials** para guías paso a paso

Para más información sobre funcionalidades específicas, consulta la guía de [Funcionalidades del dApp](#dapp-features).
    `,
};
