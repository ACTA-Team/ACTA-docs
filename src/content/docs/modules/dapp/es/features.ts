import type { DocPage } from "@/@types/docs";

export const features: DocPage = {
  slug: "dapp-features",
  title: "Funcionalidades",
  section: "dApp",
  tocItems: [
    "Emitir Credenciales",
    "Gestión de Bóveda",
    "Compartir Credenciales",
    "Autorizar Emisores",
    "Gestión de API Keys",
    "Pruebas de Conocimiento Cero",
  ],
  content: `
# Funcionalidades del dApp

Vista detallada de todas las funcionalidades disponibles en el dApp de ACTA.

## Emitir Credenciales

Crea y emite credenciales verificables a cualquier dirección de wallet Stellar.

### Cómo Emitir

1. Navega a **Issue** en el sidebar
2. Completa el formulario de credencial:
   - **Credential ID**: Identificador único para la credencial
   - **Credential Data**: Datos JSON que contienen la información de la credencial
   - **Owner**: Dirección de wallet Stellar (G...) que recibirá la credencial
   - **Issuer DID** (opcional): Tu identificador DID
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

Comparte credenciales con pruebas de conocimiento cero que preservan la privacidad.

### Flujo de Compartición

1. Ve a tu **Vault** y selecciona una credencial
2. Haz clic en el botón **Share**
3. Elige qué campos revelar
4. Selecciona un predicado ZK (opcional):
   - Edad ≥ 18
   - No expirado
   - Estado es válido
5. Haz clic en **Generate ZK Proof**
6. Copia el enlace de compartir

El enlace de compartir contiene:
- Solo los campos seleccionados revelados
- Prueba ZK para el predicado seleccionado
- Señales públicas para verificación

Los destinatarios pueden verificar la prueba sin ver tus datos privados.

## Autorizar Emisores

Controla quién puede emitir credenciales a tu bóveda.

### Autorizar un Emisor

1. Ve a la sección **Authorize**
2. Ingresa la dirección de wallet del emisor
3. Haz clic en **Authorize Issuer**
4. Firma la transacción

### Gestionar Emisores Autorizados

- Ver todos los emisores autorizados
- Revocar autorización si es necesario
- Solo los emisores autorizados pueden crear credenciales en tu bóveda

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

## Pruebas de Conocimiento Cero

El dApp soporta compartir credenciales con pruebas de conocimiento cero para verificación que preserva la privacidad. Consulta la sección [Pruebas de Conocimiento Cero](#zk-overview) para información detallada sobre circuitos ZK, predicados y verificación.
    `,
};
