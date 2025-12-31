/**
 * Ø8 IPFS Client
 * Publish and fetch declarations from IPFS
 */

import { readFile } from "fs/promises";
import { existsSync } from "fs";
import type { Declaration } from "../core/types.js";
import { validateDeclaration } from "../core/validate.js";
import { generateDeclarationId, getGatewayUrl } from "../core/id.js";

/**
 * IPFS client configuration
 */
export interface IPFSClientConfig {
  /** IPFS API URL (default: http://127.0.0.1:5001) */
  apiUrl?: string;
  /** IPFS Gateway URL for public access (default: https://ipfs.io) */
  gatewayUrl?: string;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Number of retries on failure (default: 3) */
  retries?: number;
}

/**
 * Result from publishing to IPFS
 */
export interface PublishResult {
  /** IPFS Content Identifier */
  cid: string;
  /** Full declaration ID (o8-[CID]) */
  declarationId: string;
  /** Gateway URL for public access */
  gatewayUrl: string;
}

/**
 * Error thrown when IPFS operations fail
 */
export class IPFSError extends Error {
  constructor(
    message: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = "IPFSError";
  }
}

/**
 * Default IPFS configuration
 */
const DEFAULT_CONFIG: Required<IPFSClientConfig> = {
  apiUrl: process.env.IPFS_API_URL || "http://127.0.0.1:5001",
  gatewayUrl: process.env.IPFS_GATEWAY || "https://ipfs.io",
  timeout: 30000,
  retries: 3,
};

/**
 * IPFS Client for publishing and fetching Ø8 declarations
 *
 * @example
 * ```typescript
 * const client = new IPFSClient();
 *
 * // Publish a declaration
 * const result = await client.publish(declaration);
 * console.log(`Published: ${result.cid}`);
 *
 * // Fetch a declaration
 * const fetched = await client.fetch(result.cid);
 * ```
 */
export class IPFSClient {
  private config: Required<IPFSClientConfig>;

  constructor(config?: IPFSClientConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Publish a declaration to IPFS
   */
  async publish(declaration: Declaration): Promise<PublishResult> {
    // Validate declaration first
    const validation = validateDeclaration(declaration);
    if (!validation.valid) {
      throw new IPFSError(
        `Invalid declaration: ${validation.errors.join(", ")}`
      );
    }

    // Serialize to JSON
    const json = JSON.stringify(declaration, null, 2);
    const data = new TextEncoder().encode(json);

    // Prepare form data
    const formData = this.createFormData(data, "declaration.json");

    let lastError: Error | undefined;

    for (let attempt = 0; attempt < this.config.retries; attempt++) {
      try {
        const response = await fetch(`${this.config.apiUrl}/api/v0/add`, {
          method: "POST",
          body: formData,
          signal: AbortSignal.timeout(this.config.timeout),
        });

        if (!response.ok) {
          throw new Error(`IPFS API error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        const cid = result.Hash;

        return {
          cid,
          declarationId: generateDeclarationId(cid),
          gatewayUrl: getGatewayUrl(cid, this.config.gatewayUrl),
        };
      } catch (error) {
        lastError = error as Error;

        // Wait before retry (exponential backoff)
        if (attempt < this.config.retries - 1) {
          await this.sleep(Math.pow(2, attempt) * 1000);
        }
      }
    }

    throw new IPFSError(
      `Failed to publish to IPFS after ${this.config.retries} attempts`,
      lastError
    );
  }

  /**
   * Fetch a declaration from IPFS by CID
   */
  async fetch(cid: string): Promise<Declaration> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt < this.config.retries; attempt++) {
      try {
        // Try gateway first (more reliable for public access)
        const url = getGatewayUrl(cid, this.config.gatewayUrl);

        const response = await fetch(url, {
          signal: AbortSignal.timeout(this.config.timeout),
        });

        if (!response.ok) {
          throw new Error(`IPFS fetch error: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();

        // Validate the fetched declaration
        const validation = validateDeclaration(json);
        if (!validation.valid) {
          throw new IPFSError(
            `Invalid declaration at ${cid}: ${validation.errors.join(", ")}`
          );
        }

        return validation.data;
      } catch (error) {
        lastError = error as Error;

        // Wait before retry
        if (attempt < this.config.retries - 1) {
          await this.sleep(Math.pow(2, attempt) * 1000);
        }
      }
    }

    throw new IPFSError(
      `Failed to fetch from IPFS after ${this.config.retries} attempts: ${cid}`,
      lastError
    );
  }

  /**
   * Publish an audio file to IPFS
   */
  async publishAudio(filePath: string): Promise<string> {
    if (!existsSync(filePath)) {
      throw new IPFSError(`File not found: ${filePath}`);
    }

    const fileData = await readFile(filePath);
    const formData = this.createFormData(fileData, filePath.split("/").pop() || "audio");

    let lastError: Error | undefined;

    for (let attempt = 0; attempt < this.config.retries; attempt++) {
      try {
        const response = await fetch(`${this.config.apiUrl}/api/v0/add`, {
          method: "POST",
          body: formData,
          signal: AbortSignal.timeout(this.config.timeout * 2), // Double timeout for large files
        });

        if (!response.ok) {
          throw new Error(`IPFS API error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        return result.Hash;
      } catch (error) {
        lastError = error as Error;

        if (attempt < this.config.retries - 1) {
          await this.sleep(Math.pow(2, attempt) * 1000);
        }
      }
    }

    throw new IPFSError(
      `Failed to publish audio to IPFS after ${this.config.retries} attempts`,
      lastError
    );
  }

  /**
   * Check if a CID exists on IPFS
   */
  async exists(cid: string): Promise<boolean> {
    try {
      const url = getGatewayUrl(cid, this.config.gatewayUrl);
      const response = await fetch(url, {
        method: "HEAD",
        signal: AbortSignal.timeout(10000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Pin a CID to the local IPFS node
   */
  async pin(cid: string): Promise<void> {
    const response = await fetch(
      `${this.config.apiUrl}/api/v0/pin/add?arg=${cid}`,
      {
        method: "POST",
        signal: AbortSignal.timeout(this.config.timeout),
      }
    );

    if (!response.ok) {
      throw new IPFSError(
        `Failed to pin CID: ${response.status} ${response.statusText}`
      );
    }
  }

  /**
   * Get the gateway URL for a CID
   */
  getGatewayUrl(cid: string): string {
    return getGatewayUrl(cid, this.config.gatewayUrl);
  }

  /**
   * Create FormData for IPFS upload
   */
  private createFormData(data: Uint8Array | Buffer, filename: string = "declaration.json"): FormData {
    const formData = new FormData();
    // Convert to regular array for Blob compatibility in Node.js
    const arr = new Uint8Array(data);
    const blob = new Blob([arr.slice().buffer as ArrayBuffer]);
    formData.append("file", blob, filename);
    return formData;
  }

  /**
   * Sleep for a given number of milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Create a new IPFS client with optional configuration
 */
export function createIPFSClient(config?: IPFSClientConfig): IPFSClient {
  return new IPFSClient(config);
}

/**
 * Default IPFS client instance
 */
export const ipfs = new IPFSClient();
