/**
 * Ø8 IPFS Module
 * Re-exports IPFS functionality
 */

export {
  IPFSClient,
  IPFSError,
  createIPFSClient,
  ipfs,
  type IPFSClientConfig,
  type PublishResult,
} from "./client.js";

// v2.0 Identity IPFS support
export {
  IdentityIPFSClient,
  createIdentityIPFSClient,
  identityIPFS,
  type IdentityPublishResult,
  type DeclarationPublishResult,
} from "./identity.js";
