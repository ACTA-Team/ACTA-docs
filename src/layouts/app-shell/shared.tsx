import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AppWindow,
  BadgeCheck,
  Banknote,
  Blocks,
  BookMarked,
  BookOpen,
  Book,
  Boxes,
  Braces,
  Bug,
  Cable,
  CirclePlay,
  Compass,
  ExternalLink,
  FileCode,
  FilePenLine,
  FileSearch,
  Fingerprint,
  FolderOpen,
  Globe,
  HandCoins,
  HeartPulse,
  History,
  Home,
  IdCard,
  Info,
  KeyRound,
  LayoutDashboard,
  LayoutList,
  LifeBuoy,
  Lock,
  Map,
  MessageCircleQuestion,
  Network,
  Package,
  Rocket,
  ScanSearch,
  ScrollText,
  Server,
  ShieldAlert,
  Sparkles,
  Terminal,
  Vault,
} from "lucide-react";
import type { NavigationItems, NavigationItem } from "@/@types/docs";
import type { Translations } from "@/@types/i18n";

export type SidebarNavItem = {
  key?: string;
  title: string;
  slug?: string;
  externalUrl?: string;
  icon?: ReactNode;
  isActive?: boolean;
  subItems?: SidebarNavItem[];
};

export type SidebarNavGroup = {
  key: string;
  label: string;
  items: SidebarNavItem[];
};

type SectionKey =
  | "welcome"
  | "guides"
  | "sdk"
  | "api-reference"
  | "contracts"
  | "did"
  | "ia"
  | "dapp";

const subIconClass = "size-3.5 shrink-0 text-sidebar-foreground/65";

const NAV_SUB_ITEM_ICONS: Partial<Record<string, LucideIcon>> = {
  introduction: BookOpen,
  quickstart: Rocket,
  architecture: Boxes,
  "getting-started": Compass,
  security: Lock,
  versions: History,
  glossary: Book,
  "mainnet-guide": Globe,
  "verify-credentials": ScanSearch,
  links: ExternalLink,
  "sdk-overview": BookMarked,
  actaClient: Terminal,
  useCredential: BadgeCheck,
  useVault: Vault,
  useVaultRead: FileSearch,
  sponsoredVault: HandCoins,
  "api-overview": LayoutList,
  "api-health-status": HeartPulse,
  "api-keys": KeyRound,
  "api-contract-info": Info,
  "api-vault-read": FolderOpen,
  "api-vault-write": FilePenLine,
  "api-sponsored-vault": Banknote,
  "api-credentials": Fingerprint,
  "api-errors": Bug,
  "contracts-reference": FileCode,
  "contract-errors": ShieldAlert,
  "did-overview": IdCard,
  "did-registry": Server,
  "did-library": Braces,
  mcp: Cable,
  "dapp-overview": LayoutDashboard,
  "dapp-getting-started": CirclePlay,
  "dapp-features": Blocks,
};

function navSubItemIcon(slug: string): ReactNode {
  const Icon = NAV_SUB_ITEM_ICONS[slug];
  if (!Icon) return null;
  return <Icon className={subIconClass} />;
}

const sectionIcons: Record<SectionKey, ReactNode> = {
  welcome: <Home className="size-3.5 shrink-0" />,
  guides: <Map className="size-3.5 shrink-0" />,
  sdk: <Package className="size-3.5 shrink-0" />,
  "api-reference": <Network className="size-3.5 shrink-0" />,
  contracts: <ScrollText className="size-3.5 shrink-0" />,
  did: <IdCard className="size-3.5 shrink-0" />,
  ia: <Sparkles className="size-3.5 shrink-0" />,
  dapp: <AppWindow className="size-3.5 shrink-0" />,
};

const SECTION_ORDER: SectionKey[] = [
  "welcome",
  "guides",
  "sdk",
  "api-reference",
  "contracts",
  "did",
  "ia",
  "dapp",
];

const GROUP_DEFS: Array<{ key: string; sections: SectionKey[] }> = [
  {
    key: "docs",
    sections: [
      "welcome",
      "guides",
      "sdk",
      "api-reference",
      "contracts",
      "did",
      "ia",
      "dapp",
    ],
  },
];

function getSectionLabel(key: SectionKey, t: Translations): string {
  switch (key) {
    case "welcome":
      return t.welcome;
    case "guides":
      return t.guidesCategory;
    case "sdk":
      return t.reactSdk;
    case "api-reference":
      return t.apiReference;
    case "contracts":
      return t.contracts;
    case "did":
      return t.didCategory;
    case "ia":
      return t.aiCategory;
    case "dapp":
      return t.dApp;
  }
  return "";
}

function getGroupLabel(
  key: string,
  locale: "en" | "es" | string = "en"
): string {
  if (key === "docs") return locale === "es" ? "Documentación" : "Docs";
  return "";
}

function toSubItem(item: NavigationItem, currentSlug: string): SidebarNavItem {
  return {
    title: item.title,
    slug: item.slug,
    externalUrl: item.externalUrl,
    icon: navSubItemIcon(item.slug),
    isActive: item.externalUrl ? false : item.slug === currentSlug,
  };
}

function toSectionItem(
  key: SectionKey,
  nav: NavigationItems,
  currentSlug: string,
  t: Translations
): SidebarNavItem | null {
  const items = nav[key];
  if (!items || items.length === 0) return null;
  const subItems = items.map(item => toSubItem(item, currentSlug));
  return {
    key,
    title: getSectionLabel(key, t),
    icon: sectionIcons[key],
    isActive: subItems.some(s => s.isActive),
    subItems,
  };
}

export function buildNavGroups(
  nav: NavigationItems,
  currentSlug: string,
  t: Translations,
  locale: string = "en"
): SidebarNavGroup[] {
  return GROUP_DEFS.flatMap(group => {
    const items = group.sections
      .map(section => toSectionItem(section, nav, currentSlug, t))
      .filter((item): item is SidebarNavItem => item !== null);
    if (items.length === 0) return [];
    return [
      {
        key: group.key,
        label: getGroupLabel(group.key, locale),
        items,
      },
    ];
  });
}

export function buildFooterNav(
  nav: NavigationItems,
  currentSlug: string
): SidebarNavItem[] {
  const items = nav.help;
  if (!items) return [];
  const iconFor: Record<string, ReactNode> = {
    faq: <MessageCircleQuestion className="size-3.5 shrink-0" />,
    support: <LifeBuoy className="size-3.5 shrink-0" />,
    glossary: <Book className="size-3.5 shrink-0" />,
  };
  return items.map(item => ({
    title: item.title,
    slug: item.slug,
    icon: iconFor[item.slug] ?? <BookOpen className="size-3.5 shrink-0" />,
    isActive: item.slug === currentSlug,
  }));
}

export function findActivePage(
  nav: NavigationItems,
  currentSlug: string
): SidebarNavItem | null {
  for (const key of [...SECTION_ORDER, "help"] as Array<
    keyof NavigationItems
  >) {
    const items = nav[key];
    if (!items) continue;
    const match = items.find(item => item.slug === currentSlug);
    if (match) {
      return {
        title: match.title,
        slug: match.slug,
        icon: match.slug ? navSubItemIcon(match.slug) : undefined,
        isActive: true,
      };
    }
  }
  return null;
}

export function findSectionLabel(
  nav: NavigationItems,
  currentSlug: string,
  t: Translations
): string | null {
  for (const key of SECTION_ORDER) {
    const items = nav[key];
    if (!items) continue;
    if (items.some(item => item.slug === currentSlug)) {
      return getSectionLabel(key, t);
    }
  }
  if (nav.help?.some(item => item.slug === currentSlug)) {
    return t.support;
  }
  return null;
}
