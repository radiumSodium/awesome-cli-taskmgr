
// Main actions file - re-exports all functionality
export { addTask, markComplete, deleteTask, editTask } from './taskOperations.js';
export { listTasks, searchTasks, getPriorityIcon, formatTask } from './taskDisplay.js';
export { showStats } from './taskStats.js';
export { exportTasks } from './taskExport.js';
export { generateShortId } from './idGenerator.js';
export * from './displayUtils.js';





// // Main actions file - re-exports all functionality
// export { addTask, markComplete, deleteTask, editTask } from './taskOperations.js';
// export { listTasks, searchTasks, getPriorityIcon, formatTask } from './taskDisplay.js';
// export { showStats } from './taskStats.js';
// export { exportTasks } from './taskExport.js';