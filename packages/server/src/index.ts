import express from "express";
import { dirname } from "path";
import handler from "serve-handler";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projects = [
  {
    id: "1",
    name: "Frontend App",
    lastModified: new Date("2025-01-19T18:05:00"),
    lastDeployed: new Date("2025-01-18T14:30:00"),
    dependencies: [
      {
        name: "react",
        version: "18.2.0",
        latestVersion: "18.2.0",
        isOutdated: false,
      },
      {
        name: "tailwindcss",
        version: "4.0.0",
        latestVersion: "4.0.0",
        isOutdated: false,
      },
      {
        name: "vite",
        version: "5.0.0",
        latestVersion: "5.1.0",
        isOutdated: true,
      },
      {
        name: "@types/react",
        version: "18.2.0",
        latestVersion: "18.2.1",
        isOutdated: true,
      },
      {
        name: "typescript",
        version: "5.0.4",
        latestVersion: "5.0.4",
        isOutdated: false,
      },
    ],
    gitInfo: {
      branch: "main",
      lastCommit: "3a7b22e1",
      lastCommitDate: new Date("2025-01-19T17:55:00"),
    },
  },
  {
    id: "2",
    name: "API Service",
    lastModified: new Date("2025-01-17T10:15:00"),
    lastDeployed: new Date("2025-01-16T09:00:00"),
    dependencies: [
      {
        name: "express",
        version: "4.18.2",
        latestVersion: "4.18.2",
        isOutdated: false,
      },
      {
        name: "mongoose",
        version: "7.0.0",
        latestVersion: "7.0.1",
        isOutdated: true,
      },
      {
        name: "dotenv",
        version: "16.0.3",
        latestVersion: "16.0.3",
        isOutdated: false,
      },
      {
        name: "jsonwebtoken",
        version: "9.0.0",
        latestVersion: "9.0.0",
        isOutdated: false,
      },
      {
        name: "bcrypt",
        version: "5.1.0",
        latestVersion: "5.1.0",
        isOutdated: false,
      },
    ],
    gitInfo: {
      branch: "develop",
      lastCommit: "f8d2a4b7",
      lastCommitDate: new Date("2025-01-17T10:10:00"),
    },
  },
  {
    id: "3",
    name: "Mobile App",
    lastModified: new Date("2025-01-20T09:30:00"),
    lastDeployed: new Date("2025-01-19T16:45:00"),
    dependencies: [
      { name: "react-native", version: "0.70.0" },
      { name: "@react-navigation/native", version: "6.1.6" },
      { name: "expo", version: "48.0.0" },
      { name: "redux", version: "4.2.1" },
      { name: "axios", version: "1.3.4" },
    ],
    gitInfo: {
      branch: "feature/new-ui",
      lastCommit: "2c9e1b3d",
      lastCommitDate: new Date("2025-01-20T09:25:00"),
    },
  },
  {
    id: "4",
    name: "Data Analytics",
    lastModified: new Date("2025-01-18T14:20:00"),
    lastDeployed: new Date("2025-01-17T11:10:00"),
    dependencies: [
      { name: "python", version: "3.10.0" },
      { name: "pandas", version: "2.0.0" },
      { name: "numpy", version: "1.23.5" },
      { name: "matplotlib", version: "3.7.1" },
      { name: "scikit-learn", version: "1.2.2" },
    ],
    gitInfo: {
      branch: "main",
      lastCommit: "9b5d7e2f",
      lastCommitDate: new Date("2025-01-18T14:15:00"),
    },
  },
];

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

    this.app.get("/api/projects", (req, res) => {
      res.json(projects);
    });

    this.app.get("/api/projects/:id", (req, res) => {
      const project = projects.find((p) => p.id === req.params.id);
      res.json(project);
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
