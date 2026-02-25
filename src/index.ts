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

// API exports (v2.0 Creative Identity Protocol)
export {
  IdentityService,
  InMemoryIdentityStore,
  createRouteHandlers,
  type IdentityStore,
  type IdentityFilters,
  type ExternalDNASources,
  type IdentityServiceConfig,
  type RouteHandler,
} from "./api/index.js";

// Provenance exports (IPFS + C2PA)
export {
  // IPFS
  IPFSService,
  createIPFSService,
  getIPFSService,
  // C2PA
  C2PAManifestGenerator,
  createManifestGenerator,
  DigitalSourceType,
  ActionType,
  // Unified service
  ProvenanceService,
  createProvenanceService,
  getProvenanceService,
  // Types
  type IPFSServiceConfig,
  type PublishResult,
  type C2PAManifest,
  type StampResult,
  type VerificationResult,
} from "./provenance/index.js";
