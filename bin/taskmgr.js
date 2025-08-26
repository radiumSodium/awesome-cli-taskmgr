#!/usr/bin/env node
import { program } from "commander";
import { addTask, listTasks, markComplete, deleteTask, searchTasks, editTask, showStats, exportTasks} from "../lib/actions.js";

program
  .name("taskmgr")
  .description("A powerful CLI Task Manager")
  .version("1.0.0");

program
  .command("add")
  .description("Add a new task")
  .argument("<description>", "Task description")
  .option("-t, --tag <tag>", "Tag the task")
  .option("-d, --due <date>", "Due date (e.g., 2025-09-01)", null)
  .option("-p, --priority <level>", "Priority: low | medium | high", "low")
  .action((desc, options) => {
    addTask(desc, options.tag, options.due, options.priority);
  });

program
  .command("list")
  .description("List all tasks")
  .option("-s, --status <status>", "Filter by status: pending/done")
  .option("-t, --tag <tag>", "Filter by tag")
  .option("-p, --priority <level>", "Filter by priority: low | medium | high")
  .option("--overdue", "Only show overdue tasks")
  .action((options) => {
    listTasks(options);
  });

program
  .command("done")
  .description("Mark a task as completed")
  .argument("<id>", "Task ID")
  .action((id) => {
    markComplete(parseInt(id));
  });

program
  .command("delete")
  .description("Delete a task")
  .argument("<id>", "Task ID")
  .action((id) => {
    deleteTask(parseInt(id));
  });

program
  .command("search")
  .description("Search tasks by keyword")
  .argument("<term>", "Search term")
  .action((term) => {
    searchTasks(term);
  });

program
  .command("edit")
  .description("Edit a task's text, tag, priority, or due date")
  .argument("<id>", "Task ID")
  .option("--text <text>", "New text")
  .option("-t, --tag <tag>", "New tag")
  .option("-p, --priority <priority>", "New priority (low, medium, high)")
  .option("-d, --due <dueDate>", "New due date (YYYY-MM-DD)")
  .action((id, options) => {
    editTask(parseInt(id), options);
  });

program
  .command("stats")
  .description("Show task statistics")
  .action(() => {
    showStats();
  });

program
  .command("export")
  .description("Export tasks to a file")
  .option("-f, --format <format>", "Format: json, md, or csv", "json")
  .option("-o, --output <filename>", "Output filename without extension", "tasks_export")
  .action((options) => {
    exportTasks(options);
  });

program.parse();
