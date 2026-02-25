/**
 * o8 IPFS Identity Publisher
 *
 * Extends the IPFS client to support v2 CreatorIdentity publishing
 */

import { IPFSClient, IPFSError, PublishResult } from './client.js';
import { CreatorIdentity, CreativeDeclaration } from '../core/types.v2.js';
import { generateDeclarationId, getGatewayUrl } from '../core/id.js';

export interface IdentityPublishResult extends PublishResult {
  /** The identity that was published */
  identity: CreatorIdentity;
}

export interface DeclarationPublishResult extends PublishResult {
  /** The declaration that was published */
  declaration: CreativeDeclaration;
}

/**
 * Extended IPFS client for o8 v2.0 Creative Identity Protocol
 */
export class IdentityIPFSClient extends IPFSClient {
  /**
   * Publish a CreatorIdentity to IPFS
   */
  async publishIdentity(identity: CreatorIdentity): Promise<IdentityPublishResult> {
    // Serialize to JSON
    const json = JSON.stringify(identity, null, 2);
    const data = new TextEncoder().encode(json);

    // Create form data
    const formData = new FormData();
    const blob = new Blob([data.buffer as ArrayBuffer]);
    formData.append('file', blob, `${identity.identity_id}.json`);

    try {
      const response = await fetch(`${this.getApiUrl()}/api/v0/add`, {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) {
        throw new Error(`IPFS API error: ${response.status}`);
      }

      const result = await response.json();
      const cid = result.Hash;

      return {
        cid,
        declarationId: generateDeclarationId(cid),
        gatewayUrl: this.getGatewayUrl(cid),
        identity,
      };
    } catch (error) {
      throw new IPFSError('Failed to publish identity to IPFS', error as Error);
    }
  }

  /**
   * Publish a CreativeDeclaration to IPFS
   */
  async publishDeclaration(declaration: CreativeDeclaration): Promise<DeclarationPublishResult> {
    const json = JSON.stringify(declaration, null, 2);
    const data = new TextEncoder().encode(json);

    const formData = new FormData();
    const blob = new Blob([data.buffer as ArrayBuffer]);
    formData.append('file', blob, `${declaration.declaration_id}.json`);

    try {
      const response = await fetch(`${this.getApiUrl()}/api/v0/add`, {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) {
        throw new Error(`IPFS API error: ${response.status}`);
      }

      const result = await response.json();
      const cid = result.Hash;

      return {
        cid,
        declarationId: generateDeclarationId(cid),
        gatewayUrl: this.getGatewayUrl(cid),
        declaration,
      };
    } catch (error) {
      throw new IPFSError('Failed to publish declaration to IPFS', error as Error);
    }
  }

  /**
   * Fetch a CreatorIdentity from IPFS
   */
  async fetchIdentity(cid: string): Promise<CreatorIdentity> {
    try {
      const url = this.getGatewayUrl(cid);
      const response = await fetch(url, {
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) {
        throw new Error(`IPFS fetch error: ${response.status}`);
      }

      const identity = await response.json();

      // Validate version
      if (identity.version !== '2.0') {
        throw new IPFSError(`Invalid identity version: ${identity.version}`);
      }

      return identity as CreatorIdentity;
    } catch (error) {
      throw new IPFSError(`Failed to fetch identity from IPFS: ${cid}`, error as Error);
    }
  }

  /**
   * Fetch a CreativeDeclaration from IPFS
   */
  async fetchDeclaration(cid: string): Promise<CreativeDeclaration> {
    try {
      const url = this.getGatewayUrl(cid);
      const response = await fetch(url, {
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) {
        throw new Error(`IPFS fetch error: ${response.status}`);
      }

      const declaration = await response.json();

      // Validate version
      if (declaration.version !== '2.0') {
        throw new IPFSError(`Invalid declaration version: ${declaration.version}`);
      }

      return declaration as CreativeDeclaration;
    } catch (error) {
      throw new IPFSError(`Failed to fetch declaration from IPFS: ${cid}`, error as Error);
    }
  }

  /**
   * Get the configured API URL
   */
  private getApiUrl(): string {
    return process.env.IPFS_API_URL || 'http://127.0.0.1:5001';
  }
}

/**
 * Create a new identity IPFS client
 */
export function createIdentityIPFSClient(): IdentityIPFSClient {
  return new IdentityIPFSClient();
}

/**
 * Default identity IPFS client instance
 */
export const identityIPFS = new IdentityIPFSClient();
