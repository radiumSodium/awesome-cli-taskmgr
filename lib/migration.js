import { loadTasks, saveTasks } from './storage.js';
import chalk from 'chalk';

/**
 * Migrates existing long timestamp IDs to short sequential IDs
 * This is a one-time operation to make existing tasks easier to work with
 */
export function migrateLongIds() {
  const tasks = loadTasks();
  
  if (tasks.length === 0) {
    console.log(chalk.yellow("No tasks to migrate."));
    return;
  }
  
  // Check if migration is needed (if any task has a long ID)
  const hasLongIds = tasks.some(task => task.id.toString().length > 6);
  
  if (!hasLongIds) {
    console.log(chalk.green("All tasks already have short IDs."));
    return;
  }
  
  console.log(chalk.blue("Migrating long IDs to short IDs..."));
  
  // Sort tasks by creation time to maintain order
  tasks.sort((a, b) => new Date(a.timestamp || 0) - new Date(b.timestamp || 0));
  
  // Assign new sequential IDs
  tasks.forEach((task, index) => {
    const oldId = task.id;
    const newId = index + 1;
    task.id = newId;
    console.log(chalk.gray(`  ${oldId} → ${newId}`));
  });
  
  saveTasks(tasks);
  console.log(chalk.green(`✅ Successfully migrated ${tasks.length} tasks to short IDs.`));
  console.log(chalk.yellow("You can now use short IDs like 1, 2, 3 instead of long numbers."));
}