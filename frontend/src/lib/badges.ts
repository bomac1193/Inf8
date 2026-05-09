// Nsibidi badge system. Bone-on-graphite for everything; one warm
// accent (Lineage complete) reserved as the apex signal.

export interface Badge {
  key: string;
  label: string;
  color: string;
  textColor: string;
}

export const BADGE_DEFINITIONS: Record<string, Badge> = {
  DECLARED: {
    key: "DECLARED",
    label: "Declared",
    color: "#F5F3F0",
    textColor: "#0A0A0A",
  },
  DEEP_STACK: {
    key: "DEEP_STACK",
    label: "Stack disclosed",
    color: "#1A1A1A",
    textColor: "#F5F3F0",
  },
  PROCESS_DOC: {
    key: "PROCESS_DOC",
    label: "Method recorded",
    color: "#1A1A1A",
    textColor: "#F5F3F0",
  },
  MULTIPLAYER: {
    key: "MULTIPLAYER",
    label: "Co-authored",
    color: "#1A1A1A",
    textColor: "#F5F3F0",
  },
  FULL_LINEAGE: {
    key: "FULL_LINEAGE",
    label: "Lineage complete",
    color: "#B8A586",
    textColor: "#0A0A0A",
  },
};

// Parse badge string from DB (comma-separated) into Badge objects
export function getBadges(badgeString: string | null | undefined): Badge[] {
  if (!badgeString) return [];
  return badgeString
    .split(",")
    .map((key) => BADGE_DEFINITIONS[key.trim()])
    .filter(Boolean);
}

// Compute badges client-side from declaration data
export function computeBadges(declaration: {
  badge?: string | null;
  methodology?: string | null;
  contributorSplits?: unknown;
  ipfsCID?: string;
  sha256?: string;
  daws?: string;
  plugins?: string;
  aiModels?: string;
}): Badge[] {
  // If we have a pre-computed badge string, use it
  if (declaration.badge) {
    return getBadges(declaration.badge);
  }

  // Otherwise compute from data
  const badges: Badge[] = [BADGE_DEFINITIONS.DECLARED];

  // Count creative stack items
  const stackItems = [
    ...(declaration.daws?.split(",").filter(Boolean) || []),
    ...(declaration.plugins?.split(",").filter(Boolean) || []),
    ...(declaration.aiModels?.split(",").filter(Boolean) || []),
  ];
  if (stackItems.length >= 5) {
    badges.push(BADGE_DEFINITIONS.DEEP_STACK);
  }

  if (declaration.methodology && declaration.methodology.length > 200) {
    badges.push(BADGE_DEFINITIONS.PROCESS_DOC);
  }

  const splits = declaration.contributorSplits;
  if (Array.isArray(splits) && splits.length > 0) {
    badges.push(BADGE_DEFINITIONS.MULTIPLAYER);
  }

  if (declaration.ipfsCID && declaration.sha256) {
    badges.push(BADGE_DEFINITIONS.FULL_LINEAGE);
  }

  return badges;
}

// Gallery filter types based on new badge system
export const GALLERY_FILTERS = [
  { key: "all", label: "All" },
  { key: "DEEP_STACK", label: "Stack disclosed" },
  { key: "MULTIPLAYER", label: "Co-authored" },
  { key: "FULL_LINEAGE", label: "Lineage complete" },
] as const;

export type GalleryFilterKey = (typeof GALLERY_FILTERS)[number]["key"];
