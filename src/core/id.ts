/**
 * Ø8 Declaration ID Generation
 * Format: o8-[CID] for published, o8-pending-[uuid] for unpublished
 */

import { randomUUID } from "crypto";
import { validateCID } from "./validate.js";

/**
 * Declaration ID prefix
 */
export const O8_PREFIX = "o8-";
export const O8_PENDING_PREFIX = "o8-pending-";

/**
 * Error thrown when ID operations fail
 */
export class DeclarationIdError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DeclarationIdError";
  }
}

/**
 * Generate a declaration ID from an IPFS CID
 *
 * @example
 * ```typescript
 * const id = generateDeclarationId("QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
 * // "o8-QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG"
 * ```
 */
export function generateDeclarationId(cid: string): string {
  if (!validateCID(cid)) {
    throw new DeclarationIdError("Invalid CID format");
  }

  return `${O8_PREFIX}${cid}`;
}

/**
 * Parse a declaration ID to extract the CID
 *
 * @example
 * ```typescript
 * const { prefix, cid, isPending } = parseDeclarationId("o8-QmYw...");
 * // { prefix: "o8-", cid: "QmYw...", isPending: false }
 * ```
 */
export function parseDeclarationId(id: string): {
  prefix: string;
  cid: string;
  isPending: boolean;
} {
  if (!id || !id.startsWith(O8_PREFIX)) {
    throw new DeclarationIdError(
      `Invalid declaration ID format. Must start with "${O8_PREFIX}"`
    );
  }

  // Check if it's a pending ID
  if (id.startsWith(O8_PENDING_PREFIX)) {
    const uuid = id.slice(O8_PENDING_PREFIX.length);
    return {
      prefix: O8_PENDING_PREFIX,
      cid: uuid,
      isPending: true,
    };
  }

  // Extract CID from published ID
  const cid = id.slice(O8_PREFIX.length);

  if (!validateCID(cid)) {
    throw new DeclarationIdError(
      "Invalid CID in declaration ID. Expected valid IPFS CID."
    );
  }

  return {
    prefix: O8_PREFIX,
    cid,
    isPending: false,
  };
}

/**
 * Create a temporary pending ID before IPFS publish
 *
 * @example
 * ```typescript
 * const pendingId = createPendingId();
 * // "o8-pending-550e8400-e29b-41d4-a716-446655440000"
 * ```
 */
export function createPendingId(): string {
  return `${O8_PENDING_PREFIX}${randomUUID()}`;
}

/**
 * Check if a declaration ID is in pending state
 */
export function isPendingId(id: string): boolean {
  return id.startsWith(O8_PENDING_PREFIX);
}

/**
 * Check if a declaration ID is published (has real CID)
 */
export function isPublishedId(id: string): boolean {
  if (!id.startsWith(O8_PREFIX)) {
    return false;
  }

  if (id.startsWith(O8_PENDING_PREFIX)) {
    return false;
  }

  const cid = id.slice(O8_PREFIX.length);
  return validateCID(cid);
}

/**
 * Get the IPFS gateway URL for a declaration
 */
export function getGatewayUrl(
  cid: string,
  gateway: string = "https://ipfs.io"
): string {
  // Remove trailing slash from gateway
  const baseUrl = gateway.replace(/\/$/, "");
  return `${baseUrl}/ipfs/${cid}`;
}

/**
 * Extract CID from various input formats
 * Supports: raw CID, declaration ID (o8-CID), or gateway URL
 */
export function extractCID(input: string): string {
  // Check if it's a declaration ID
  if (input.startsWith(O8_PREFIX) && !input.startsWith(O8_PENDING_PREFIX)) {
    return input.slice(O8_PREFIX.length);
  }

  // Check if it's a gateway URL
  const ipfsMatch = input.match(/\/ipfs\/([A-Za-z0-9]+)/);
  if (ipfsMatch) {
    return ipfsMatch[1];
  }

  // Assume it's a raw CID
  if (validateCID(input)) {
    return input;
  }

  throw new DeclarationIdError(
    "Could not extract CID from input. Expected CID, o8-[CID], or IPFS gateway URL."
  );
}
