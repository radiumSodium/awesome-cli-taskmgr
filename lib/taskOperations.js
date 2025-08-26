import chalk from "chalk";
import { loadTasks, saveTasks } from "./storage.js";
import { generateShortId } from "./idGenerator.js";
import { colors, showSuccess, showError, showInfo } from "./displayUtils.js";

export function addTask(description, tag = "", due = null, priority = "low") {
  const tasks = loadTasks();
  const newTask = {
    id: generateShortId(),
    text: description,
    done: false,
    tag,
    due,
    priority,
    timestamp: new Date().toISOString()
  };
  tasks.push(newTask);
  saveTasks(tasks);
  
  const details = [
    tag && `Tag: ${tag}`,
    due && `Due: ${due}`,
    `Priority: ${priority}`
  ].filter(Boolean).join(' • ');
  
  showSuccess(`Task added successfully!`, details);
}

export function markComplete(id) {
  const tasks = loadTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    showError("Task not found", `No task with ID ${id} exists`);
    return;
  }
  
  const task = tasks[taskIndex];
  if (task.done) {
    showInfo("Task already completed", `"${task.text}" is already marked as done`);
    return;
  }
  
  tasks[taskIndex].done = true;
  saveTasks(tasks);
  showSuccess("Task completed!", `"${task.text}" has been marked as done`);
}

export function deleteTask(id) {
  const tasks = loadTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    showError("Task not found", `No task with ID ${id} exists`);
    return;
  }
  
  const removed = tasks.splice(taskIndex, 1);
  saveTasks(tasks);
  showSuccess("Task deleted", `"${removed[0].text}" has been removed`);
}

export function editTask(id, { text, tag, priority, due }) {
  const tasks = loadTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);

  if (taskIndex === -1) {
    showError("Task not found", `No task with ID ${id} exists`);
    return;
  }

  const task = tasks[taskIndex];
  const changes = [];

  // Apply updates
  if (text && text !== task.text) {
    task.text = text;
    changes.push(`text updated`);
  }
  
  if (tag !== undefined && tag !== task.tag) {
    task.tag = tag;
    changes.push(tag ? `tag set to "${tag}"` : 'tag removed');
  }

  if (priority) {
    const validPriorities = ["low", "medium", "high"];
    if (validPriorities.includes(priority.toLowerCase())) {
      if (priority.toLowerCase() !== task.priority) {
        task.priority = priority.toLowerCase();
        changes.push(`priority changed to ${priority}`);
      }
    } else {
      showError("Invalid priority", "Use: low, medium, or high");
      return;
    }
  }

  if (due !== undefined) {
    if (due === '') {
      // Remove due date
      task.due = null;
      changes.push('due date removed');
    } else {
      const dueDate = new Date(due);
      if (isNaN(dueDate.getTime())) {
        showError("Invalid date format", "Use YYYY-MM-DD format (e.g., 2025-12-31)");
        return;
      }
      const formattedDate = dueDate.toISOString().split("T")[0];
      if (formattedDate !== task.due) {
        task.due = formattedDate;
        changes.push(`due date set to ${formattedDate}`);
      }
    }
  }

  if (changes.length === 0) {
    showInfo("No changes made", "Task remains unchanged");
    return;
  }

  saveTasks(tasks);
  showSuccess("Task updated successfully", changes.join(', '));
}

// import chalk from "chalk";
// import { loadTasks, saveTasks } from "./storage.js";
// import { generateShortId } from "./idGenerator.js";

// export function addTask(description, tag = "", due = null, priority = "low") {
//   const tasks = loadTasks();
//   const newTask = {
//     id: generateShortId(),
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

// export function editTask(id, { text, tag, priority, due }) {
//   const tasks = loadTasks();
//   const taskIndex = tasks.findIndex(task => task.id === id);

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
