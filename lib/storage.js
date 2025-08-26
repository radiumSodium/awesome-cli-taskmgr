import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "..", "data");
const taskFile = path.join(dataDir, "tasks.json");

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(taskFile)) fs.writeFileSync(taskFile, JSON.stringify([]), "utf-8");

export function loadTasks() {
  try {
    return JSON.parse(fs.readFileSync(taskFile, "utf-8"));
  } catch {
    return [];
  }
}

export function saveTasks(tasks) {
  fs.writeFileSync(taskFile, JSON.stringify(tasks, null, 2), "utf-8");
}
