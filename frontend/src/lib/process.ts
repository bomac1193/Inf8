// Reduce the 5 AI-stage scores to a single human-readable claim.
// Threshold: >= 50% AI on a stage = "AI", otherwise "by hand".

export interface ProcessStages {
  aiComposition: number;
  aiArrangement: number;
  aiProduction: number;
  aiMixing: number;
  aiMastering: number;
}

const STAGE_NAMES = [
  ["aiComposition", "Composition"],
  ["aiArrangement", "Arrangement"],
  ["aiProduction", "Production"],
  ["aiMixing", "Mixing"],
  ["aiMastering", "Mastering"],
] as const;

function partition(dec: ProcessStages) {
  const byHand: string[] = [];
  const aiAssisted: string[] = [];
  for (const [key, name] of STAGE_NAMES) {
    if (dec[key] >= 50) aiAssisted.push(name);
    else byHand.push(name);
  }
  return { byHand, aiAssisted };
}

const join = (xs: string[]) =>
  xs.length === 1
    ? xs[0]
    : xs.length === 2
    ? `${xs[0]} and ${xs[1]}`
    : `${xs.slice(0, -1).join(", ")}, and ${xs[xs.length - 1]}`;

// Full sentence for the verify page Process block.
export function summarizeProcess(dec: ProcessStages): string {
  const { byHand, aiAssisted } = partition(dec);
  if (aiAssisted.length === 0) return "Hand-made across the full process.";
  if (byHand.length === 0)     return "AI-native across the full process.";
  return `${join(byHand)} by hand. AI-assisted ${join(aiAssisted).toLowerCase()}.`;
}

// Compact label for cards. Two or three words max.
export function processChip(dec: ProcessStages): string {
  const { byHand, aiAssisted } = partition(dec);
  if (aiAssisted.length === 0) return "Hand-made";
  if (byHand.length === 0)     return "AI-native";
  if (aiAssisted.length === 1) return `AI ${aiAssisted[0].toLowerCase()}`;
  return `AI-assisted, ${aiAssisted.length} stages`;
}
