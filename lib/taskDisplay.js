import chalk from "chalk";
import { loadTasks } from "./storage.js";
import { colors, showTableHeader, showTableRow, showInfo, showTaskSummary } from "./displayUtils.js";

export function getPriorityIcon(priority) {
  if (priority === "high") return colors.error("●");
  if (priority === "medium") return colors.warning("●");
  if (priority === "low") return colors.success("●");
  return colors.muted("●");
}

export function getStatusIcon(done) {
  return done ? colors.success("✓") : colors.muted("○");
}

export function formatTaskCompact(task) {
  const status = getStatusIcon(task.done);
  const priority = getPriorityIcon(task.priority);
  const tag = task.tag ? colors.info(`#${task.tag}`) : '';
  const due = task.due ? colors.warning(`📅 ${task.due}`) : '';
  const id = colors.primary(`[${task.id}]`);
  
  const parts = [id, status, colors.highlight(task.text), tag, due, priority].filter(Boolean);
  return parts.join(' ');
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
    showInfo("No matching tasks found", "Try adjusting your filters or add some tasks!");
    return;
  }

  // Sort by priority first, then due date
  filtered.sort((a, b) => {
    // Priority sort
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const aPriority = priorityOrder[a.priority] || 1;
    const bPriority = priorityOrder[b.priority] || 1;
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority; // Higher priority first
    }
    
    // Then by due date
    if (!a.due && !b.due) return 0;
    if (!a.due) return 1;
    if (!b.due) return -1;
    return new Date(a.due) - new Date(b.due);
  });

  // Show summary
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const pending = total - done;
  const overdueCount = tasks.filter(task => 
    task.due && !task.done && new Date(task.due) < new Date()
  ).length;

  showTaskSummary(total, done, pending, overdueCount);

  // Group tasks by status for better organization
  const pendingTasks = filtered.filter(t => !t.done);
  const doneTasks = filtered.filter(t => t.done);

  if (pendingTasks.length > 0) {
    console.log(colors.highlight('\n📋 Pending Tasks'));
    console.log(colors.muted('─'.repeat(60)));
    pendingTasks.forEach((task) => {
      console.log(`  ${formatTaskCompact(task)}`);
    });
  }

  if (doneTasks.length > 0 && !options.status) {
    console.log(colors.highlight('\n✅ Completed Tasks'));
    console.log(colors.muted('─'.repeat(60)));
    doneTasks.forEach((task) => {
      console.log(`  ${formatTaskCompact(task)}`);
    });
  }

  console.log(); // Add spacing
}

export function searchTasks(term) {
  const tasks = loadTasks();
  const results = tasks.filter((task) => 
    task.text.toLowerCase().includes(term.toLowerCase())
  );
  
  if (results.length === 0) {
    showInfo(`No tasks found for "${term}"`, "Try different keywords or check your spelling");
    return;
  }
  
  console.log(colors.highlight(`\n🔍 Search Results for "${term}" (${results.length} found)`));
  console.log(colors.muted('─'.repeat(60)));
  
  results.forEach((task) => {
    console.log(`  ${formatTaskCompact(task)}`);
  });
  
  console.log(); // Add spacing
}

// Legacy function for backward compatibility
export function formatTask(task) {
  return formatTaskCompact(task);
}

// import chalk from "chalk";
// import { loadTasks } from "./storage.js";

// export function getPriorityIcon(priority) {
//   if (priority === "high") return chalk.red("🔴");
//   if (priority === "medium") return chalk.yellow("🟡");
//   if (priority === "low") return chalk.green("🟢");
//   return "";
// }

// export function formatTask(task) {
//   const status = task.done ? chalk.green("✅") : chalk.red("⏳");
//   const tagText = task.tag ? chalk.yellow(`[${task.tag}]`) : "";
//   const dueText = task.due ? chalk.blue(`(Due: ${task.due})`) : "";
//   const priorityIcon = getPriorityIcon(task.priority);
  
//   return `${chalk.cyan(`ID: ${task.id}`)} ${status} ${chalk.white(task.text)} ${tagText} ${dueText} ${priorityIcon}`;
// }

// export function listTasks(options = {}) {
//   const { status, tag, priority, overdue } = options;
//   const tasks = loadTasks();
//   let filtered = tasks;

//   // Apply filters
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

//   // Sort by due date
//   filtered.sort((a, b) => {
//     if (!a.due) return 1;
//     if (!b.due) return -1;
//     return new Date(a.due) - new Date(b.due);
//   });

//   // Display tasks
//   filtered.forEach((task) => {
//     console.log(formatTask(task));
//   });
// }

// export function searchTasks(term) {
//   const tasks = loadTasks();
//   const results = tasks.filter((task) => 
//     task.text.toLowerCase().includes(term.toLowerCase())
//   );
  
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