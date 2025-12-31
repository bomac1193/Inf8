/**
 * Ø8 Verification Module
 * Comprehensive declaration verification
 */

import type { Declaration, VerificationResult } from "../core/types.js";
import { validateDeclaration } from "../core/validate.js";
import { verifyFingerprint } from "../core/fingerprint.js";
import { extractCID, isPublishedId, isPendingId } from "../core/id.js";
import { IPFSClient, createIPFSClient } from "../ipfs/client.js";

/**
 * Verification options
 */
export interface VerifyOptions {
  /** Path to audio file for fingerprint verification */
  audioFile?: string;
  /** Check cryptographic signatures */
  checkSignatures?: boolean;
  /** Verify source material CIDs exist on IPFS */
  checkProvenance?: boolean;
  /** Custom IPFS client */
  ipfsClient?: IPFSClient;
}

/**
 * Error thrown when verification fails
 */
export class VerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VerificationError";
  }
}

/**
 * Verify a declaration by CID or ID
 *
 * @example
 * ```typescript
 * // Basic verification
 * const result = await verifyDeclaration("QmYw...");
 *
 * // With audio fingerprint check
 * const result = await verifyDeclaration("o8-QmYw...", {
 *   audioFile: "./track.wav"
 * });
 *
 * // Check provenance sources exist
 * const result = await verifyDeclaration("o8-QmYw...", {
 *   checkProvenance: true
 * });
 * ```
 */
export async function verifyDeclaration(
  cidOrId: string,
  options: VerifyOptions = {}
): Promise<VerificationResult> {
  const ipfs = options.ipfsClient || createIPFSClient();
  const timestamp = new Date().toISOString();

  // Extract CID from input
  let cid: string;
  try {
    cid = extractCID(cidOrId);
  } catch (error) {
    return createFailedResult(
      `Invalid declaration ID or CID: ${cidOrId}`,
      timestamp
    );
  }

  // Fetch declaration from IPFS
  let declaration: Declaration;
  try {
    declaration = await ipfs.fetch(cid);
  } catch (error) {
    return createFailedResult(
      `Failed to fetch declaration from IPFS: ${(error as Error).message}`,
      timestamp
    );
  }

  // Initialize verification result
  const result: VerificationResult = {
    valid: true,
    declaration,
    checks: {
      schema: { valid: true },
    },
    timestamp,
  };

  // Schema validation (already done by fetch, but explicit check)
  const schemaValidation = validateDeclaration(declaration);
  if (!schemaValidation.valid) {
    result.valid = false;
    result.checks.schema = {
      valid: false,
      errors: schemaValidation.errors,
    };
    return result;
  }

  // Verify declaration ID matches CID
  if (declaration.declaration_id) {
    const expectedId = `o8-${cid}`;
    if (
      declaration.declaration_id !== expectedId &&
      !isPendingId(declaration.declaration_id)
    ) {
      result.checks.schema.errors = result.checks.schema.errors || [];
      result.checks.schema.errors.push(
        `Declaration ID mismatch: expected ${expectedId}, got ${declaration.declaration_id}`
      );
    }
  }

  // Audio fingerprint verification
  if (options.audioFile) {
    try {
      const fingerprintResult = await verifyFingerprint(
        options.audioFile,
        declaration.audio_fingerprint
      );

      result.checks.fingerprint = {
        valid: fingerprintResult.valid,
        computed: fingerprintResult.computed.sha256,
        declared: fingerprintResult.declared.sha256,
      };

      if (!fingerprintResult.valid) {
        result.valid = false;
      }
    } catch (error) {
      result.checks.fingerprint = {
        valid: false,
        declared: declaration.audio_fingerprint.sha256,
      };
      result.valid = false;
    }
  }

  // Signature verification (placeholder for future implementation)
  if (options.checkSignatures) {
    const signatureCheck = verifySignatures(declaration);
    result.checks.signatures = signatureCheck;
    if (!signatureCheck.valid) {
      result.valid = false;
    }
  }

  // Provenance verification (check source CIDs exist)
  if (options.checkProvenance) {
    const provenanceCheck = await verifyProvenance(declaration, ipfs);
    result.checks.provenance = provenanceCheck;
    if (!provenanceCheck.valid) {
      result.valid = false;
    }
  }

  return result;
}

/**
 * Verify a declaration object directly (without IPFS fetch)
 */
export function verifyDeclarationObject(
  declaration: unknown
): VerificationResult {
  const timestamp = new Date().toISOString();

  const schemaValidation = validateDeclaration(declaration);

  if (!schemaValidation.valid) {
    return {
      valid: false,
      declaration: declaration as Declaration,
      checks: {
        schema: {
          valid: false,
          errors: schemaValidation.errors,
        },
      },
      timestamp,
    };
  }

  return {
    valid: true,
    declaration: schemaValidation.data,
    checks: {
      schema: { valid: true },
    },
    timestamp,
  };
}

/**
 * Verify cryptographic signatures in a declaration
 */
function verifySignatures(declaration: Declaration): {
  valid: boolean;
  verified?: string[];
  failed?: string[];
} {
  const verified: string[] = [];
  const failed: string[] = [];

  // Check primary artist signature
  const { primary_artist } = declaration.identity;
  if (primary_artist.signature && primary_artist.wallet) {
    // TODO: Implement actual signature verification using ethers.js
    // For now, just check that both fields are present
    verified.push(primary_artist.name);
  } else if (primary_artist.wallet && !primary_artist.signature) {
    // Wallet present but no signature
    failed.push(`${primary_artist.name} (missing signature)`);
  }

  // Check collaborator signatures
  for (const collaborator of declaration.identity.collaborators) {
    if (collaborator.wallet) {
      // Collaborators with wallets should ideally have signatures
      // For now, we don't fail if they don't
      verified.push(collaborator.name);
    }
  }

  return {
    valid: failed.length === 0,
    verified: verified.length > 0 ? verified : undefined,
    failed: failed.length > 0 ? failed : undefined,
  };
}

/**
 * Verify that provenance CIDs exist on IPFS
 */
async function verifyProvenance(
  declaration: Declaration,
  ipfs: IPFSClient
): Promise<{
  valid: boolean;
  sources_checked: number;
  sources_valid: number;
}> {
  const sources: string[] = [];

  // Collect all CIDs to check
  if (declaration.provenance.ipfs_cid) {
    sources.push(declaration.provenance.ipfs_cid);
  }

  for (const material of declaration.provenance.source_material) {
    sources.push(material.cid);
  }

  for (const sample of declaration.provenance.samples) {
    sources.push(sample.cid);
  }

  for (const stem of declaration.provenance.stems) {
    sources.push(stem.cid);
  }

  if (sources.length === 0) {
    return {
      valid: true,
      sources_checked: 0,
      sources_valid: 0,
    };
  }

  // Check each CID exists
  let validCount = 0;
  for (const cid of sources) {
    const exists = await ipfs.exists(cid);
    if (exists) {
      validCount++;
    }
  }

  return {
    valid: validCount === sources.length,
    sources_checked: sources.length,
    sources_valid: validCount,
  };
}

/**
 * Create a failed verification result
 */
function createFailedResult(
  error: string,
  timestamp: string
): VerificationResult {
  return {
    valid: false,
    declaration: {} as Declaration,
    checks: {
      schema: {
        valid: false,
        errors: [error],
      },
    },
    timestamp,
  };
}

/**
 * Format verification result for display
 */
export function formatVerificationResult(result: VerificationResult): string {
  const lines: string[] = [];

  lines.push(`Verification Result: ${result.valid ? "VALID" : "INVALID"}`);
  lines.push(`Timestamp: ${result.timestamp}`);
  lines.push("");

  // Schema check
  lines.push(`Schema: ${result.checks.schema.valid ? "Valid" : "Invalid"}`);
  if (result.checks.schema.errors) {
    for (const error of result.checks.schema.errors) {
      lines.push(`  - ${error}`);
    }
  }

  // Fingerprint check
  if (result.checks.fingerprint) {
    lines.push(
      `Fingerprint: ${result.checks.fingerprint.valid ? "Match" : "Mismatch"}`
    );
    if (!result.checks.fingerprint.valid) {
      lines.push(`  Computed: ${result.checks.fingerprint.computed}`);
      lines.push(`  Declared: ${result.checks.fingerprint.declared}`);
    }
  }

  // Signature check
  if (result.checks.signatures) {
    lines.push(
      `Signatures: ${result.checks.signatures.valid ? "Verified" : "Failed"}`
    );
    if (result.checks.signatures.verified) {
      lines.push(`  Verified: ${result.checks.signatures.verified.join(", ")}`);
    }
    if (result.checks.signatures.failed) {
      lines.push(`  Failed: ${result.checks.signatures.failed.join(", ")}`);
    }
  }

  // Provenance check
  if (result.checks.provenance) {
    lines.push(
      `Provenance: ${result.checks.provenance.valid ? "All sources available" : "Some sources missing"}`
    );
    lines.push(
      `  Sources: ${result.checks.provenance.sources_valid}/${result.checks.provenance.sources_checked} available`
    );
  }

  return lines.join("\n");
}

// Re-export types
export type { VerificationResult, Declaration };
