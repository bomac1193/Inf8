/**
 * Ø8 Audio Fingerprinting
 * SHA-256 hashing and metadata extraction for audio files
 */

import { createHash } from "crypto";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import { extname } from "path";
import * as musicMetadata from "music-metadata";
import type { AudioFingerprint } from "./types.js";

/**
 * Supported audio formats
 */
export const SUPPORTED_FORMATS = [
  ".wav",
  ".mp3",
  ".flac",
  ".aiff",
  ".aif",
  ".m4a",
  ".ogg",
  ".opus",
] as const;

/**
 * Error thrown when fingerprinting fails
 */
export class FingerprintError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FingerprintError";
  }
}

/**
 * Check if a file format is supported
 */
export function isSupportedFormat(filePath: string): boolean {
  const ext = extname(filePath).toLowerCase();
  return SUPPORTED_FORMATS.includes(ext as typeof SUPPORTED_FORMATS[number]);
}

/**
 * Generate SHA-256 hash of a file
 */
export async function hashFile(filePath: string): Promise<string> {
  if (!existsSync(filePath)) {
    throw new FingerprintError(`File not found: ${filePath}`);
  }

  const buffer = await readFile(filePath);
  return createHash("sha256").update(buffer).digest("hex");
}

/**
 * Extract metadata from an audio file
 */
export async function extractMetadata(filePath: string): Promise<{
  duration_ms: number;
  format: string;
  sample_rate?: number;
  bit_depth?: number;
}> {
  if (!existsSync(filePath)) {
    throw new FingerprintError(`File not found: ${filePath}`);
  }

  const ext = extname(filePath).toLowerCase().replace(".", "");

  try {
    const metadata = await musicMetadata.parseFile(filePath);

    return {
      duration_ms: Math.round((metadata.format.duration || 0) * 1000),
      format: metadata.format.container || ext,
      sample_rate: metadata.format.sampleRate,
      bit_depth: metadata.format.bitsPerSample,
    };
  } catch (error) {
    // Fallback for unsupported formats - return basic info
    return {
      duration_ms: 0,
      format: ext,
    };
  }
}

/**
 * Generate complete audio fingerprint
 *
 * @example
 * ```typescript
 * const fingerprint = await fingerprintAudio("./track.wav");
 * console.log(fingerprint);
 * // {
 * //   sha256: "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
 * //   duration_ms: 213450,
 * //   format: "wav",
 * //   sample_rate: 48000,
 * //   bit_depth: 24
 * // }
 * ```
 */
export async function fingerprintAudio(
  filePath: string
): Promise<AudioFingerprint> {
  if (!existsSync(filePath)) {
    throw new FingerprintError(`File not found: ${filePath}`);
  }

  if (!isSupportedFormat(filePath)) {
    const ext = extname(filePath);
    throw new FingerprintError(
      `Unsupported format: ${ext}. Supported formats: ${SUPPORTED_FORMATS.join(", ")}`
    );
  }

  // Generate hash and extract metadata in parallel
  const [sha256, metadata] = await Promise.all([
    hashFile(filePath),
    extractMetadata(filePath),
  ]);

  return {
    sha256,
    ...metadata,
  };
}

/**
 * Verify that an audio file matches a declared fingerprint
 *
 * @example
 * ```typescript
 * const result = await verifyFingerprint("./track.wav", declared);
 * if (result.valid) {
 *   console.log("Fingerprint verified");
 * } else {
 *   console.log(`Mismatch: computed ${result.computed?.sha256}, declared ${result.declared?.sha256}`);
 * }
 * ```
 */
export async function verifyFingerprint(
  filePath: string,
  declared: AudioFingerprint
): Promise<{
  valid: boolean;
  computed: AudioFingerprint;
  declared: AudioFingerprint;
  mismatch?: {
    hash: boolean;
    duration: boolean;
    format: boolean;
  };
}> {
  const computed = await fingerprintAudio(filePath);

  const hashMatch = computed.sha256 === declared.sha256;
  const durationMatch = computed.duration_ms === declared.duration_ms;
  const formatMatch =
    computed.format.toLowerCase() === declared.format.toLowerCase();

  const valid = hashMatch && durationMatch && formatMatch;

  return {
    valid,
    computed,
    declared,
    mismatch: valid
      ? undefined
      : {
          hash: !hashMatch,
          duration: !durationMatch,
          format: !formatMatch,
        },
  };
}

/**
 * Format duration in milliseconds to human-readable string
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${remainingMinutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

/**
 * Format file size in bytes to human-readable string
 */
export function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}
