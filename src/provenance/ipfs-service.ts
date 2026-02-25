/**
 * o8 IPFS Service
 *
 * Production-ready IPFS integration with:
 * - Local Kubo node support
 * - Pinata pinning service
 * - Web3.storage support
 * - Automatic failover
 * - Connection health monitoring
 */

import { createHash, randomBytes } from 'crypto';
import { CreatorIdentity, CreativeDeclaration } from '../core/types.v2.js';

// ============================================================================
// TYPES
// ============================================================================

export interface IPFSServiceConfig {
  /** Local IPFS node API URL */
  localNodeUrl?: string;
  /** Pinata API key */
  pinataApiKey?: string;
  /** Pinata secret key */
  pinataSecretKey?: string;
  /** Web3.storage API token */
  web3StorageToken?: string;
  /** IPFS gateway URL for retrieval */
  gatewayUrl?: string;
  /** Timeout in milliseconds */
  timeout?: number;
  /** Preferred provider order */
  preferredProviders?: ('local' | 'pinata' | 'web3storage')[];
}

export interface PublishResult {
  /** IPFS Content Identifier */
  cid: string;
  /** Gateway URL for public access */
  gatewayUrl: string;
  /** Provider used for publishing */
  provider: 'local' | 'pinata' | 'web3storage';
  /** Size in bytes */
  size: number;
  /** Timestamp */
  timestamp: string;
}

export interface ProviderStatus {
  provider: 'local' | 'pinata' | 'web3storage';
  available: boolean;
  latencyMs?: number;
  error?: string;
}

// ============================================================================
// IPFS SERVICE
// ============================================================================

export class IPFSService {
  private config: Required<IPFSServiceConfig>;
  private providerStatus: Map<string, ProviderStatus> = new Map();

  constructor(config: IPFSServiceConfig = {}) {
    this.config = {
      localNodeUrl: config.localNodeUrl || process.env.IPFS_API_URL || 'http://127.0.0.1:5001',
      pinataApiKey: config.pinataApiKey || process.env.PINATA_API_KEY || '',
      pinataSecretKey: config.pinataSecretKey || process.env.PINATA_SECRET_KEY || '',
      web3StorageToken: config.web3StorageToken || process.env.WEB3_STORAGE_TOKEN || '',
      gatewayUrl: config.gatewayUrl || process.env.IPFS_GATEWAY || 'https://ipfs.io',
      timeout: config.timeout || 30000,
      preferredProviders: config.preferredProviders || ['local', 'pinata', 'web3storage'],
    };
  }

  /**
   * Check health of all configured providers
   */
  async checkHealth(): Promise<ProviderStatus[]> {
    const checks = await Promise.all([
      this.checkLocalNode(),
      this.checkPinata(),
      this.checkWeb3Storage(),
    ]);

    checks.forEach(status => {
      this.providerStatus.set(status.provider, status);
    });

    return checks;
  }

  /**
   * Check local IPFS node health
   */
  private async checkLocalNode(): Promise<ProviderStatus> {
    const start = Date.now();
    try {
      const response = await fetch(`${this.config.localNodeUrl}/api/v0/id`, {
        method: 'POST',
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        return {
          provider: 'local',
          available: true,
          latencyMs: Date.now() - start,
        };
      }
      throw new Error(`Status ${response.status}`);
    } catch (error) {
      return {
        provider: 'local',
        available: false,
        error: (error as Error).message,
      };
    }
  }

  /**
   * Check Pinata API health
   */
  private async checkPinata(): Promise<ProviderStatus> {
    if (!this.config.pinataApiKey) {
      return { provider: 'pinata', available: false, error: 'No API key configured' };
    }

    const start = Date.now();
    try {
      const response = await fetch('https://api.pinata.cloud/data/testAuthentication', {
        headers: {
          'pinata_api_key': this.config.pinataApiKey,
          'pinata_secret_api_key': this.config.pinataSecretKey,
        },
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        return {
          provider: 'pinata',
          available: true,
          latencyMs: Date.now() - start,
        };
      }
      throw new Error(`Status ${response.status}`);
    } catch (error) {
      return {
        provider: 'pinata',
        available: false,
        error: (error as Error).message,
      };
    }
  }

  /**
   * Check Web3.storage API health
   */
  private async checkWeb3Storage(): Promise<ProviderStatus> {
    if (!this.config.web3StorageToken) {
      return { provider: 'web3storage', available: false, error: 'No token configured' };
    }

    const start = Date.now();
    try {
      const response = await fetch('https://api.web3.storage/user/account', {
        headers: {
          'Authorization': `Bearer ${this.config.web3StorageToken}`,
        },
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        return {
          provider: 'web3storage',
          available: true,
          latencyMs: Date.now() - start,
        };
      }
      throw new Error(`Status ${response.status}`);
    } catch (error) {
      return {
        provider: 'web3storage',
        available: false,
        error: (error as Error).message,
      };
    }
  }

  /**
   * Get the first available provider
   */
  private async getAvailableProvider(): Promise<'local' | 'pinata' | 'web3storage' | null> {
    // Check cached status first
    for (const provider of this.config.preferredProviders) {
      const status = this.providerStatus.get(provider);
      if (status?.available) {
        return provider;
      }
    }

    // Refresh health checks
    await this.checkHealth();

    for (const provider of this.config.preferredProviders) {
      const status = this.providerStatus.get(provider);
      if (status?.available) {
        return provider;
      }
    }

    return null;
  }

  /**
   * Publish JSON data to IPFS
   */
  async publishJSON(data: object, filename?: string): Promise<PublishResult> {
    const json = JSON.stringify(data, null, 2);
    const bytes = new TextEncoder().encode(json);
    return this.publish(bytes, filename || 'data.json', 'application/json');
  }

  /**
   * Publish a CreatorIdentity to IPFS
   */
  async publishIdentity(identity: CreatorIdentity): Promise<PublishResult & { identity: CreatorIdentity }> {
    const result = await this.publishJSON(identity, `${identity.identity_id}.json`);
    return { ...result, identity };
  }

  /**
   * Publish a CreativeDeclaration to IPFS
   */
  async publishDeclaration(declaration: CreativeDeclaration): Promise<PublishResult & { declaration: CreativeDeclaration }> {
    const result = await this.publishJSON(declaration, `${declaration.declaration_id}.json`);
    return { ...result, declaration };
  }

  /**
   * Publish binary data to IPFS
   */
  async publish(
    data: Uint8Array,
    filename: string,
    contentType: string = 'application/octet-stream'
  ): Promise<PublishResult> {
    const provider = await this.getAvailableProvider();

    if (!provider) {
      throw new Error('No IPFS provider available. Configure local node, Pinata, or Web3.storage.');
    }

    switch (provider) {
      case 'local':
        return this.publishToLocal(data, filename);
      case 'pinata':
        return this.publishToPinata(data, filename, contentType);
      case 'web3storage':
        return this.publishToWeb3Storage(data, filename, contentType);
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  /**
   * Publish to local IPFS node
   */
  private async publishToLocal(data: Uint8Array, filename: string): Promise<PublishResult> {
    const formData = new FormData();
    const blob = new Blob([data.buffer as ArrayBuffer]);
    formData.append('file', blob, filename);

    const response = await fetch(`${this.config.localNodeUrl}/api/v0/add?pin=true`, {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(this.config.timeout),
    });

    if (!response.ok) {
      throw new Error(`Local IPFS error: ${response.status}`);
    }

    const result = await response.json();

    return {
      cid: result.Hash,
      gatewayUrl: `${this.config.gatewayUrl}/ipfs/${result.Hash}`,
      provider: 'local',
      size: data.length,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Publish to Pinata
   */
  private async publishToPinata(
    data: Uint8Array,
    filename: string,
    contentType: string
  ): Promise<PublishResult> {
    const formData = new FormData();
    const blob = new Blob([data.buffer as ArrayBuffer], { type: contentType });
    formData.append('file', blob, filename);

    // Add metadata
    formData.append('pinataMetadata', JSON.stringify({
      name: filename,
      keyvalues: {
        source: 'o8-protocol',
        timestamp: new Date().toISOString(),
      },
    }));

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': this.config.pinataApiKey,
        'pinata_secret_api_key': this.config.pinataSecretKey,
      },
      body: formData,
      signal: AbortSignal.timeout(this.config.timeout),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Pinata error: ${response.status} - ${error}`);
    }

    const result = await response.json();

    return {
      cid: result.IpfsHash,
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
      provider: 'pinata',
      size: data.length,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Publish to Web3.storage
   */
  private async publishToWeb3Storage(
    data: Uint8Array,
    filename: string,
    contentType: string
  ): Promise<PublishResult> {
    const blob = new Blob([data.buffer as ArrayBuffer], { type: contentType });

    const response = await fetch('https://api.web3.storage/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.web3StorageToken}`,
        'X-Name': filename,
      },
      body: blob,
      signal: AbortSignal.timeout(this.config.timeout),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Web3.storage error: ${response.status} - ${error}`);
    }

    const result = await response.json();

    return {
      cid: result.cid,
      gatewayUrl: `https://w3s.link/ipfs/${result.cid}`,
      provider: 'web3storage',
      size: data.length,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Fetch data from IPFS by CID
   */
  async fetch(cid: string): Promise<Uint8Array> {
    // Try multiple gateways
    const gateways = [
      this.config.gatewayUrl,
      'https://ipfs.io',
      'https://dweb.link',
      'https://cloudflare-ipfs.com',
    ];

    for (const gateway of gateways) {
      try {
        const url = `${gateway}/ipfs/${cid}`;
        const response = await fetch(url, {
          signal: AbortSignal.timeout(this.config.timeout),
        });

        if (response.ok) {
          const buffer = await response.arrayBuffer();
          return new Uint8Array(buffer);
        }
      } catch {
        continue;
      }
    }

    throw new Error(`Failed to fetch CID ${cid} from any gateway`);
  }

  /**
   * Fetch JSON from IPFS
   */
  async fetchJSON<T = unknown>(cid: string): Promise<T> {
    const data = await this.fetch(cid);
    const json = new TextDecoder().decode(data);
    return JSON.parse(json) as T;
  }

  /**
   * Fetch a CreatorIdentity from IPFS
   */
  async fetchIdentity(cid: string): Promise<CreatorIdentity> {
    const identity = await this.fetchJSON<CreatorIdentity>(cid);
    if (identity.version !== '2.0') {
      throw new Error(`Invalid identity version: ${identity.version}`);
    }
    return identity;
  }

  /**
   * Fetch a CreativeDeclaration from IPFS
   */
  async fetchDeclaration(cid: string): Promise<CreativeDeclaration> {
    const declaration = await this.fetchJSON<CreativeDeclaration>(cid);
    if (declaration.version !== '2.0') {
      throw new Error(`Invalid declaration version: ${declaration.version}`);
    }
    return declaration;
  }

  /**
   * Get gateway URL for a CID
   */
  getGatewayUrl(cid: string): string {
    return `${this.config.gatewayUrl}/ipfs/${cid}`;
  }

  /**
   * Check if a CID exists on IPFS
   */
  async exists(cid: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.gatewayUrl}/ipfs/${cid}`, {
        method: 'HEAD',
        signal: AbortSignal.timeout(10000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let serviceInstance: IPFSService | null = null;

export function getIPFSService(config?: IPFSServiceConfig): IPFSService {
  if (!serviceInstance) {
    serviceInstance = new IPFSService(config);
  }
  return serviceInstance;
}

export function createIPFSService(config?: IPFSServiceConfig): IPFSService {
  return new IPFSService(config);
}
