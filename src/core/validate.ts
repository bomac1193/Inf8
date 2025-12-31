/**
 * Ø8 Validation Schemas
 * Zod schemas for runtime validation of declarations
 */

import { z } from "zod";
import type { Declaration, ValidationResult } from "./types.js";

// Ethereum address regex (0x followed by 40 hex characters)
const ETHEREUM_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

// IPFS CID regex (Qm... for v0, ba... for v1)
const IPFS_CID_REGEX = /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|ba[a-z2-7]{57})$/;

// ISO-8601 date regex
const ISO8601_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;

/**
 * Validate Ethereum wallet address format
 */
export const WalletAddressSchema = z
  .string()
  .regex(ETHEREUM_ADDRESS_REGEX, "Invalid Ethereum address format");

/**
 * Validate IPFS CID format
 */
export const CIDSchema = z
  .string()
  .regex(IPFS_CID_REGEX, "Invalid IPFS CID format");

/**
 * Validate ISO-8601 timestamp
 */
export const ISO8601Schema = z
  .string()
  .regex(ISO8601_REGEX, "Invalid ISO-8601 timestamp format");

/**
 * AI contribution value (0 to 1)
 */
export const AIContributionValueSchema = z
  .number()
  .min(0, "AI contribution cannot be negative")
  .max(1, "AI contribution cannot exceed 1");

// Primary Artist Schema
export const PrimaryArtistSchema = z.object({
  name: z.string().min(1, "Artist name is required"),
  wallet: WalletAddressSchema.optional(),
  signature: z.string().optional(),
});

// Collaborator Schema
export const CollaboratorSchema = z.object({
  name: z.string().min(1, "Collaborator name is required"),
  role: z.string().min(1, "Collaborator role is required"),
  wallet: WalletAddressSchema.optional(),
  split: z.number().min(0).max(1).optional(),
});

// Contributor Schema
export const ContributorSchema = z.object({
  name: z.string().min(1, "Contributor name is required"),
  role: z.string().min(1, "Contributor role is required"),
  contribution: z.string().min(1, "Contribution description is required"),
});

// Identity Schema
export const IdentitySchema = z.object({
  primary_artist: PrimaryArtistSchema,
  collaborators: z.array(CollaboratorSchema),
  contributors: z.array(ContributorSchema),
});

// AI Model Schema
export const AIModelSchema = z.object({
  name: z.string().min(1, "AI model name is required"),
  provider: z.string().min(1, "AI model provider is required"),
  version: z.string().optional(),
  usage: z.string().min(1, "AI model usage description is required"),
});

// Sample Schema
export const SampleSchema = z.object({
  name: z.string().min(1, "Sample name is required"),
  source: z.string().min(1, "Sample source is required"),
  license: z.string().optional(),
});

// Creative Stack Schema
export const CreativeStackSchema = z.object({
  daws: z.array(z.string()),
  plugins: z.array(z.string()),
  ai_models: z.array(AIModelSchema),
  hardware: z.array(z.string()),
  samples: z.array(SampleSchema),
});

// AI Contribution Schema
export const AIContributionSchema = z.object({
  composition: AIContributionValueSchema,
  arrangement: AIContributionValueSchema,
  production: AIContributionValueSchema,
  mixing: AIContributionValueSchema,
  mastering: AIContributionValueSchema,
});

// Production Intelligence Schema
export const ProductionIntelligenceSchema = z.object({
  ai_contribution: AIContributionSchema,
  methodology: z.string().min(1, "Methodology description is required"),
  notes: z.string().optional(),
});

// Source Material Schema
export const SourceMaterialSchema = z.object({
  cid: CIDSchema,
  description: z.string().min(1, "Source description is required"),
  relationship: z.enum(["sample", "remix", "cover", "interpolation"]),
});

// Sample Reference Schema
export const SampleReferenceSchema = z.object({
  cid: CIDSchema,
  name: z.string().min(1, "Sample name is required"),
  timestamp: z.string().optional(),
});

// Stem Schema
export const StemSchema = z.object({
  cid: CIDSchema,
  name: z.string().min(1, "Stem name is required"),
  type: z.enum(["vocals", "drums", "bass", "melody", "harmony", "fx", "other"]),
});

// Provenance Schema
export const ProvenanceSchema = z.object({
  ipfs_cid: CIDSchema.optional(),
  source_material: z.array(SourceMaterialSchema),
  samples: z.array(SampleReferenceSchema),
  stems: z.array(StemSchema),
});

// Revision Schema
export const RevisionSchema = z.object({
  version: z.string().min(1, "Version is required"),
  timestamp: ISO8601Schema,
  changes: z.string().min(1, "Changes description is required"),
  previous_cid: CIDSchema.optional(),
});

// Audio Fingerprint Schema
export const AudioFingerprintSchema = z.object({
  sha256: z.string().regex(/^[a-fA-F0-9]{64}$/, "Invalid SHA-256 hash format"),
  duration_ms: z.number().int().positive("Duration must be positive"),
  format: z.string().min(1, "Audio format is required"),
  sample_rate: z.number().int().positive().optional(),
  bit_depth: z.number().int().positive().optional(),
});

// Complete Declaration Schema
export const DeclarationSchema = z.object({
  version: z.literal("1.0"),
  declaration_id: z.string().min(1, "Declaration ID is required"),
  created_at: ISO8601Schema,
  updated_at: ISO8601Schema,
  identity: IdentitySchema,
  creative_stack: CreativeStackSchema,
  production_intelligence: ProductionIntelligenceSchema,
  provenance: ProvenanceSchema,
  revision_history: z.array(RevisionSchema),
  audio_fingerprint: AudioFingerprintSchema,
});

/**
 * Validate a complete declaration
 */
export function validateDeclaration(
  data: unknown
): ValidationResult<Declaration> {
  const result = DeclarationSchema.safeParse(data);

  if (result.success) {
    return { valid: true, data: result.data as Declaration };
  }

  const errors = result.error.issues.map((e) => {
    const path = String(e.path?.join(".") || "");
    return path ? `${path}: ${e.message}` : e.message;
  });

  return { valid: false, errors };
}

/**
 * Validate a wallet address
 */
export function validateWalletAddress(address: string): boolean {
  return ETHEREUM_ADDRESS_REGEX.test(address);
}

/**
 * Validate an IPFS CID
 */
export function validateCID(cid: string): boolean {
  return IPFS_CID_REGEX.test(cid);
}

/**
 * Validate AI contribution values (all must be 0-1)
 */
export function validateAIContribution(contribution: unknown): ValidationResult<{
  composition: number;
  arrangement: number;
  production: number;
  mixing: number;
  mastering: number;
}> {
  const result = AIContributionSchema.safeParse(contribution);

  if (result.success) {
    return { valid: true, data: result.data };
  }

  const errors = result.error.issues.map((e) => {
    const path = String(e.path?.join(".") || "");
    return path ? `${path}: ${e.message}` : e.message;
  });

  return { valid: false, errors };
}

/**
 * Validate ISO-8601 timestamp format
 */
export function validateISO8601(timestamp: string): boolean {
  return ISO8601_REGEX.test(timestamp);
}

/**
 * Calculate average AI contribution
 */
export function calculateAverageAI(contribution: {
  composition: number;
  arrangement: number;
  production: number;
  mixing: number;
  mastering: number;
}): number {
  const { composition, arrangement, production, mixing, mastering } = contribution;
  return (composition + arrangement + production + mixing + mastering) / 5;
}

/**
 * Calculate transparency score (higher = more transparent)
 * Score rewards disclosure: full AI and full human both score well if declared honestly
 */
export function calculateTransparencyScore(declaration: Declaration): number {
  const avgAI = calculateAverageAI(declaration.production_intelligence.ai_contribution);

  // Base score from disclosure (always positive for declaring)
  let score = 50;

  // Bonus for methodology description length
  const methodologyLength = declaration.production_intelligence.methodology.length;
  score += Math.min(methodologyLength / 10, 20); // Up to 20 points

  // Bonus for detailed creative stack
  const stackItems =
    declaration.creative_stack.daws.length +
    declaration.creative_stack.plugins.length +
    declaration.creative_stack.ai_models.length;
  score += Math.min(stackItems * 2, 15); // Up to 15 points

  // Bonus for source material documentation
  const sourceItems =
    declaration.provenance.source_material.length +
    declaration.provenance.samples.length +
    declaration.provenance.stems.length;
  score += Math.min(sourceItems * 3, 15); // Up to 15 points

  return Math.round(Math.min(score, 100));
}
