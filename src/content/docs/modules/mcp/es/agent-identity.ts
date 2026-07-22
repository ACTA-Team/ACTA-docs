import type { DocPage } from "@/@types/docs";

export const agentIdentity: DocPage = {
  slug: "agent-identity",
  title: "Identidad para Agentes de IA",
  section: "IA",
  tocItems: [
    "El problema",
    "Los primitivos de ACTA aplicados a agentes",
    "Anatomía de una credencial de agente",
    "Patrones de integración",
    "Consideraciones de seguridad",
    "Estado y siguientes pasos",
  ],
  content: `
# Identidad para agentes de IA

A medida que los agentes de IA actúan de forma más autónoma (llaman APIs, mueven fondos, hablan con otros agentes), aparece una pregunta de confianza: **¿cómo prueba un agente quién es, quién lo opera y qué tiene permitido hacer?** ACTA aborda esto con los mismos primitivos que usa para personas y organizaciones.

> Esta página es conceptual y describe patrones. Los primitivos que menciona (DIDs, bóvedas y credenciales) existen hoy en ACTA; el empaquetado específico para agentes es un patrón de integración, no un endpoint nuevo.

## El problema

Una API key identifica a un cliente, pero no dice nada verificable sobre el agente detrás de ella: quién lo desplegó, bajo qué organización opera, qué alcance tiene o si sigue autorizado. Cuando dos agentes interactúan, o cuando un servicio recibe la petición de un agente, hace falta una prueba **portátil y verificable**, no una confianza implícita en una credencial compartida.

## Los primitivos de ACTA aplicados a agentes

- **DID (\`did:stellar\`):** el agente obtiene un identificador descentralizado propio, independiente de cualquier plataforma. Es su "quién" verificable. Ver [DID](/es/did-overview).
- **Credenciales verificables:** el operador (una persona u organización con su propio DID) emite credenciales al DID del agente que declaran su rol, permisos y vigencia.
- **Bóveda:** almacena y gestiona las credenciales del agente de forma consultable y revocable. Ver [useVault](/es/useVault).

La cadena de confianza queda: **operador (emisor) firma una credencial para el DID del agente, y cualquier verificador puede comprobar la firma y la vigencia** sin depender de ACTA como intermediario en línea.

## Anatomía de una credencial de agente

Una credencial de agente típicamente declara:

- **subject:** el DID del agente.
- **issuer:** el DID del operador (persona u organización responsable).
- **claims:** rol o propósito, alcance de permisos, límites (por ejemplo, montos o dominios), y fecha de expiración.
- **estado:** activa o revocada, verificable en el momento del uso.

Esto convierte "confía en este agente" en algo comprobable: quién responde por él, qué puede hacer y hasta cuándo.

## Patrones de integración

1. **Onboarding del agente:** al desplegar un agente, crea su DID y emite una credencial inicial desde el DID del operador con el alcance mínimo necesario.
2. **Presentación:** el agente presenta su credencial (o una prueba derivada) al servicio o agente con el que interactúa.
3. **Verificación:** el verificador comprueba la firma del emisor, el alcance y el estado de revocación antes de actuar. Ver [Verificar Credenciales](/es/verify-credentials).
4. **Rotación y revocación:** si el agente se compromete o cambia su alcance, el operador revoca o reemite. La revocación es inmediata para futuras verificaciones.

## Consideraciones de seguridad

- **Mínimo privilegio:** emite el alcance más acotado posible y prefiere credenciales de vida corta con reemisión.
- **Separación de llaves:** la llave de firma del operador nunca debe vivir dentro del agente. El agente porta credenciales, no la capacidad de emitirlas.
- **Sin autonomía en operaciones sensibles:** emitir, revocar o firmar transacciones de valor debe requerir aprobación del operador, no quedar en el bucle autónomo del modelo.
- **Auditabilidad:** registra qué credencial presentó el agente en cada acción relevante.

## Estado y siguientes pasos

Los bloques base (DID, bóvedas, credenciales, verificación) están documentados y disponibles hoy. Si quieres construir un flujo de identidad de agentes, empieza por [DID](/es/did-overview) y [Verificar Credenciales](/es/verify-credentials), y usa [Recetas de prompts](/es/ai-prompts) para que tu asistente te guíe con la documentación oficial.
  `,
};
