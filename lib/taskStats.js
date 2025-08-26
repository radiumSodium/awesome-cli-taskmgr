import { loadTasks } from "./storage.js";
import { colors, showDivider, showTaskSummary } from "./displayUtils.js";

export function showStats() {
  const tasks = loadTasks();
  
  if (tasks.length === 0) {
    console.log(colors.info('\n📋 No tasks yet!'));
    console.log(colors.muted('  Add your first task with: ') + colors.primary('taskmgr add "Your task"'));
    return;
  }

  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const pending = total - done;

  // Calculate overdue tasks
  const now = new Date();
  const overdue = tasks.filter(task => 
    task.due && !task.done && new Date(task.due) < now
  ).length;

  // Show main summary
  showTaskSummary(total, done, pending, overdue);

  // Calculate priority statistics for pending tasks
  const priorities = { low: 0, medium: 0, high: 0 };
  for (const task of tasks) {
    if (!task.done && task.priority) {
      priorities[task.priority]++;
    }
  }

  // Calculate tag statistics
  const tags = {};
  for (const task of tasks) {
    if (task.tag) tags[task.tag] = (tags[task.tag] || 0) + 1;
  }

  // Show detailed breakdown
  if (pending > 0) {
    console.log(colors.highlight('📊 Pending Tasks Breakdown:'));
    console.log(`  ${colors.error('●')} High Priority: ${colors.highlight(priorities.high)}`);
    console.log(`  ${colors.warning('●')} Medium Priority: ${colors.highlight(priorities.medium)}`);
    console.log(`  ${colors.success('●')} Low Priority: ${colors.highlight(priorities.low)}`);
  }

  // Show tag breakdown
  if (Object.keys(tags).length > 0) {
    console.log(colors.highlight('\n🏷️  Tasks by Tag:'));
    const sortedTags = Object.entries(tags).sort((a, b) => b[1] - a[1]);
    sortedTags.forEach(([tag, count]) => {
      const percentage = Math.round((count / total) * 100);
      console.log(`  ${colors.info(`#${tag}`)} ${colors.highlight(count)} tasks (${percentage}%)`);
    });
  }

  // Show productivity insights
  if (total >= 5) {
    const completionRate = Math.round((done / total) * 100);
    console.log(colors.highlight('\n💡 Productivity Insights:'));
    
    if (completionRate >= 80) {
      console.log(`  ${colors.success('🎉')} Excellent! ${completionRate}% completion rate`);
    } else if (completionRate >= 60) {
      console.log(`  ${colors.info('👍')} Good progress! ${completionRate}% completion rate`);
    } else if (completionRate >= 40) {
      console.log(`  ${colors.warning('⚡')} Keep going! ${completionRate}% completion rate`);
    } else {
      console.log(`  ${colors.error('💪')} Time to focus! ${completionRate}% completion rate`);
    }

    if (overdue > 0) {
      console.log(`  ${colors.warning('⏰')} ${overdue} task${overdue > 1 ? 's' : ''} overdue - tackle these first!`);
    }
  }

  console.log(); // Add spacing
}

// import chalk from "chalk";
// import { loadTasks } from "./storage.js";

// export function showStats() {
//   const tasks = loadTasks();
//   const total = tasks.length;
//   const done = tasks.filter(t => t.done).length;
//   const pending = total - done;

//   // Calculate tag statistics
//   const tags = {};
//   for (const task of tasks) {
//     if (task.tag) tags[task.tag] = (tags[task.tag] || 0) + 1;
//   }

//   // Calculate priority statistics
//   const priorities = { low: 0, medium: 0, high: 0 };
//   for (const task of tasks) {
//     if (!task.done && task.priority) {
//       priorities[task.priority]++;
//     }
//   }

//   // Calculate overdue tasks
//   const now = new Date();
//   const overdue = tasks.filter(task => 
//     task.due && !task.done && new Date(task.due) < now
//   ).length;

//   // Display statistics
//   console.log(chalk.blue(`📋 Total: ${total}`));
//   console.log(chalk.green(`✅ Done: ${done}`));
//   console.log(chalk.red(`⏳ Pending: ${pending}`));
  
//   if (overdue > 0) {
//     console.log(chalk.magenta(`⚠️  Overdue: ${overdue}`));
//   }

//   // Show priority breakdown for pending tasks
//   if (pending > 0) {
//     console.log(chalk.yellow("\n🔺 Pending by Priority:"));
//     console.log(`  High: ${priorities.high} 🔴`);
//     console.log(`  Medium: ${priorities.medium} 🟡`);
//     console.log(`  Low: ${priorities.low} 🟢`);
//   }

//   // Show tag breakdown
//   if (Object.keys(tags).length) {
//     console.log(chalk.yellow("\n🏷️  By Tags:"));
//     for (const [tag, count] of Object.entries(tags)) {
//       console.log(`  ${tag}: ${count}`);
//     }
//   }
// }