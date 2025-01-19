import express from "express";
import { dirname } from "path";
import handler from "serve-handler";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface ServerOptions {
  port: number;
  uiPath: string;
}

const HOST = "localhost";

export class Server {
  private app = express();
  private port: number;
  private uiPath: string;

  constructor(options: ServerOptions) {
    this.port = options.port;
    this.uiPath = options.uiPath;
    this.setupMiddleware();
  }

  private setupMiddleware(): void {
    this.app.get("/api/status", (req, res) => {
      res.json({
        status: "running",
        timestamp: new Date().toISOString(),
        port: this.port,
      });
    });

    this.app.get("*", (req, res) => {
      handler(req, res, {
        cleanUrls: true,
        public: this.uiPath,
        rewrites: [
          {
            source: "/",
            destination: "/index.html",
          },
        ],
      });
    });
  }

  public start(): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        this.app.listen(this.port, () => {
          console.log(`🔭 visor GUI running at http://${HOST}:${this.port}`);
          resolve(`http://${HOST}:${this.port}`);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  public stop(): void {
    console.log("🔭 visor GUI stopping...");
  }
}
