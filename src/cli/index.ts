#!/usr/bin/env node
/**
 * Ø8 Command Line Interface
 * Creative provenance protocol for AI-native music
 */

import { Command } from "commander";
import chalk from "chalk";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { resolve } from "path";

import type { Declaration } from "../core/types.js";
import {
  fingerprintAudio,
  formatDuration,
  isSupportedFormat,
} from "../core/fingerprint.js";
import { validateDeclaration, calculateTransparencyScore } from "../core/validate.js";
import { generateDeclarationId, extractCID, getGatewayUrl } from "../core/id.js";
import { createIPFSClient } from "../ipfs/client.js";
import {
  verifyDeclaration,
  formatVerificationResult,
} from "../verify/index.js";
import { runWizard } from "./wizard.js";

const program = new Command();

// ASCII art logo
const LOGO = `
  ██████╗  █████╗
 ██╔═══██╗██╔══██╗
 ██║   ██║╚█████╔╝
 ██║   ██║██╔══██╗
 ╚██████╔╝╚█████╔╝
  ╚═════╝  ╚════╝
`;

program
  .name("o8")
  .description("∞8 ARCH — Declarations v1.0 — Creative provenance protocol for AI-native music")
  .version("1.0.0")
  .option("--json", "Output in JSON format")
  .option("--quiet", "Minimal output");

/**
 * o8 init - Interactive wizard to create new declaration
 */
program
  .command("init")
  .description("Create a new declaration interactively")
  .option("-o, --output <file>", "Output file", "o8-declaration.json")
  .action(async (options) => {
    try {
      const declaration = await runWizard();

      await writeFile(
        options.output,
        JSON.stringify(declaration, null, 2),
        "utf-8"
      );

      console.log(chalk.green(`\nDeclaration saved to ${options.output}`));
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

/**
 * o8 declare <audio-file> - Generate declaration for audio file
 */
program
  .command("declare <audio-file>")
  .description("Create a declaration for an audio file")
  .option("-o, --output <file>", "Output file", "o8-declaration.json")
  .action(async (audioFile, options) => {
    try {
      const filePath = resolve(audioFile);

      if (!existsSync(filePath)) {
        console.error(chalk.red(`File not found: ${filePath}`));
        process.exit(1);
      }

      if (!isSupportedFormat(filePath)) {
        console.error(chalk.red("Unsupported audio format"));
        process.exit(1);
      }

      console.log(chalk.cyan("Generating audio fingerprint..."));
      const fingerprint = await fingerprintAudio(filePath);

      console.log(chalk.gray(`\nSHA-256: ${fingerprint.sha256}`));
      console.log(chalk.gray(`Duration: ${formatDuration(fingerprint.duration_ms)}`));
      console.log(chalk.gray(`Format: ${fingerprint.format}`));
      if (fingerprint.sample_rate) {
        console.log(chalk.gray(`Sample Rate: ${fingerprint.sample_rate}Hz`));
      }

      // Run wizard with pre-filled fingerprint
      const declaration = await runWizard(filePath);

      await writeFile(
        options.output,
        JSON.stringify(declaration, null, 2),
        "utf-8"
      );

      console.log(chalk.green(`\nDeclaration saved to ${options.output}`));
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

/**
 * o8 publish [declaration-file] - Publish declaration to IPFS
 */
program
  .command("publish [file]")
  .description("Publish a declaration to IPFS")
  .option("-g, --gateway <url>", "IPFS gateway URL", "https://ipfs.io")
  .action(async (file, options) => {
    try {
      const filePath = resolve(file || "o8-declaration.json");

      if (!existsSync(filePath)) {
        console.error(chalk.red(`File not found: ${filePath}`));
        process.exit(1);
      }

      console.log(chalk.cyan("Reading declaration..."));
      const content = await readFile(filePath, "utf-8");
      const declaration = JSON.parse(content) as Declaration;

      // Validate
      const validation = validateDeclaration(declaration);
      if (!validation.valid) {
        console.error(chalk.red("Invalid declaration:"));
        validation.errors.forEach((e) => console.error(chalk.red(`  - ${e}`)));
        process.exit(1);
      }

      console.log(chalk.cyan("Publishing to IPFS..."));
      const ipfs = createIPFSClient({ gatewayUrl: options.gateway });

      try {
        const result = await ipfs.publish(declaration);

        // Update declaration with final ID
        declaration.declaration_id = result.declarationId;

        // Save updated declaration
        await writeFile(filePath, JSON.stringify(declaration, null, 2), "utf-8");

        console.log(chalk.green("\nPublished successfully."));
        console.log(chalk.gray(`CID: ${result.cid}`));
        console.log(chalk.gray(`Declaration ID: ${result.declarationId}`));
        console.log(chalk.gray(`Gateway URL: ${result.gatewayUrl}`));
      } catch (error) {
        console.error(
          chalk.yellow("\nNote: IPFS publishing requires a running IPFS node.")
        );
        console.error(
          chalk.yellow("Install IPFS: https://docs.ipfs.tech/install/")
        );
        console.error(chalk.yellow("Then run: ipfs daemon"));
        console.error(chalk.red(`\nError: ${(error as Error).message}`));
        process.exit(1);
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

/**
 * o8 verify <cid> [audio-file] - Verify a declaration
 */
program
  .command("verify <cid>")
  .description("Verify a declaration from IPFS")
  .argument("[audio-file]", "Optional audio file for fingerprint verification")
  .option("-p, --provenance", "Check provenance sources exist")
  .option("-s, --signatures", "Verify cryptographic signatures")
  .action(async (cid, audioFile, options) => {
    try {
      console.log(chalk.cyan("Fetching declaration..."));

      const result = await verifyDeclaration(cid, {
        audioFile: audioFile ? resolve(audioFile) : undefined,
        checkProvenance: options.provenance,
        checkSignatures: options.signatures,
      });

      if (program.opts().json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log("");
        if (result.valid) {
          console.log(chalk.green("VERIFIED"));
        } else {
          console.log(chalk.red("VERIFICATION FAILED"));
        }
        console.log("");
        console.log(formatVerificationResult(result));
      }

      process.exit(result.valid ? 0 : 1);
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

/**
 * o8 view <cid> - Fetch and display a declaration
 */
program
  .command("view <cid>")
  .description("View a declaration from IPFS")
  .action(async (cid) => {
    try {
      console.log(chalk.cyan("Fetching declaration..."));

      const ipfs = createIPFSClient();
      const extractedCid = extractCID(cid);
      const declaration = await ipfs.fetch(extractedCid);

      if (program.opts().json) {
        console.log(JSON.stringify(declaration, null, 2));
        return;
      }

      // Pretty print
      console.log("");
      console.log(chalk.bold("∞8 ARCH Declaration"));
      console.log(chalk.gray("─".repeat(50)));
      console.log("");

      // Identity
      console.log(chalk.cyan("Artist:"), declaration.identity.primary_artist.name);
      if (declaration.identity.primary_artist.wallet) {
        console.log(chalk.gray(`Wallet: ${declaration.identity.primary_artist.wallet}`));
      }

      if (declaration.identity.collaborators.length > 0) {
        console.log(chalk.cyan("\nCollaborators:"));
        for (const collab of declaration.identity.collaborators) {
          console.log(
            chalk.gray(`  - ${collab.name} (${collab.role})${collab.split ? ` ${collab.split * 100}%` : ""}`)
          );
        }
      }

      // Creative Stack
      console.log(chalk.cyan("\nCreative Stack:"));
      if (declaration.creative_stack.daws.length > 0) {
        console.log(chalk.gray(`  DAWs: ${declaration.creative_stack.daws.join(", ")}`));
      }
      if (declaration.creative_stack.plugins.length > 0) {
        console.log(chalk.gray(`  Plugins: ${declaration.creative_stack.plugins.join(", ")}`));
      }
      if (declaration.creative_stack.ai_models.length > 0) {
        console.log(chalk.gray("  AI Models:"));
        for (const model of declaration.creative_stack.ai_models) {
          console.log(chalk.gray(`    - ${model.name} (${model.provider}): ${model.usage}`));
        }
      }

      // Production Intelligence
      console.log(chalk.cyan("\nAI Contribution:"));
      const ai = declaration.production_intelligence.ai_contribution;
      console.log(chalk.gray(`  Composition: ${(ai.composition * 100).toFixed(0)}%`));
      console.log(chalk.gray(`  Arrangement: ${(ai.arrangement * 100).toFixed(0)}%`));
      console.log(chalk.gray(`  Production: ${(ai.production * 100).toFixed(0)}%`));
      console.log(chalk.gray(`  Mixing: ${(ai.mixing * 100).toFixed(0)}%`));
      console.log(chalk.gray(`  Mastering: ${(ai.mastering * 100).toFixed(0)}%`));

      const transparencyScore = calculateTransparencyScore(declaration);
      console.log(chalk.cyan(`\nTransparency Score: ${transparencyScore}/100`));

      // Methodology
      console.log(chalk.cyan("\nMethodology:"));
      console.log(chalk.gray(declaration.production_intelligence.methodology));

      // Audio Fingerprint
      console.log(chalk.cyan("\nAudio Fingerprint:"));
      console.log(chalk.gray(`  SHA-256: ${declaration.audio_fingerprint.sha256}`));
      console.log(chalk.gray(`  Duration: ${formatDuration(declaration.audio_fingerprint.duration_ms)}`));
      console.log(chalk.gray(`  Format: ${declaration.audio_fingerprint.format}`));

      // IPFS
      console.log(chalk.cyan("\nIPFS:"));
      console.log(chalk.gray(`  CID: ${extractedCid}`));
      console.log(chalk.gray(`  Gateway: ${getGatewayUrl(extractedCid)}`));

      console.log("");
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

/**
 * o8 fingerprint <audio-file> - Generate fingerprint for audio file
 */
program
  .command("fingerprint <audio-file>")
  .description("Generate fingerprint for an audio file")
  .action(async (audioFile) => {
    try {
      const filePath = resolve(audioFile);

      if (!existsSync(filePath)) {
        console.error(chalk.red(`File not found: ${filePath}`));
        process.exit(1);
      }

      console.log(chalk.cyan("Generating fingerprint..."));
      const fingerprint = await fingerprintAudio(filePath);

      if (program.opts().json) {
        console.log(JSON.stringify(fingerprint, null, 2));
        return;
      }

      console.log("");
      console.log(chalk.bold("Audio Fingerprint"));
      console.log(chalk.gray("─".repeat(50)));
      console.log(chalk.gray(`SHA-256: ${fingerprint.sha256}`));
      console.log(chalk.gray(`Duration: ${formatDuration(fingerprint.duration_ms)} (${fingerprint.duration_ms}ms)`));
      console.log(chalk.gray(`Format: ${fingerprint.format}`));
      if (fingerprint.sample_rate) {
        console.log(chalk.gray(`Sample Rate: ${fingerprint.sample_rate}Hz`));
      }
      if (fingerprint.bit_depth) {
        console.log(chalk.gray(`Bit Depth: ${fingerprint.bit_depth}`));
      }
      console.log("");
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

/**
 * o8 validate <file> - Validate a declaration file
 */
program
  .command("validate <file>")
  .description("Validate a declaration JSON file")
  .action(async (file) => {
    try {
      const filePath = resolve(file);

      if (!existsSync(filePath)) {
        console.error(chalk.red(`File not found: ${filePath}`));
        process.exit(1);
      }

      const content = await readFile(filePath, "utf-8");
      const data = JSON.parse(content);
      const result = validateDeclaration(data);

      if (program.opts().json) {
        console.log(JSON.stringify({ valid: result.valid, errors: result.valid ? [] : result.errors }, null, 2));
        process.exit(result.valid ? 0 : 1);
      }

      if (result.valid) {
        console.log(chalk.green("Valid declaration."));
        const score = calculateTransparencyScore(result.data);
        console.log(chalk.gray(`Transparency Score: ${score}/100`));
      } else {
        console.log(chalk.red("Invalid declaration:"));
        result.errors.forEach((e) => console.error(chalk.red(`  - ${e}`)));
        process.exit(1);
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

// Show logo on help
program.addHelpText("before", chalk.cyan(LOGO));

program.parse();
