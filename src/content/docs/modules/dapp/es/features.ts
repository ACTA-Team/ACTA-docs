import type { DocPage } from "@/@types/docs";

export const features: DocPage = {
  slug: "dapp-features",
  title: "Funcionalidades",
  section: "dApp",
  tocItems: [
    "Emitir Credenciales",
    "Gestión de Bóveda",
    "Compartir Credenciales",
    "Acceso de Emisores",
    "Gestión de API Keys",
  ],
  content: `
# Funcionalidades del dApp

Vista de las funcionalidades documentadas disponibles en el dApp de ACTA.

## Emitir Credenciales

Crea y emite credenciales verificables a una dirección de wallet Stellar. Emitir requiere una identidad de emisor **did:stellar** registrada y resoluble (no una simple dirección de wallet) y cobra una tarifa on-chain pagada por el emisor (en mainnet, 1 USDC por credencial).

### Cómo Emitir

1. Navega a **Issue** en el sidebar
2. Completa el formulario de credencial:
   - **Credential ID**: Identificador único para la credencial
   - **Credential Data**: Datos JSON que contienen la información de la credencial
   - **Owner**: Dirección de wallet Stellar (G...) cuya bóveda recibirá la credencial
   - **Issuer DID** (opcional): Tu identidad de emisor did:stellar registrada
3. Haz clic en **Issue Credential**
4. Firma la transacción

La credencial se:
- Almacena automáticamente en la bóveda del propietario
- Marca como válida on-chain
- Hace disponible para verificación

## Gestión de Bóveda

Tu bóveda es tu almacenamiento personal de credenciales. Cada wallet tiene una bóveda aislada.

### Ver Credenciales

1. Ve a la sección **Vault** o **Credentials**
2. Ve todas las credenciales almacenadas en tu bóveda
3. Usa búsqueda y filtros para encontrar credenciales específicas
4. Haz clic en una credencial para ver detalles

### Acciones de Credenciales

- **Ver Detalles** - Ver información completa de la credencial
- **Compartir** - Crear un enlace compartible con divulgación selectiva de campos
- **Revocar** - Revocar una credencial si es necesario
- **Verificar** - Verificar el estado on-chain

## Compartir Credenciales

Comparte credenciales eligiendo qué campos revelar.

### Flujo de Compartición

1. Ve a tu **Vault** y selecciona una credencial
2. Haz clic en **Share**
3. Elige qué campos revelar
4. Copia el enlace de compartir

El enlace de compartir contiene los campos seleccionados que necesita el destinatario.

## Acceso de Emisores

La emisión está abierta por defecto: cualquiera puede emitir credenciales a tu bóveda a menos que lo bloquees. Usa esta sección para bloquear a los emisores que quieras detener y desbloquearlos luego para restaurar su acceso.

### Bloquear un Emisor

1. Ve a la sección **Issuer Access**
2. Ingresa el emisor que quieres bloquear
3. Haz clic en **Block Issuer**
4. Firma la transacción

### Gestionar Emisores Bloqueados

- Ver todos los emisores bloqueados
- Desbloquear un emisor para restaurar su acceso
- Cualquiera puede emitir hacia ti a menos que lo bloquees (denegación por excepción)

## Gestión de API Keys

Crea y gestiona API keys para acceso programático a la API de ACTA.

### Crear API Key

1. Navega a la sección **API Keys**
2. Elige la red (Testnet o Mainnet)
3. Ingresa un nombre para tu API key (opcional)
4. Haz clic en **Create API Key**
5. **Guarda la key inmediatamente** - no se mostrará de nuevo

Las API keys tienen:
- **Rol estándar** - Acceso a endpoints públicos
- **Expiración de 6 meses** - Las keys expiran después de 6 meses
- **Específicas de red** - Keys separadas para testnet y mainnet

### Usar API Keys

Usa tu API key en solicitudes a la API:

\`\`\`
X-ACTA-Key: tu_api_key_aqui
\`\`\`

Consulta la [Referencia API](#api-overview) para todos los endpoints disponibles.
    `,
};
