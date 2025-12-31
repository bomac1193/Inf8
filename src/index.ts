/**
 * Ø8 — Creative provenance protocol for AI-native music
 *
 * @packageDocumentation
 */

// Core exports
export * from "./core/index.js";

// IPFS exports
export * from "./ipfs/index.js";

// Verification exports
export {
  verifyDeclaration,
  verifyDeclarationObject,
  formatVerificationResult,
  VerificationError,
  type VerifyOptions,
} from "./verify/index.js";
