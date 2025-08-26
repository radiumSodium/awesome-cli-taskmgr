import chalk from "chalk";

// Color theme
export const colors = {
  primary: chalk.cyan,
  success: chalk.green,
  warning: chalk.yellow,
  error: chalk.red,
  info: chalk.blue,
  muted: chalk.gray,
  accent: chalk.magenta,
  highlight: chalk.white.bold
};

/**
 * Shows the welcome screen with ASCII art and quick stats
 */
export function showWelcome() {
  console.clear();
  
  const banner = `
${colors.primary('╔══════════════════════════════════════════════╗')}
${colors.primary('║')}              ${colors.highlight('✨ TASK MANAGER ✨')}              ${colors.primary('║')}
${colors.primary('║')}            ${colors.muted('Organize • Focus • Achieve')}        ${colors.primary('║')}
${colors.primary('╚══════════════════════════════════════════════╝')}
  `;
  
  console.log(banner);
}

/**
 * Shows available commands in a clean format
 */
export function showHelp() {
  console.log(colors.highlight('\n📋 Available Commands:\n'));
  
  const commands = [
    { cmd: 'add "task desc"', desc: 'Add a new task', options: '-t tag -p priority -d due-date' },
    { cmd: 'list', desc: 'Show all tasks', options: '-s status -t tag -p priority --overdue' },
    { cmd: 'done <id>', desc: 'Mark task as completed', options: '' },
    { cmd: 'edit <id>', desc: 'Edit a task', options: '--text "new text" -t tag -p priority -d date' },
    { cmd: 'delete <id>', desc: 'Remove a task', options: '' },
    { cmd: 'search "keyword"', desc: 'Find tasks by keyword', options: '' },
    { cmd: 'stats', desc: 'Show task statistics', options: '' },
    { cmd: 'export', desc: 'Export tasks to file', options: '-f format -o filename' },
    { cmd: 'migrate', desc: 'Convert long IDs to short ones', options: '' }
  ];
  
  commands.forEach(({ cmd, desc, options }) => {
    console.log(`  ${colors.primary('$ taskmgr')} ${colors.highlight(cmd.padEnd(16))} ${colors.muted('│')} ${desc}`);
    if (options) {
      console.log(`  ${' '.repeat(2)} ${colors.muted(':')} ${colors.info(options)}`);
    }
  });
  
  console.log(`\n${colors.muted('💡 Tip: Use')} ${colors.primary('taskmgr <command> --help')} ${colors.muted('for detailed options')}\n`);
}

/**
 * Creates a clean section divider
 */
export function showDivider(title = '', char = '─') {
  if (title) {
    const padding = Math.max(0, (50 - title.length) / 2);
    const leftPad = char.repeat(Math.floor(padding));
    const rightPad = char.repeat(Math.ceil(padding));
    console.log(colors.muted(`${leftPad} ${title} ${rightPad}`));
  } else {
    console.log(colors.muted(char.repeat(50)));
  }
}

/**
 * Shows a clean success message
 */
export function showSuccess(message, details = '') {
  console.log(`\n${colors.success('✓')} ${colors.highlight(message)}`);
  if (details) {
    console.log(`  ${colors.muted(details)}`);
  }
}

/**
 * Shows a clean error message
 */
export function showError(message, details = '') {
  console.log(`\n${colors.error('✗')} ${colors.highlight(message)}`);
  if (details) {
    console.log(`  ${colors.muted(details)}`);
  }
}

/**
 * Shows a clean info message
 */
export function showInfo(message, details = '') {
  console.log(`\n${colors.info('ℹ')} ${colors.highlight(message)}`);
  if (details) {
    console.log(`  ${colors.muted(details)}`);
  }
}

/**
 * Creates a clean table header
 */
export function showTableHeader(columns) {
  const header = columns.map(col => colors.highlight(col.title.padEnd(col.width))).join(' │ ');
  console.log(`\n │ ${header} │`);
  
  const separator = columns.map(col => '─'.repeat(col.width)).join('─┼─');
  console.log(` ├─${separator}─┤`);
}

/**
 * Creates a clean table row
 */
export function showTableRow(columns, data) {
  const row = columns.map((col, i) => {
    const value = data[i] || '';
    return value.toString().padEnd(col.width);
  }).join(' │ ');
  console.log(` │ ${row} │`);
}

/**
 * Shows task count summary in a clean box
 */
export function showTaskSummary(total, done, pending, overdue = 0) {
  const border = colors.primary('│');
  const topBorder = colors.primary('┌─ Quick Summary ──────────────────────────┐');
  const bottomBorder = colors.primary('└──────────────────────────────────────────┘');
  
  // Build line 1: "Total: XXX     Done: XXX"
  const totalText = `${colors.info('Total:')} ${colors.highlight(total.toString().padStart(3))}`;
  const doneText = `${colors.success('Done:')} ${colors.highlight(done.toString().padStart(3))}`;
  const line1 = `${border} ${totalText}     ${doneText} ${' '.repeat(15)} ${border}`;
  
  // Build line 2: "Pending: XXX  Overdue: XX" or "Pending: XXX"
  const pendingText = `${colors.warning('Pending:')} ${colors.highlight(pending.toString().padStart(3))}`;
  let line2;
  
  if (overdue > 0) {
    const overdueText = `${colors.error('Overdue:')} ${colors.highlight(overdue.toString().padStart(2))}`;
    line2 = `${border} ${pendingText}  ${overdueText} ${' '.repeat(14)} ${border}`;
  } else {
    // Add extra spaces to align with the right border
    line2 = `${border} ${pendingText}  ${' '.repeat(26)} ${border}`;
  }
  
  console.log(`
${topBorder}
${line1}
${line2}
${bottomBorder}
  `);
}

/**
 * Shows a minimal loading animation
 */
export function showLoading(message = 'Loading') {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let i = 0;
  
  return setInterval(() => {
    process.stdout.write(`\r${colors.info(frames[i % frames.length])} ${message}...`);
    i++;
  }, 80);
}

/**
 * Clears the loading animation
 */
export function clearLoading(loader) {
  clearInterval(loader);
  process.stdout.write('\r\x1b[K'); // Clear the line
}
