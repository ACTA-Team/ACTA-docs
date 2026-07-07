import type { DocPage } from "@/@types/docs";

export const gettingStarted: DocPage = {
  slug: "dapp-getting-started",
  title: "Primeros Pasos",
  section: "dApp",
  tocItems: [
    "Paso 1: Conectar Wallet",
    "Paso 2: Crear API Key",
    "Paso 3: Registrar DID de Emisor",
    "Paso 4: Crear Bóveda",
    "Paso 5: Emitir Credenciales",
    "Gestionar Acceso de Emisores",
    "Siguientes pasos",
  ],
  content: `
# Primeros Pasos con el dApp de ACTA

Sigue estos pasos para comenzar a usar el dApp de ACTA para la gestión de credenciales.

## Paso 1: Conectar Wallet y Elegir Red

El primer paso es conectar tu wallet Stellar al dApp.

1. Visita [https://dapp.acta.build](https://dapp.acta.build)
2. Haz clic en el botón de conexión de wallet
3. Selecciona tu wallet Stellar - se admiten **Freighter**, **Albedo** y **WalletConnect**
4. Aprueba la solicitud de conexión
5. Elige tu red (en **Settings**):
   - **Testnet** - Para pruebas y desarrollo (la opción por defecto)
   - **Mainnet** - Para uso en producción

Una vez conectado, tu dirección de wallet se mostrará en el header. En tu primera visita, un tour guiado te muestra las secciones principales.

## Paso 2: Crear tu API Key

Las operaciones de bóveda y credenciales del dApp pasan por la API de ACTA, así que primero necesitas una API key.

1. Navega a la sección **API Keys**
2. Haz clic en **Create API Key** y dale un nombre (opcional)
3. **Guarda la key de inmediato** - se muestra solo una vez

Obtienes **una key por wallet por red**; crear una nueva reemplaza (revoca) la key anterior. El dApp conserva la key solo durante tu sesión actual del navegador.

## Paso 3: Registrar tu DID de Emisor

Para emitir credenciales, el emisor necesita una identidad **did:stellar** registrada y resoluble (no una simple dirección de wallet). El dApp te guía en su registro con una única firma de wallet. Si solo planeas recibir y guardar credenciales, puedes saltarte este paso.

## Paso 4: Crear tu Bóveda Personal

Tu bóveda es tu almacenamiento seguro para credenciales. Cada propietario tiene su propio contrato de bóveda dedicado de un solo inquilino, desplegado de forma determinista por un factory tras bambalinas.

1. Navega a la sección **Dashboard** o **Vault**
2. Si aún no tienes una bóveda, verás una opción para crear una
3. Haz clic en **Create Vault** o **Initialize Vault**
4. Firma la transacción con tu wallet
5. Tu bóveda ahora está lista para almacenar credenciales

La creación de la bóveda es una operación única por dirección de wallet.

## Paso 5: Emitir Credenciales

Una vez que tengas una bóveda, puedes comenzar a emitir credenciales. Emitir cobra una tarifa on-chain pagada por el emisor (mainnet: 1 USDC por credencial; testnet: 5 XLM).

1. Navega a la sección **Issue**
2. Elige una **plantilla** (plantillas integradas como certificados de curso o membresías, o tu propia plantilla personalizada)
3. Completa los campos de la plantilla y la **dirección de wallet del destinatario** (cuya bóveda recibirá la credencial)
4. Haz clic en **Issue Credential**
5. Firma la transacción con tu wallet
6. La credencial se almacenará en la bóveda del destinatario y se marcará como válida

La bóveda del propietario recibe la credencial, mientras que el titular se identifica mediante un DID (el \`credentialSubject.id\`); no hay un campo separado de wallet o de titular. La credencial ahora está on-chain y puede ser verificada.

## Gestionar Acceso de Emisores

La emisión está **abierta por defecto**: cualquier emisor puede emitir credenciales a tu bóveda sin aprobación previa, así que no necesitas pre-autorizar a nadie. Solo gestionas el acceso cuando quieres detener a un emisor específico.

1. Ve a la sección **Issuer Access** en el sidebar
2. Ingresa el emisor que quieres **bloquear**
3. Haz clic en **Block Issuer** y firma la transacción con tu wallet
4. El emisor bloqueado ya no puede emitir credenciales a tu bóveda
5. Para restaurar el acceso, **desbloquea** al emisor en cualquier momento

**Nota:** Como la emisión está abierta por defecto, el bloqueo es un control de denegación por excepción. Cualquiera puede emitir hacia ti a menos que lo bloquees explícitamente.

## Siguientes pasos

Después de completar la configuración inicial:

- **Ver Credenciales** - Ve a la sección **Vault** para ver todas tus credenciales
- **Compartir Credenciales** - Usa la función de compartir para crear enlaces y códigos QR con campos seleccionados de la credencial; cualquiera puede revisarlos en la página pública de verificación
- **Notificaciones** - Atento al ícono de campana para eventos como nuevas credenciales recibidas
- **Explorar Configuración** - Cambia de red o de idioma (inglés, español, francés)

Para más información sobre funcionalidades específicas, consulta la guía de [Funcionalidades del dApp](#dapp-features).
    `,
};
