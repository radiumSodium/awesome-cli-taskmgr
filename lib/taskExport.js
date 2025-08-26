import chalk from "chalk";
import fs from 'fs';
import { loadTasks } from "./storage.js";

export function exportTasks({ format = "json", output = "tasks_export" }) {
  const tasks = loadTasks();

  if (format === "json") {
    exportToJson(tasks, output);
  } else if (format === "md" || format === "markdown") {
    exportToMarkdown(tasks, output);
  } else if (format === "csv") {
    exportToCsv(tasks, output);
  } else {
    console.log(chalk.red("❌ Unsupported export format. Use: json, md, or csv"));
  }
}

function exportToJson(tasks, output) {
  const filename = `${output}.json`;
  fs.writeFileSync(filename, JSON.stringify(tasks, null, 2));
  console.log(chalk.green(`✅ Exported ${tasks.length} tasks to ${filename}`));
}

function exportToMarkdown(tasks, output) {
  const filename = `${output}.md`;
  
  let md = "# Task List\n\n";
  
  // Group by status
  const doneTasks = tasks.filter(t => t.done);
  const pendingTasks = tasks.filter(t => !t.done);
  
  if (pendingTasks.length > 0) {
    md += "## Pending Tasks\n\n";
    pendingTasks.forEach(task => {
      const tagText = task.tag ? ` (#${task.tag})` : "";
      const dueText = task.due ? ` - Due: ${task.due}` : "";
      const priorityText = task.priority !== "low" ? ` [${task.priority.toUpperCase()}]` : "";
      md += `- [ ] ${task.text}${tagText}${priorityText}${dueText}\n`;
    });
    md += "\n";
  }
  
  if (doneTasks.length > 0) {
    md += "## Completed Tasks\n\n";
    doneTasks.forEach(task => {
      const tagText = task.tag ? ` (#${task.tag})` : "";
      md += `- [x] ${task.text}${tagText}\n`;
    });
  }

  fs.writeFileSync(filename, md);
  console.log(chalk.green(`✅ Exported ${tasks.length} tasks to ${filename}`));
}

function exportToCsv(tasks, output) {
  const filename = `${output}.csv`;
  
  const headers = "ID,Text,Done,Tag,Priority,Due Date,Created\n";
  const rows = tasks.map(task => {
    const id = task.id;
    const text = `"${task.text.replace(/"/g, '""')}"`;  // Escape quotes
    const done = task.done ? "Yes" : "No";
    const tag = task.tag || "";
    const priority = task.priority || "low";
    const due = task.due || "";
    const created = task.timestamp ? new Date(task.timestamp).toLocaleDateString() : "";
    
    return `${id},${text},${done},${tag},${priority},${due},${created}`;
  }).join("\n");
  
  const csvContent = headers + rows;
  fs.writeFileSync(filename, csvContent);
  console.log(chalk.green(`✅ Exported ${tasks.length} tasks to ${filename}`));
}