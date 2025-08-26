import { loadTasks } from './storage.js';

/**
 * Generates a short, unique ID for tasks
 * Uses a simple incremental counter starting from 1
 */
export function generateShortId() {
  const tasks = loadTasks();
  
  if (tasks.length === 0) {
    return 1;
  }
  
  // Find the highest existing ID and increment
  const maxId = Math.max(...tasks.map(task => task.id || 0));
  return maxId + 1;
}