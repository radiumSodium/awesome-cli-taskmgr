import chalk from "chalk";

/**
 * Validates if a priority level is valid
 */
export function isValidPriority(priority) {
  const validPriorities = ["low", "medium", "high"];
  return validPriorities.includes(priority.toLowerCase());
}

/**
 * Validates if a date string is in the correct format (YYYY-MM-DD)
 */
export function isValidDateString(dateString) {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && dateString.match(/^\d{4}-\d{2}-\d{2}$/);
}

/**
 * Formats a date to YYYY-MM-DD format
 */
export function formatDate(date) {
  return date.toISOString().split("T")[0];
}

/**
 * Checks if a task is overdue
 */
export function isOverdue(task) {
  if (!task.due || task.done) return false;
  return new Date(task.due) < new Date();
}

/**
 * Gets the number of days until/since due date
 */
export function getDaysUntilDue(task) {
  if (!task.due) return null;
  const now = new Date();
  const dueDate = new Date(task.due);
  const diffTime = dueDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Colors text based on urgency
 */
export function colorByUrgency(text, daysUntilDue) {
  if (daysUntilDue === null) return text;
  if (daysUntilDue < 0) return chalk.red(text);  // Overdue
  if (daysUntilDue <= 1) return chalk.yellow(text);  // Due soon
  if (daysUntilDue <= 7) return chalk.blue(text);  // Due this week
  return text;
}

/**
 * Filters tasks based on various criteria
 */
export function filterTasks(tasks, filters = {}) {
  return tasks.filter(task => {
    // Status filter
    if (filters.status) {
      const isDone = filters.status.toLowerCase() === "done";
      if (task.done !== isDone) return false;
    }

    // Tag filter
    if (filters.tag && task.tag !== filters.tag) return false;

    // Priority filter
    if (filters.priority && task.priority !== filters.priority) return false;

    // Overdue filter
    if (filters.overdue && !isOverdue(task)) return false;

    // Text search
    if (filters.search && !task.text.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    return true;
  });
}

/**
 * Sorts tasks by various criteria
 */
export function sortTasks(tasks, sortBy = "due") {
  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case "due":
        if (!a.due) return 1;
        if (!b.due) return -1;
        return new Date(a.due) - new Date(b.due);
      
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return (priorityOrder[b.priority] || 1) - (priorityOrder[a.priority] || 1);
      
      case "created":
        return new Date(b.timestamp || 0) - new Date(a.timestamp || 0);
      
      case "alphabetical":
        return a.text.localeCompare(b.text);
      
      default:
        return 0;
    }
  });
}