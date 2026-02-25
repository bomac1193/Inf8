/**
 * o8 Provenance Module
 *
 * Provides:
 * - IPFS storage for permanent content addressing
 * - C2PA manifest generation for content authenticity
 * - Unified provenance service
 */

// IPFS Service
export {
  IPFSService,
  createIPFSService,
  getIPFSService,
  type IPFSServiceConfig,
  type PublishResult,
  type ProviderStatus,
} from './ipfs-service.js';

// C2PA Manifest Generator
export {
  C2PAManifestGenerator,
  createManifestGenerator,
  DigitalSourceType,
  ActionType,
  type C2PAManifest,
  type C2PAClaim,
  type C2PAAssertion,
  type C2PAAssertionReference,
  type CreativeWorkAssertion,
  type ActionsAssertion,
  type O8IdentityAssertion,
  type O8AudioDNAAssertion,
  type ManifestGeneratorConfig,
} from './c2pa-manifest.js';

// Unified Provenance Service
export {
  ProvenanceService,
  createProvenanceService,
  getProvenanceService,
  type ProvenanceServiceConfig,
  type StampResult,
  type VerificationResult,
} from './provenance-service.js';
