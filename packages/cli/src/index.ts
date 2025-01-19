#!/usr/bin/env node
import { Server } from "@visor/server";
import { program } from "commander";
import fs from "fs-extra";
import opener from "opener";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface CliOptions {
  port: string;
  uiDir?: string;
}

const DEFAULT_PORT = 3000;

class CLI {
  private server: Server | null = null;

  constructor() {
    this.setupCommandLine();
  }

  private setupCommandLine(): void {
    program
      .option(
        "-p, --port <number>",
        "port to run the server on",
        DEFAULT_PORT.toString()
      )
      .option("-d, --ui-dir <path>", "custom UI directory path")
      .action(async (options: CliOptions) => {
        await this.start(options);
      });

    program.parse();
  }

  private async getUiPath(customPath?: string): Promise<string> {
    // Use custom path if provided, otherwise use default location
    const defaultPath = path.join(
      process.env.HOME || process.env.USERPROFILE || "",
      ".visor",
      "ui"
    );

    const uiPath = customPath || defaultPath;

    // Ensure UI directory exists
    await fs.ensureDir(uiPath);

    // Copy UI files if they don't exist
    const sourceUiPath = path.join(__dirname, "ui");
    // const hasUiFiles = await fs.pathExists(path.join(uiPath, "index.html"));
    const hasUiFiles = false;

    if (!hasUiFiles) {
      // console.log("Setting up UI files...");
      await fs.copy(sourceUiPath, uiPath, { overwrite: true });
    }

    return uiPath;
  }

  private async start(options: CliOptions): Promise<void> {
    try {
      const port = parseInt(options.port, 10);
      const uiPath = await this.getUiPath(options.uiDir);

      this.server = new Server({
        port,
        uiPath,
      });

      const url = await this.server.start();
      opener(url);

      // Handle shutdown gracefully
      process.on("SIGINT", () => this.shutdown());
      process.on("SIGTERM", () => this.shutdown());
    } catch (error) {
      console.error("Error starting CLI:", error);
      process.exit(1);
    }
  }

  private shutdown(): void {
    console.log("\nShutting down...");
    if (this.server) {
      this.server.stop();
    }
    process.exit(0);
  }
}

// Start the CLI
new CLI();
