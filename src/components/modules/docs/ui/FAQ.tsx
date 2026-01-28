"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  HelpCircle,
  ChevronDown,
  Sparkles,
  Loader2,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

// Simple markdown parser for bold text and code blocks
function parseMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Check for code blocks (```)
    const codeBlockMatch = remaining.match(/```(\w*)\n?([\s\S]*?)```/);
    // Check for inline code (`)
    const inlineCodeMatch = remaining.match(/`([^`]+)`/);
    // Check for bold (**)
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);

    // Find the earliest match
    const matches = [
      { match: codeBlockMatch, type: "codeBlock" },
      { match: inlineCodeMatch, type: "inlineCode" },
      { match: boldMatch, type: "bold" },
    ].filter(m => m.match !== null);

    if (matches.length === 0) {
      parts.push(remaining);
      break;
    }

    // Sort by index to find earliest
    matches.sort((a, b) => (a.match?.index || 0) - (b.match?.index || 0));
    const earliest = matches[0];
    const match = earliest.match!;
    const index = match.index || 0;

    // Add text before the match
    if (index > 0) {
      parts.push(remaining.slice(0, index));
    }

    // Add the formatted element
    if (earliest.type === "codeBlock") {
      parts.push(
        <pre
          key={key++}
          className="bg-secondary/50 rounded-md p-3 my-2 overflow-x-auto text-xs"
        >
          <code>{match[2]}</code>
        </pre>
      );
      remaining = remaining.slice(index + match[0].length);
    } else if (earliest.type === "inlineCode") {
      parts.push(
        <code
          key={key++}
          className="bg-secondary/70 px-1.5 py-0.5 rounded text-xs font-mono"
        >
          {match[1]}
        </code>
      );
      remaining = remaining.slice(index + match[0].length);
    } else if (earliest.type === "bold") {
      parts.push(
        <strong key={key++} className="font-semibold text-foreground">
          {match[1]}
        </strong>
      );
      remaining = remaining.slice(index + match[0].length);
    }
  }

  return parts;
}

// Component to render parsed markdown
function FormattedText({ text }: { text: string }) {
  // Split by newlines to handle line breaks
  const lines = text.split("\n");

  return (
    <>
      {lines.map((line, i) => (
        <React.Fragment key={i}>
          {parseMarkdown(line)}
          {i < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  );
}

interface Reference {
  title: string;
  url: string;
  type: "docs" | "external";
}

interface FAQData {
  answer: {
    en: string;
    es: string;
  };
  references: Reference[];
}

// Predefined FAQ data with answers and references
const faqData: FAQData[] = [
  {
    // What is ACTA and what problem does it solve?
    answer: {
      en: "ACTA is a Verifiable Credentials Infrastructure built on the Stellar blockchain. It solves the problem of digital identity and credential management by providing a decentralized, non-custodial system for issuing, verifying, and storing credentials. With ACTA, organizations can issue W3C Verifiable Credentials 2.0 compliant credentials, users maintain full control over their data in encrypted vaults, and verifiers can trustlessly verify credentials on-chain.",
      es: "ACTA es una Infraestructura de Credenciales Verificables construida sobre la blockchain de Stellar. Resuelve el problema de la identidad digital y gestión de credenciales proporcionando un sistema descentralizado y no custodial para emitir, verificar y almacenar credenciales. Con ACTA, las organizaciones pueden emitir credenciales compatibles con W3C Verifiable Credentials 2.0, los usuarios mantienen control total sobre sus datos en bóvedas cifradas, y los verificadores pueden verificar credenciales on-chain sin necesidad de confianza.",
    },
    references: [
      { title: "Introduction", url: "introduction", type: "docs" },
      { title: "Architecture", url: "architecture", type: "docs" },
      {
        title: "W3C VC Data Model 2.0",
        url: "https://www.w3.org/TR/vc-data-model-2.0/",
        type: "external",
      },
      {
        title: "Stellar Blockchain",
        url: "https://stellar.org/",
        type: "external",
      },
    ],
  },
  {
    // How do I integrate ACTA with my application?
    answer: {
      en: "You can integrate ACTA with your application in two ways:\n\n1. **React SDK**: Use our React hooks (useCredential, useVault, useVaultRead) for seamless frontend integration. Install with `npm install @aspect/acta-sdk`.\n\n2. **REST API**: Use our comprehensive API endpoints for backend integration. You'll need an API key which you can obtain from the ACTA dashboard.\n\nBoth methods support credential issuance, verification, vault management, and more. Start with the Getting Started guide for step-by-step instructions.",
      es: "Puedes integrar ACTA con tu aplicación de dos formas:\n\n1. **React SDK**: Usa nuestros hooks de React (useCredential, useVault, useVaultRead) para una integración frontend sin problemas. Instala con `npm install @aspect/acta-sdk`.\n\n2. **API REST**: Usa nuestros endpoints API completos para integración backend. Necesitarás una API key que puedes obtener desde el dashboard de ACTA.\n\nAmbos métodos soportan emisión de credenciales, verificación, gestión de bóvedas y más. Comienza con la guía de Primeros Pasos para instrucciones paso a paso.",
    },
    references: [
      { title: "Getting Started", url: "getting-started", type: "docs" },
      { title: "SDK Overview", url: "sdk-overview", type: "docs" },
      { title: "API Overview", url: "api-overview", type: "docs" },
      { title: "ACTA dApp", url: "https://dapp.acta.build/", type: "external" },
    ],
  },
  {
    // What are verifiable credentials and how do they work?
    answer: {
      en: "Verifiable Credentials (VCs) are tamper-evident digital credentials that can be cryptographically verified. In ACTA:\n\n1. **Issuance**: An issuer creates a credential, signs it, and anchors a hash on-chain via the Issuance Contract.\n\n2. **Storage**: The credential is encrypted and stored in the holder's vault, giving them full control.\n\n3. **Verification**: Anyone can verify the credential's authenticity by checking the on-chain hash and cryptographic signatures.\n\n4. **Revocation**: Issuers can revoke credentials when needed, and this status is verifiable on-chain.",
      es: "Las Credenciales Verificables (VCs) son credenciales digitales a prueba de manipulación que pueden ser verificadas criptográficamente. En ACTA:\n\n1. **Emisión**: Un emisor crea una credencial, la firma y ancla un hash on-chain a través del Contrato de Emisión.\n\n2. **Almacenamiento**: La credencial se cifra y almacena en la bóveda del titular, dándole control total.\n\n3. **Verificación**: Cualquiera puede verificar la autenticidad de la credencial comprobando el hash on-chain y las firmas criptográficas.\n\n4. **Revocación**: Los emisores pueden revocar credenciales cuando sea necesario, y este estado es verificable on-chain.",
    },
    references: [
      { title: "Architecture", url: "architecture", type: "docs" },
      { title: "Credential Operations", url: "api-credentials", type: "docs" },
      { title: "useCredential Hook", url: "useCredential", type: "docs" },
      {
        title: "W3C VC Data Model",
        url: "https://www.w3.org/TR/vc-data-model-2.0/",
        type: "external",
      },
    ],
  },
  {
    // How does the vault system work?
    answer: {
      en: "The ACTA vault system provides secure, user-controlled credential storage:\n\n1. **Initialization**: Each user gets a unique vault deployed on Stellar/Soroban.\n\n2. **Storage**: Credentials are encrypted client-side before being stored.\n\n3. **Access Control**: Only the vault owner (admin) can access their credentials.\n\n4. **Issuer Authorization**: Vault owners can authorize specific issuers to store credentials.\n\n5. **Operations**: List, get, verify, and transfer credentials between vaults.\n\nUse the useVault and useVaultRead hooks in React, or the Vault API endpoints for full vault management.",
      es: "El sistema de bóvedas de ACTA proporciona almacenamiento seguro de credenciales controlado por el usuario:\n\n1. **Inicialización**: Cada usuario obtiene una bóveda única desplegada en Stellar/Soroban.\n\n2. **Almacenamiento**: Las credenciales se cifran del lado del cliente antes de almacenarse.\n\n3. **Control de Acceso**: Solo el propietario de la bóveda (admin) puede acceder a sus credenciales.\n\n4. **Autorización de Emisores**: Los propietarios pueden autorizar emisores específicos para almacenar credenciales.\n\n5. **Operaciones**: Listar, obtener, verificar y transferir credenciales entre bóvedas.\n\nUsa los hooks useVault y useVaultRead en React, o los endpoints de la API de Vault para gestión completa.",
    },
    references: [
      { title: "Architecture", url: "architecture", type: "docs" },
      { title: "useVault Hook", url: "useVault", type: "docs" },
      { title: "useVaultRead Hook", url: "useVaultRead", type: "docs" },
      { title: "Vault Operations (Read)", url: "api-vault-read", type: "docs" },
      {
        title: "Vault Operations (Write)",
        url: "api-vault-write",
        type: "docs",
      },
    ],
  },
  {
    // What blockchain does ACTA use?
    answer: {
      en: "ACTA is built on the **Stellar blockchain**, specifically using **Soroban** - Stellar's smart contract platform. This provides:\n\n- **Low fees**: Transactions cost fractions of a cent\n- **Fast finality**: ~5 second transaction times\n- **Scalability**: High throughput for enterprise use\n- **Security**: Battle-tested blockchain infrastructure\n- **Interoperability**: Connect with the broader Stellar ecosystem\n\nACTA contracts (Issuance and Vault) are deployed on Soroban and interact via the Stellar network.",
      es: "ACTA está construido sobre la **blockchain de Stellar**, específicamente usando **Soroban** - la plataforma de contratos inteligentes de Stellar. Esto proporciona:\n\n- **Bajas comisiones**: Las transacciones cuestan fracciones de centavo\n- **Finalidad rápida**: ~5 segundos de tiempo de transacción\n- **Escalabilidad**: Alto rendimiento para uso empresarial\n- **Seguridad**: Infraestructura blockchain probada en batalla\n- **Interoperabilidad**: Conexión con el ecosistema Stellar más amplio\n\nLos contratos de ACTA (Emisión y Vault) están desplegados en Soroban e interactúan a través de la red Stellar.",
    },
    references: [
      { title: "Architecture", url: "architecture", type: "docs" },
      { title: "Contract Info API", url: "api-contract-info", type: "docs" },
      { title: "Stellar.org", url: "https://stellar.org/", type: "external" },
      {
        title: "Soroban Docs",
        url: "https://soroban.stellar.org/docs",
        type: "external",
      },
    ],
  },
  {
    // How do I get started with the React SDK?
    answer: {
      en: "To get started with the ACTA React SDK:\n\n```bash\nnpm install @aspect/acta-sdk\n```\n\nThen wrap your app with the provider and use the hooks:\n\n```jsx\nimport { ActaProvider, useCredential, useVault } from '@aspect/acta-sdk';\n\n// In your component:\nconst { issue, verify } = useCredential();\nconst { initialize, store, list } = useVault();\n```\n\nThe SDK provides three main hooks:\n- **useCredential**: Issue and verify credentials\n- **useVault**: Full vault management\n- **useVaultRead**: Read-only vault operations\n\nCheck the SDK documentation for detailed examples and API reference.",
      es: "Para comenzar con el SDK de React de ACTA:\n\n```bash\nnpm install @aspect/acta-sdk\n```\n\nLuego envuelve tu app con el provider y usa los hooks:\n\n```jsx\nimport { ActaProvider, useCredential, useVault } from '@aspect/acta-sdk';\n\n// En tu componente:\nconst { issue, verify } = useCredential();\nconst { initialize, store, list } = useVault();\n```\n\nEl SDK proporciona tres hooks principales:\n- **useCredential**: Emitir y verificar credenciales\n- **useVault**: Gestión completa de bóvedas\n- **useVaultRead**: Operaciones de bóveda de solo lectura\n\nRevisa la documentación del SDK para ejemplos detallados y referencia de la API.",
    },
    references: [
      { title: "SDK Overview", url: "sdk-overview", type: "docs" },
      { title: "useCredential", url: "useCredential", type: "docs" },
      { title: "useVault", url: "useVault", type: "docs" },
      { title: "useVaultRead", url: "useVaultRead", type: "docs" },
      { title: "Getting Started", url: "getting-started", type: "docs" },
      {
        title: "GitHub - ACTA Team",
        url: "https://github.com/ACTA-Team",
        type: "external",
      },
    ],
  },
];

interface FAQItemProps {
  question: string;
  isOpen: boolean;
  isLoading: boolean;
  answer: string | null;
  references: Reference[];
  onToggle: () => void;
  onNavigate: (slug: string) => void;
}

function FAQItem({
  question,
  isOpen,
  isLoading,
  answer,
  references,
  onToggle,
  onNavigate,
}: FAQItemProps) {
  const { t } = useI18n();

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-secondary/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <HelpCircle className="w-5 h-5 text-primary shrink-0" />
          <span className="text-sm font-medium text-foreground">
            {question}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-[800px]" : "max-h-0"
        )}
      >
        <div className="px-4 pb-4 pt-2 border-t border-border">
          {isLoading ? (
            <div className="flex items-center gap-2 py-4">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
              <span className="text-sm text-muted-foreground">
                {t.loadingAnswer}
              </span>
            </div>
          ) : answer ? (
            <div className="space-y-4">
              {/* Answer */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs text-primary font-medium">
                    {t.aiPowered}
                  </span>
                </div>
                <div className="text-sm text-foreground/90 leading-relaxed">
                  <FormattedText text={answer} />
                </div>
              </div>

              {/* References */}
              {references.length > 0 && (
                <div className="pt-3 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    {t.relatedPages}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {references.map((ref, idx) =>
                      ref.type === "docs" ? (
                        <button
                          key={idx}
                          onClick={() => onNavigate(ref.url)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
                        >
                          <BookOpen className="w-3 h-3" />
                          {ref.title}
                        </button>
                      ) : (
                        <a
                          key={idx}
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-secondary hover:bg-secondary/80 text-foreground rounded-md transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {ref.title}
                        </a>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-2">
              {t.clickToAnswer}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface FAQProps {
  onNavigate?: (slug: string) => void;
}

export function FAQ({ onNavigate }: FAQProps) {
  const { t, locale } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const prevLocaleRef = useRef(locale);

  // Clear cached answers when language changes
  useEffect(() => {
    if (prevLocaleRef.current !== locale) {
      setAnswers({});
      prevLocaleRef.current = locale;
    }
  }, [locale]);

  const questions = [
    t.faqQuestion1,
    t.faqQuestion2,
    t.faqQuestion3,
    t.faqQuestion4,
    t.faqQuestion5,
    t.faqQuestion6,
  ];

  const handleToggle = async (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null);
      return;
    }

    setOpenIndex(index);

    // If we already have an answer, don't fetch again
    if (answers[index]) return;

    // Set loading state
    setLoadingIndex(index);

    // Try to get AI answer, with fallback to predefined answers
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: questions[index] }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      if (data.answer && !data.error) {
        setAnswers(prev => ({ ...prev, [index]: data.answer }));
      } else {
        throw new Error("Invalid response");
      }
    } catch {
      // Use predefined fallback answer
      const fallbackAnswer =
        faqData[index]?.answer[locale] || faqData[index]?.answer.en;
      setAnswers(prev => ({ ...prev, [index]: fallbackAnswer }));
    } finally {
      setLoadingIndex(null);
    }
  };

  const handleNavigate = (slug: string) => {
    if (onNavigate) {
      onNavigate(slug);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <HelpCircle className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t.faq}</h1>
        </div>
        <p className="text-muted-foreground">{t.faqDescription}</p>
      </div>

      {/* FAQ Items */}
      <div className="space-y-3">
        {questions.map((question, index) => (
          <FAQItem
            key={index}
            question={question}
            isOpen={openIndex === index}
            isLoading={loadingIndex === index}
            answer={answers[index] || null}
            references={faqData[index]?.references || []}
            onToggle={() => handleToggle(index)}
            onNavigate={handleNavigate}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 p-4 bg-secondary/30 rounded-lg border border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>{t.poweredByGemini}</span>
        </div>
      </div>
    </div>
  );
}
