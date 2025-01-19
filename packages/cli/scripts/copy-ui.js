import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function copyUiFiles() {
  const uiSourceDir = path.join(__dirname, "../../ui/dist");
  const uiDestDir = path.join(__dirname, "../dist/ui");

  try {
    await fs.ensureDir(uiDestDir);
    await fs.copy(uiSourceDir, uiDestDir);
    console.log("UI files copied successfully");
  } catch (error) {
    console.error("Error copying UI files:", error);
    process.exit(1);
  }
}

copyUiFiles();
