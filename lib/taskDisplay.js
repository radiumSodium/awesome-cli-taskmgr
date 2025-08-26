import chalk from "chalk";
import { loadTasks } from "./storage.js";

export function getPriorityIcon(priority) {
  if (priority === "high") return chalk.red("🔴");
  if (priority === "medium") return chalk.yellow("🟡");
  if (priority === "low") return chalk.green("🟢");
  return "";
}

export function formatTask(task) {
  const status = task.done ? chalk.green("✅") : chalk.red("⏳");
  const tagText = task.tag ? chalk.yellow(`[${task.tag}]`) : "";
  const dueText = task.due ? chalk.blue(`(Due: ${task.due})`) : "";
  const priorityIcon = getPriorityIcon(task.priority);
  
  return `${chalk.cyan(`ID: ${task.id}`)} ${status} ${chalk.white(task.text)} ${tagText} ${dueText} ${priorityIcon}`;
}

export function listTasks(options = {}) {
  const { status, tag, priority, overdue } = options;
  const tasks = loadTasks();
  let filtered = tasks;

  // Apply filters
  if (status) {
    const done = status.toLowerCase() === "done";
    filtered = filtered.filter((task) => task.done === done);
  }

  if (tag) {
    filtered = filtered.filter((task) => task.tag === tag);
  }

  if (priority) {
    filtered = filtered.filter((task) => task.priority === priority);
  }

  if (overdue) {
    const now = new Date();
    filtered = filtered.filter(task => task.due && !task.done && new Date(task.due) < now);
  }

  if (filtered.length === 0) {
    console.log(chalk.gray("No matching tasks found."));
    return;
  }

  // Sort by due date
  filtered.sort((a, b) => {
    if (!a.due) return 1;
    if (!b.due) return -1;
    return new Date(a.due) - new Date(b.due);
  });

  // Display tasks
  filtered.forEach((task) => {
    console.log(formatTask(task));
  });
}

export function searchTasks(term) {
  const tasks = loadTasks();
  const results = tasks.filter((task) => 
    task.text.toLowerCase().includes(term.toLowerCase())
  );
  
  if (results.length === 0) {
    console.log(chalk.gray("No tasks found for:"), chalk.white(term));
    return;
  }
  
  results.forEach((task) => {
    const status = task.done ? chalk.green("✅") : chalk.red("⏳");
    const tagText = task.tag ? chalk.yellow(`[${task.tag}]`) : "";
    console.log(`${chalk.cyan(`ID: ${task.id}`)} ${status} ${chalk.white(task.text)} ${tagText} - ${chalk.gray(task.timestamp)}`);
  });
}