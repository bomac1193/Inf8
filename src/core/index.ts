/**
 * Ø8 Core Module
 * Re-exports all core functionality
 */

// Types (v1)
export * from "./types.js";

// Types (v2 - Creative Identity Protocol)
export * from "./types.v2.js";

// Converters (BOVEDA ↔ o8)
export {
  bovedaToO8,
  o8ToBoveda,
  mergeExternalDNA,
  validateIdentityForUseCase,
  type BovedaCharacterGenome,
} from "./converters.js";

// Validation
export {
  validateDeclaration,
  validateWalletAddress,
  validateCID,
  validateAIContribution,
  validateISO8601,
  calculateAverageAI,
  calculateTransparencyScore,
  DeclarationSchema,
  AIContributionSchema,
  AudioFingerprintSchema,
} from "./validate.js";

// Builder
export {
  DeclarationBuilder,
  DeclarationBuilderError,
  createDeclaration,
} from "./builder.js";

// Fingerprinting
export {
  fingerprintAudio,
  verifyFingerprint,
  hashFile,
  extractMetadata,
  isSupportedFormat,
  formatDuration,
  formatFileSize,
  SUPPORTED_FORMATS,
  FingerprintError,
} from "./fingerprint.js";

// ID Generation
export {
  generateDeclarationId,
  parseDeclarationId,
  createPendingId,
  isPendingId,
  isPublishedId,
  getGatewayUrl,
  extractCID,
  O8_PREFIX,
  O8_PENDING_PREFIX,
  DeclarationIdError,
} from "./id.js";
