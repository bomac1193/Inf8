/**
 * Ø8 Declaration Builder
 * Fluent API for constructing valid declarations
 */

import { randomUUID } from "crypto";
import type {
  Declaration,
  PrimaryArtist,
  Collaborator,
  Contributor,
  AIModel,
  Sample,
  AIContribution,
  SourceMaterial,
  SampleReference,
  Stem,
  AudioFingerprint,
} from "./types.js";
import {
  validateDeclaration,
  validateWalletAddress,
  validateCID,
} from "./validate.js";

/**
 * Error thrown when builder validation fails
 */
export class DeclarationBuilderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DeclarationBuilderError";
  }
}

/**
 * Fluent builder for creating Ø8 declarations
 *
 * @example
 * ```typescript
 * const declaration = new DeclarationBuilder()
 *   .setArtist({ name: "Producer X", wallet: "0x..." })
 *   .addCollaborator({ name: "Vocalist", role: "vocals", split: 0.3 })
 *   .addDAW("Ableton Live 12")
 *   .addAIModel({ name: "Suno v3", provider: "Suno", usage: "melody generation" })
 *   .setAIContribution({
 *     composition: 0.4,
 *     arrangement: 0.2,
 *     production: 0.1,
 *     mixing: 0,
 *     mastering: 0
 *   })
 *   .setMethodology("AI-assisted composition with human arrangement")
 *   .setAudioFingerprint({
 *     sha256: "...",
 *     duration_ms: 180000,
 *     format: "wav"
 *   })
 *   .build()
 * ```
 */
export class DeclarationBuilder {
  private declaration: Partial<Declaration>;
  private timestamp: string;

  constructor() {
    this.timestamp = new Date().toISOString();
    this.declaration = {
      version: "1.0",
      declaration_id: `o8-pending-${randomUUID()}`,
      created_at: this.timestamp,
      updated_at: this.timestamp,
      identity: {
        primary_artist: { name: "" },
        collaborators: [],
        contributors: [],
      },
      creative_stack: {
        daws: [],
        plugins: [],
        ai_models: [],
        hardware: [],
        samples: [],
      },
      production_intelligence: {
        ai_contribution: {
          composition: 0,
          arrangement: 0,
          production: 0,
          mixing: 0,
          mastering: 0,
        },
        methodology: "",
      },
      provenance: {
        source_material: [],
        samples: [],
        stems: [],
      },
      revision_history: [],
      audio_fingerprint: {
        sha256: "",
        duration_ms: 0,
        format: "",
      },
    };
  }

  /**
   * Set the primary artist
   */
  setArtist(artist: PrimaryArtist): this {
    if (!artist.name || artist.name.trim() === "") {
      throw new DeclarationBuilderError("Artist name is required");
    }

    if (artist.wallet && !validateWalletAddress(artist.wallet)) {
      throw new DeclarationBuilderError("Invalid wallet address format");
    }

    this.declaration.identity!.primary_artist = artist;
    this.updateTimestamp();
    return this;
  }

  /**
   * Add a collaborator with optional revenue split
   */
  addCollaborator(collaborator: Collaborator): this {
    if (!collaborator.name || collaborator.name.trim() === "") {
      throw new DeclarationBuilderError("Collaborator name is required");
    }

    if (!collaborator.role || collaborator.role.trim() === "") {
      throw new DeclarationBuilderError("Collaborator role is required");
    }

    if (collaborator.wallet && !validateWalletAddress(collaborator.wallet)) {
      throw new DeclarationBuilderError(
        `Invalid wallet address for collaborator ${collaborator.name}`
      );
    }

    if (
      collaborator.split !== undefined &&
      (collaborator.split < 0 || collaborator.split > 1)
    ) {
      throw new DeclarationBuilderError("Split must be between 0 and 1");
    }

    this.declaration.identity!.collaborators.push(collaborator);
    this.updateTimestamp();
    return this;
  }

  /**
   * Add a contributor
   */
  addContributor(contributor: Contributor): this {
    if (!contributor.name || contributor.name.trim() === "") {
      throw new DeclarationBuilderError("Contributor name is required");
    }

    if (!contributor.role || contributor.role.trim() === "") {
      throw new DeclarationBuilderError("Contributor role is required");
    }

    if (!contributor.contribution || contributor.contribution.trim() === "") {
      throw new DeclarationBuilderError("Contribution description is required");
    }

    this.declaration.identity!.contributors.push(contributor);
    this.updateTimestamp();
    return this;
  }

  /**
   * Add a DAW to the creative stack
   */
  addDAW(daw: string): this {
    if (!daw || daw.trim() === "") {
      throw new DeclarationBuilderError("DAW name is required");
    }

    this.declaration.creative_stack!.daws.push(daw.trim());
    this.updateTimestamp();
    return this;
  }

  /**
   * Add multiple DAWs at once
   */
  setDAWs(daws: string[]): this {
    this.declaration.creative_stack!.daws = daws.filter(
      (d) => d && d.trim() !== ""
    );
    this.updateTimestamp();
    return this;
  }

  /**
   * Add a plugin to the creative stack
   */
  addPlugin(plugin: string): this {
    if (!plugin || plugin.trim() === "") {
      throw new DeclarationBuilderError("Plugin name is required");
    }

    this.declaration.creative_stack!.plugins.push(plugin.trim());
    this.updateTimestamp();
    return this;
  }

  /**
   * Add multiple plugins at once
   */
  setPlugins(plugins: string[]): this {
    this.declaration.creative_stack!.plugins = plugins.filter(
      (p) => p && p.trim() !== ""
    );
    this.updateTimestamp();
    return this;
  }

  /**
   * Add an AI model to the creative stack
   */
  addAIModel(model: AIModel): this {
    if (!model.name || model.name.trim() === "") {
      throw new DeclarationBuilderError("AI model name is required");
    }

    if (!model.provider || model.provider.trim() === "") {
      throw new DeclarationBuilderError("AI model provider is required");
    }

    if (!model.usage || model.usage.trim() === "") {
      throw new DeclarationBuilderError("AI model usage description is required");
    }

    this.declaration.creative_stack!.ai_models.push(model);
    this.updateTimestamp();
    return this;
  }

  /**
   * Add hardware to the creative stack
   */
  addHardware(hardware: string): this {
    if (!hardware || hardware.trim() === "") {
      throw new DeclarationBuilderError("Hardware name is required");
    }

    this.declaration.creative_stack!.hardware.push(hardware.trim());
    this.updateTimestamp();
    return this;
  }

  /**
   * Add a sample to the creative stack
   */
  addSample(sample: Sample): this {
    if (!sample.name || sample.name.trim() === "") {
      throw new DeclarationBuilderError("Sample name is required");
    }

    if (!sample.source || sample.source.trim() === "") {
      throw new DeclarationBuilderError("Sample source is required");
    }

    this.declaration.creative_stack!.samples.push(sample);
    this.updateTimestamp();
    return this;
  }

  /**
   * Set AI contribution percentages for all phases
   */
  setAIContribution(contribution: AIContribution): this {
    const phases: (keyof AIContribution)[] = [
      "composition",
      "arrangement",
      "production",
      "mixing",
      "mastering",
    ];

    for (const phase of phases) {
      const value = contribution[phase];
      if (value < 0 || value > 1) {
        throw new DeclarationBuilderError(
          `AI contribution for ${phase} must be between 0 and 1`
        );
      }
    }

    this.declaration.production_intelligence!.ai_contribution = contribution;
    this.updateTimestamp();
    return this;
  }

  /**
   * Set methodology description
   */
  setMethodology(methodology: string): this {
    if (!methodology || methodology.trim() === "") {
      throw new DeclarationBuilderError("Methodology description is required");
    }

    this.declaration.production_intelligence!.methodology = methodology.trim();
    this.updateTimestamp();
    return this;
  }

  /**
   * Set production notes
   */
  setNotes(notes: string): this {
    this.declaration.production_intelligence!.notes = notes.trim();
    this.updateTimestamp();
    return this;
  }

  /**
   * Set IPFS CID for the audio file
   */
  setIPFSCID(cid: string): this {
    if (!validateCID(cid)) {
      throw new DeclarationBuilderError("Invalid IPFS CID format");
    }

    this.declaration.provenance!.ipfs_cid = cid;
    this.updateTimestamp();
    return this;
  }

  /**
   * Add source material reference
   */
  addSourceMaterial(source: SourceMaterial): this {
    if (!validateCID(source.cid)) {
      throw new DeclarationBuilderError("Invalid source material CID format");
    }

    if (!source.description || source.description.trim() === "") {
      throw new DeclarationBuilderError("Source material description is required");
    }

    this.declaration.provenance!.source_material.push(source);
    this.updateTimestamp();
    return this;
  }

  /**
   * Add sample reference with CID
   */
  addSampleReference(sample: SampleReference): this {
    if (!validateCID(sample.cid)) {
      throw new DeclarationBuilderError("Invalid sample CID format");
    }

    if (!sample.name || sample.name.trim() === "") {
      throw new DeclarationBuilderError("Sample name is required");
    }

    this.declaration.provenance!.samples.push(sample);
    this.updateTimestamp();
    return this;
  }

  /**
   * Add stem export
   */
  addStem(stem: Stem): this {
    if (!validateCID(stem.cid)) {
      throw new DeclarationBuilderError("Invalid stem CID format");
    }

    if (!stem.name || stem.name.trim() === "") {
      throw new DeclarationBuilderError("Stem name is required");
    }

    this.declaration.provenance!.stems.push(stem);
    this.updateTimestamp();
    return this;
  }

  /**
   * Set audio fingerprint
   */
  setAudioFingerprint(fingerprint: AudioFingerprint): this {
    if (!/^[a-fA-F0-9]{64}$/.test(fingerprint.sha256)) {
      throw new DeclarationBuilderError("Invalid SHA-256 hash format");
    }

    if (fingerprint.duration_ms <= 0) {
      throw new DeclarationBuilderError("Duration must be positive");
    }

    if (!fingerprint.format || fingerprint.format.trim() === "") {
      throw new DeclarationBuilderError("Audio format is required");
    }

    this.declaration.audio_fingerprint = fingerprint;
    this.updateTimestamp();
    return this;
  }

  /**
   * Add a revision entry
   */
  addRevision(version: string, changes: string, previousCID?: string): this {
    if (!version || version.trim() === "") {
      throw new DeclarationBuilderError("Revision version is required");
    }

    if (!changes || changes.trim() === "") {
      throw new DeclarationBuilderError("Revision changes description is required");
    }

    if (previousCID && !validateCID(previousCID)) {
      throw new DeclarationBuilderError("Invalid previous CID format");
    }

    this.declaration.revision_history!.push({
      version: version.trim(),
      timestamp: new Date().toISOString(),
      changes: changes.trim(),
      previous_cid: previousCID,
    });

    this.updateTimestamp();
    return this;
  }

  /**
   * Set declaration ID (usually after IPFS publish)
   */
  setDeclarationId(id: string): this {
    if (!id || id.trim() === "") {
      throw new DeclarationBuilderError("Declaration ID is required");
    }

    this.declaration.declaration_id = id.trim();
    this.updateTimestamp();
    return this;
  }

  /**
   * Build and validate the complete declaration
   */
  build(): Declaration {
    // Ensure required fields are set
    if (
      !this.declaration.identity?.primary_artist?.name ||
      this.declaration.identity.primary_artist.name.trim() === ""
    ) {
      throw new DeclarationBuilderError("Artist name must be set before building");
    }

    if (
      !this.declaration.production_intelligence?.methodology ||
      this.declaration.production_intelligence.methodology.trim() === ""
    ) {
      throw new DeclarationBuilderError("Methodology must be set before building");
    }

    if (
      !this.declaration.audio_fingerprint?.sha256 ||
      this.declaration.audio_fingerprint.sha256 === ""
    ) {
      throw new DeclarationBuilderError(
        "Audio fingerprint must be set before building"
      );
    }

    // Final update timestamp
    this.updateTimestamp();

    // Validate the complete declaration
    const result = validateDeclaration(this.declaration);

    if (!result.valid) {
      throw new DeclarationBuilderError(
        `Invalid declaration: ${result.errors.join(", ")}`
      );
    }

    return result.data;
  }

  /**
   * Get current state without validation (for inspection)
   */
  toJSON(): Partial<Declaration> {
    return { ...this.declaration };
  }

  /**
   * Update the updated_at timestamp
   */
  private updateTimestamp(): void {
    this.declaration.updated_at = new Date().toISOString();
  }
}

/**
 * Create a new declaration builder
 */
export function createDeclaration(): DeclarationBuilder {
  return new DeclarationBuilder();
}
