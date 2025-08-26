import chalk from "chalk";
import { loadTasks, saveTasks } from "./storage.js";
import { generateShortId } from "./idGenerator.js";

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
  console.log(chalk.green("✅ Task added!"), chalk.white(description));
  if (due) console.log(chalk.blue("📅 Due:"), chalk.white(due));
  console.log(chalk.magenta("🔺 Priority:"), chalk.white(priority));
}

export function markComplete(id) {
  const tasks = loadTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return console.log(chalk.red("❌ Task not found."));
  }
  
  tasks[taskIndex].done = true;
  saveTasks(tasks);
  console.log(chalk.green("✅ Task marked as completed."));
}

export function deleteTask(id) {
  const tasks = loadTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return console.log(chalk.red("❌ Task not found."));
  }
  
  const removed = tasks.splice(taskIndex, 1);
  saveTasks(tasks);
  console.log(chalk.red("🗑️ Task deleted:"), chalk.white(removed[0].text));
}

export function editTask(id, { text, tag, priority, due }) {
  const tasks = loadTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);

  if (taskIndex === -1) {
    return console.log(chalk.red("❌ Task not found."));
  }

  const task = tasks[taskIndex];

  // Apply updates
  if (text) task.text = text;
  if (tag) task.tag = tag;

  if (priority) {
    const validPriorities = ["low", "medium", "high"];
    if (validPriorities.includes(priority.toLowerCase())) {
      task.priority = priority.toLowerCase();
    } else {
      return console.log(chalk.red("❌ Invalid priority. Use: low, medium, or high."));
    }
  }

  if (due) {
    const dueDate = new Date(due);
    if (isNaN(dueDate.getTime())) {
      return console.log(chalk.red("❌ Invalid due date format. Use YYYY-MM-DD."));
    }
    task.due = dueDate.toISOString().split("T")[0];
  }

  saveTasks(tasks);
  console.log(chalk.green(`✏️  Task ID ${id} updated successfully.`));
}

// import chalk from "chalk";
// import { loadTasks, saveTasks } from "./storage.js";

// export function addTask(description, tag = "", due = null, priority = "low") {
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