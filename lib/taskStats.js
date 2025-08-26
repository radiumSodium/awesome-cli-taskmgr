import chalk from "chalk";
import { loadTasks } from "./storage.js";

export function showStats() {
  const tasks = loadTasks();
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const pending = total - done;

  // Calculate tag statistics
  const tags = {};
  for (const task of tasks) {
    if (task.tag) tags[task.tag] = (tags[task.tag] || 0) + 1;
  }

  // Calculate priority statistics
  const priorities = { low: 0, medium: 0, high: 0 };
  for (const task of tasks) {
    if (!task.done && task.priority) {
      priorities[task.priority]++;
    }
  }

  // Calculate overdue tasks
  const now = new Date();
  const overdue = tasks.filter(task => 
    task.due && !task.done && new Date(task.due) < now
  ).length;

  // Display statistics
  console.log(chalk.blue(`📋 Total: ${total}`));
  console.log(chalk.green(`✅ Done: ${done}`));
  console.log(chalk.red(`⏳ Pending: ${pending}`));
  
  if (overdue > 0) {
    console.log(chalk.magenta(`⚠️  Overdue: ${overdue}`));
  }

  // Show priority breakdown for pending tasks
  if (pending > 0) {
    console.log(chalk.yellow("\n🔺 Pending by Priority:"));
    console.log(`  High: ${priorities.high} 🔴`);
    console.log(`  Medium: ${priorities.medium} 🟡`);
    console.log(`  Low: ${priorities.low} 🟢`);
  }

  // Show tag breakdown
  if (Object.keys(tags).length) {
    console.log(chalk.yellow("\n🏷️  By Tags:"));
    for (const [tag, count] of Object.entries(tags)) {
      console.log(`  ${tag}: ${count}`);
    }
  }
}