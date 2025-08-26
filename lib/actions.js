
// Main actions file - re-exports all functionality
export { addTask, markComplete, deleteTask, editTask } from './taskOperations.js';
export { listTasks, searchTasks, getPriorityIcon, formatTask } from './taskDisplay.js';
export { showStats } from './taskStats.js';
export { exportTasks } from './taskExport.js';


// import chalk from "chalk";
// import { loadTasks, saveTasks } from "./storage.js";
// import fs from 'fs';

// export function addTask(description, tag = "", due=null, priority="low") {
//   const tasks = loadTasks();
//   const newTask = {
//     id: Date.now(),
//     text: description,
//     done: false,
//     tag,
//     due,
//     priority,
//     timestamp: new Date().toISOString()
//   };
//   tasks.push(newTask);
//   saveTasks(tasks);
//   console.log(chalk.green("✅ Task added!"), chalk.white(description));
//   if (due) console.log(chalk.blue("📅 Due:"), chalk.white(due));
//   console.log(chalk.magenta("🔺 Priority:"), chalk.white(priority));
// }

// export function listTasks(options = {}) {
//   const { status, tag, priority, overdue } = options;
//   const tasks = loadTasks();
//   let filtered = tasks;

//   if (status) {
//     const done = status.toLowerCase() === "done";
//     filtered = filtered.filter((task) => task.done === done);
//   }

//   if (tag) {
//     filtered = filtered.filter((task) => task.tag === tag);
//   }

//   if (priority) {
//     filtered = filtered.filter((task) => task.priority === priority);
//   }

//   if (overdue) {
//     const now = new Date();
//     filtered = filtered.filter(task => task.due && !task.done && new Date(task.due) < now);
//   }

//   if (filtered.length === 0) {
//     console.log(chalk.gray("No matching tasks found."));
//     return;
//   }

//   filtered.sort((a, b) => {
//     if (!a.due) return 1;
//     if (!b.due) return -1;
//     return new Date(a.due) - new Date(b.due);
//   });

//   // Display tasks with their actual IDs, not array indices
//   filtered.forEach((task, i) => {
//     const status = task.done ? chalk.green("✅") : chalk.red("⏳");
//     const tagText = task.tag ? chalk.yellow(`[${task.tag}]`) : "";
//     const dueText = task.due ? chalk.blue(`(Due: ${task.due})`) : "";
//     const priorityIcon = getPriorityIcon(task.priority);
//     console.log(`${chalk.cyan(`ID: ${task.id}`)} ${status} ${chalk.white(task.text)} ${tagText} ${dueText} ${priorityIcon}`);
//   });
// }

// export function getPriorityIcon(priority) {
//     if (priority === "high") return chalk.red("🔴");
//     if (priority === "medium") return chalk.yellow("🟡");
//     if (priority === "low") return chalk.green("🟢");
//     return "";
//   }

// export function markComplete(id) {
//   const tasks = loadTasks();
//   const taskIndex = tasks.findIndex(task => task.id === id);
  
//   if (taskIndex === -1) {
//     return console.log(chalk.red("❌ Task not found."));
//   }
  
//   tasks[taskIndex].done = true;
//   saveTasks(tasks);
//   console.log(chalk.green("✅ Task marked as completed."));
// }

// export function deleteTask(id) {
//   const tasks = loadTasks();
//   const taskIndex = tasks.findIndex(task => task.id === id);
  
//   if (taskIndex === -1) {
//     return console.log(chalk.red("❌ Task not found."));
//   }
  
//   const removed = tasks.splice(taskIndex, 1);
//   saveTasks(tasks);
//   console.log(chalk.red("🗑️ Task deleted:"), chalk.white(removed[0].text));
// }

// export function searchTasks(term) {
//   const tasks = loadTasks();
//   const results = tasks.filter((task) => task.text.toLowerCase().includes(term.toLowerCase()));
//   if (results.length === 0) {
//     console.log(chalk.gray("No tasks found for:"), chalk.white(term));
//     return;
//   }
//   results.forEach((task) => {
//     const status = task.done ? chalk.green("✅") : chalk.red("⏳");
//     const tagText = task.tag ? chalk.yellow(`[${task.tag}]`) : "";
//     console.log(`${chalk.cyan(`ID: ${task.id}`)} ${status} ${chalk.white(task.text)} ${tagText} - ${chalk.gray(task.timestamp)}`);
//   });
// }

// export function editTask(id, { text, tag, priority, due }) {
//   const tasks = loadTasks();
//   const taskIndex = tasks.findIndex(task => task.id === id);

//   // Check for valid task
//   if (taskIndex === -1) {
//     return console.log(chalk.red("❌ Task not found."));
//   }

//   const task = tasks[taskIndex];

//   // Apply updates
//   if (text) task.text = text;
//   if (tag) task.tag = tag;

//   if (priority) {
//     const validPriorities = ["low", "medium", "high"];
//     if (validPriorities.includes(priority.toLowerCase())) {
//       task.priority = priority.toLowerCase();
//     } else {
//       return console.log(chalk.red("❌ Invalid priority. Use: low, medium, or high."));
//     }
//   }

//   if (due) {
//     const dueDate = new Date(due);
//     if (isNaN(dueDate.getTime())) {
//       return console.log(chalk.red("❌ Invalid due date format. Use YYYY-MM-DD."));
//     }
//     task.due = dueDate.toISOString().split("T")[0];
//   }

//   saveTasks(tasks);
//   console.log(chalk.green(`✏️  Task ID ${id} updated successfully.`));
// }

// export function showStats() {
//   const tasks = loadTasks();
//   const total = tasks.length;
//   const done = tasks.filter(t => t.done).length;
//   const pending = total - done;

//   const tags = {};
//   for (const task of tasks) {
//     if (task.tag) tags[task.tag] = (tags[task.tag] || 0) + 1;
//   }

//   console.log(chalk.blue(`📋 Total: ${total}`));
//   console.log(chalk.green(`✅ Done: ${done}`));
//   console.log(chalk.red(`⏳ Pending: ${pending}`));
//   if (Object.keys(tags).length) {
//     console.log(chalk.yellow("\n🏷️ By Tags:"));
//     for (const [tag, count] of Object.entries(tags)) {
//       console.log(`  ${tag}: ${count}`);
//     }
//   }
// }

// export function exportTasks({ format = "json", output = "tasks_export" }) {
//   const tasks = loadTasks();

//   if (format === "json") {
//     fs.writeFileSync(`${output}.json`, JSON.stringify(tasks, null, 2));
//     console.log(chalk.green(`✅ Exported to ${output}.json`));
//   } else if (format === "md") {
//     const md = tasks.map((t, i) =>
//       `- [${t.done ? "x" : " "}] ${t.text} ${t.tag ? `(#${t.tag})` : ""}`
//     ).join("\n");

//     fs.writeFileSync(`${output}.md`, md);
//     console.log(chalk.green(`✅ Exported to ${output}.md`));
//   } else {
//     console.log(chalk.red("❌ Unsupported export format."));
//   }
// }

