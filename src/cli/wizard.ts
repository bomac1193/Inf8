/**
 * Ø8 Interactive Declaration Wizard
 * Step-by-step prompts for creating declarations
 */

import inquirer from "inquirer";
import chalk from "chalk";
import type { Declaration, AIContribution, AIModel } from "../core/types.js";
import { DeclarationBuilder } from "../core/builder.js";
import { fingerprintAudio } from "../core/fingerprint.js";

/**
 * Common DAWs for quick selection
 */
const COMMON_DAWS = [
  "Ableton Live 12",
  "Logic Pro X",
  "FL Studio 24",
  "Pro Tools",
  "Cubase 14",
  "Studio One 6",
  "Reaper",
  "Bitwig Studio 5",
  "GarageBand",
  "Other",
];

/**
 * Common AI models for quick selection
 */
const COMMON_AI_MODELS = [
  "Suno v3",
  "Udio",
  "AIVA",
  "Amper Music",
  "OpenAI Jukebox",
  "Stability Audio",
  "Mubert",
  "Soundraw",
  "Boomy",
  "Other",
];

/**
 * Run the interactive declaration wizard
 */
export async function runWizard(audioFile?: string): Promise<Declaration> {
  console.log(chalk.bold("\nØ8 Declaration Wizard\n"));
  console.log(chalk.gray("Create a creative provenance declaration for your music.\n"));

  const builder = new DeclarationBuilder();

  // Step 1: Audio fingerprint (if file provided)
  if (audioFile) {
    console.log(chalk.cyan("Step 0: Audio Fingerprint\n"));
    const fingerprint = await fingerprintAudio(audioFile);
    console.log(chalk.gray(`  SHA-256: ${fingerprint.sha256}`));
    console.log(chalk.gray(`  Duration: ${Math.round(fingerprint.duration_ms / 1000)}s`));
    console.log(chalk.gray(`  Format: ${fingerprint.format}`));
    if (fingerprint.sample_rate) {
      console.log(chalk.gray(`  Sample Rate: ${fingerprint.sample_rate}Hz`));
    }
    console.log("");
    builder.setAudioFingerprint(fingerprint);
  }

  // Step 1: Artist Identity
  console.log(chalk.cyan("Step 1: Artist Identity\n"));

  const artistAnswers = await inquirer.prompt([
    {
      type: "input",
      name: "artistName",
      message: "Primary artist name:",
      validate: (input: string) => input.trim() !== "" || "Artist name is required",
    },
    {
      type: "input",
      name: "wallet",
      message: "Ethereum wallet address (optional):",
      default: "",
    },
    {
      type: "confirm",
      name: "hasCollaborators",
      message: "Add collaborators?",
      default: false,
    },
  ]);

  builder.setArtist({
    name: artistAnswers.artistName,
    wallet: artistAnswers.wallet || undefined,
  });

  // Add collaborators
  if (artistAnswers.hasCollaborators) {
    let addMore = true;
    while (addMore) {
      const collabAnswers = await inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: "Collaborator name:",
          validate: (input: string) => input.trim() !== "" || "Name is required",
        },
        {
          type: "input",
          name: "role",
          message: "Role (e.g., vocals, mixing, production):",
          validate: (input: string) => input.trim() !== "" || "Role is required",
        },
        {
          type: "number",
          name: "split",
          message: "Revenue split (0-100%):",
          default: 0,
        },
        {
          type: "confirm",
          name: "addAnother",
          message: "Add another collaborator?",
          default: false,
        },
      ]);

      builder.addCollaborator({
        name: collabAnswers.name,
        role: collabAnswers.role,
        split: collabAnswers.split / 100,
      });

      addMore = collabAnswers.addAnother;
    }
  }

  // Step 2: Creative Stack
  console.log(chalk.cyan("\nStep 2: Creative Stack\n"));

  const stackAnswers = await inquirer.prompt([
    {
      type: "checkbox",
      name: "daws",
      message: "DAWs used:",
      choices: COMMON_DAWS,
    },
    {
      type: "input",
      name: "plugins",
      message: "Plugins used (comma-separated):",
      default: "",
    },
    {
      type: "input",
      name: "hardware",
      message: "Hardware (comma-separated):",
      default: "",
    },
    {
      type: "confirm",
      name: "hasAIModels",
      message: "Did you use AI models in production?",
      default: false,
    },
  ]);

  // Handle DAWs (including "Other" option)
  const selectedDaws = stackAnswers.daws.filter((d: string) => d !== "Other");
  if (stackAnswers.daws.includes("Other")) {
    const otherDaw = await inquirer.prompt([
      {
        type: "input",
        name: "daw",
        message: "Specify other DAW:",
      },
    ]);
    if (otherDaw.daw) {
      selectedDaws.push(otherDaw.daw);
    }
  }
  builder.setDAWs(selectedDaws);

  // Plugins
  const plugins = stackAnswers.plugins
    .split(",")
    .map((p: string) => p.trim())
    .filter((p: string) => p !== "");
  builder.setPlugins(plugins);

  // Hardware
  const hardware = stackAnswers.hardware
    .split(",")
    .map((h: string) => h.trim())
    .filter((h: string) => h !== "");
  for (const h of hardware) {
    builder.addHardware(h);
  }

  // AI Models
  if (stackAnswers.hasAIModels) {
    let addMore = true;
    while (addMore) {
      // Select model name
      const nameAnswer = await inquirer.prompt([
        {
          type: "list",
          name: "name",
          message: "AI model used:",
          choices: COMMON_AI_MODELS,
        },
      ]);

      let modelName = nameAnswer.name;
      if (modelName === "Other") {
        const customAnswer = await inquirer.prompt([
          {
            type: "input",
            name: "customName",
            message: "Specify model name:",
          },
        ]);
        modelName = customAnswer.customName || modelName;
      }

      const detailsAnswer = await inquirer.prompt([
        {
          type: "input",
          name: "provider",
          message: "Provider/company:",
          validate: (input: string) => input.trim() !== "" || "Provider is required",
        },
        {
          type: "input",
          name: "usage",
          message: "What was it used for?",
          validate: (input: string) => input.trim() !== "" || "Usage description is required",
        },
        {
          type: "confirm",
          name: "addAnother",
          message: "Add another AI model?",
          default: false,
        },
      ]);

      const aiModel: AIModel = {
        name: modelName,
        provider: detailsAnswer.provider,
        usage: detailsAnswer.usage,
      };
      builder.addAIModel(aiModel);

      addMore = detailsAnswer.addAnother;
    }
  }

  // Step 3: Production Intelligence
  console.log(chalk.cyan("\nStep 3: Production Intelligence\n"));
  console.log(chalk.gray("Estimate AI contribution for each phase (0-100%):\n"));

  const aiContribAnswers = await inquirer.prompt([
    {
      type: "number",
      name: "composition",
      message: "Composition (melody, harmony, chords):",
      default: 0,
      validate: (input: number) =>
        (input >= 0 && input <= 100) || "Must be between 0 and 100",
    },
    {
      type: "number",
      name: "arrangement",
      message: "Arrangement (structure, sections):",
      default: 0,
      validate: (input: number) =>
        (input >= 0 && input <= 100) || "Must be between 0 and 100",
    },
    {
      type: "number",
      name: "production",
      message: "Production (sound design, layering):",
      default: 0,
      validate: (input: number) =>
        (input >= 0 && input <= 100) || "Must be between 0 and 100",
    },
    {
      type: "number",
      name: "mixing",
      message: "Mixing (levels, EQ, compression):",
      default: 0,
      validate: (input: number) =>
        (input >= 0 && input <= 100) || "Must be between 0 and 100",
    },
    {
      type: "number",
      name: "mastering",
      message: "Mastering (final polish):",
      default: 0,
      validate: (input: number) =>
        (input >= 0 && input <= 100) || "Must be between 0 and 100",
    },
    {
      type: "editor",
      name: "methodology",
      message: "Describe your creative methodology:",
      default: "Describe how you created this track, including how AI tools were integrated into your workflow.",
    },
  ]);

  const aiContribution: AIContribution = {
    composition: aiContribAnswers.composition / 100,
    arrangement: aiContribAnswers.arrangement / 100,
    production: aiContribAnswers.production / 100,
    mixing: aiContribAnswers.mixing / 100,
    mastering: aiContribAnswers.mastering / 100,
  };

  builder.setAIContribution(aiContribution);
  builder.setMethodology(aiContribAnswers.methodology);

  // Step 4: Audio fingerprint (if not already set)
  if (!audioFile) {
    console.log(chalk.cyan("\nStep 4: Audio Fingerprint\n"));

    const fingerprintAnswers = await inquirer.prompt([
      {
        type: "input",
        name: "sha256",
        message: "SHA-256 hash of audio file:",
        validate: (input: string) =>
          /^[a-fA-F0-9]{64}$/.test(input) || "Invalid SHA-256 hash format",
      },
      {
        type: "number",
        name: "duration_ms",
        message: "Duration in milliseconds:",
        validate: (input: number) => input > 0 || "Duration must be positive",
      },
      {
        type: "input",
        name: "format",
        message: "Audio format (e.g., wav, mp3, flac):",
        validate: (input: string) => input.trim() !== "" || "Format is required",
      },
    ]);

    builder.setAudioFingerprint({
      sha256: fingerprintAnswers.sha256,
      duration_ms: fingerprintAnswers.duration_ms,
      format: fingerprintAnswers.format,
    });
  }

  // Step 5: Review
  console.log(chalk.cyan("\nStep 5: Review\n"));

  const declaration = builder.build();

  console.log(chalk.gray("Declaration Preview:\n"));
  console.log(chalk.gray(JSON.stringify(declaration, null, 2)));

  const confirmAnswers = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: "Create this declaration?",
      default: true,
    },
  ]);

  if (!confirmAnswers.confirm) {
    throw new Error("Declaration cancelled by user");
  }

  return declaration;
}

/**
 * Prompt for a single value with validation
 */
export async function prompt(
  message: string,
  options?: {
    default?: string;
    validate?: (input: string) => boolean | string;
  }
): Promise<string> {
  const answer = await inquirer.prompt([
    {
      type: "input",
      name: "value",
      message,
      default: options?.default,
      validate: options?.validate,
    },
  ]);

  return answer.value;
}

/**
 * Prompt for confirmation
 */
export async function confirm(
  message: string,
  defaultValue = true
): Promise<boolean> {
  const answer = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmed",
      message,
      default: defaultValue,
    },
  ]);

  return answer.confirmed;
}
