import fs from 'node:fs';
import path from 'node:path';

export const CHECKS = [
  [
    "tool",
    "tool|command|function|工具|命令",
    "Lists tools or commands."
  ],
  [
    "permission",
    "permission|scope|read|write|权限|范围",
    "Lists permissions."
  ],
  [
    "data",
    "data|file|network|secret|数据|文件|网络|密钥",
    "Documents data access."
  ],
  [
    "risk",
    "risk|safe|danger|风险|安全",
    "Explains risks."
  ]
];

export function readTarget(target) {
  const stat = fs.statSync(target);
  if (stat.isDirectory()) {
    return fs.readdirSync(target, { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => path.join(entry.path, entry.name))
      .filter((file) => /\.(md|txt|json|ya?ml|log|env|js|ts)$/i.test(file))
      .slice(0, 120)
      .map((file) => `\n--- ${path.relative(target, file)} ---\n${fs.readFileSync(file, 'utf8')}`)
      .join('\n');
  }
  return fs.readFileSync(target, 'utf8');
}

export function redact(text) {
  return text
    .replace(/(ghp_|github_pat_|gitee_[A-Za-z0-9_]*|sk-[A-Za-z0-9_-]{16,})[A-Za-z0-9_\-]*/g, '[REDACTED_TOKEN]')
    .replace(/(token|password|secret|cookie)\s*[:=]\s*[^\s]+/gi, '$1=[REDACTED]');
}

export function checkText(text, target = 'input') {
  const source = redact(text);
  const results = CHECKS.map(([id, pattern, message]) => {
    const passed = new RegExp(pattern, 'i').test(source);
    return { id, passed, message };
  });
  const passed = results.filter((item) => item.passed).length;
  const score = Math.round((passed / results.length) * 100);
  return { tool: 'mcp-permission-matrix', target, score, passed, total: results.length, results, redacted: source };
}

export function checkFile(target) {
  return checkText(readTarget(target), target);
}

export function formatText(report) {
  const lines = [`MCP Permission Matrix score: ${report.score}/100`];
  for (const item of report.results) lines.push(`${item.passed ? 'PASS' : 'WARN'}  ${item.id} - ${item.message}`);
  return lines.join('\n');
}

export function formatMarkdown(report) {
  const rows = report.results.map((item) => `| ${item.id} | ${item.passed ? 'PASS' : 'WARN'} | ${item.message} |`).join('\n');
  return `# MCP Permission Matrix Report\n\nScore: **${report.score}/100**\n\n| Check | Status | Message |\n| --- | --- | --- |\n${rows}\n`;
}

export function formatAnnotations(report) {
  return report.results.filter((item) => !item.passed).map((item) => `::warning title=MCP Permission Matrix ${item.id}::${item.message}`).join('\n');
}

export function formatSarif(report) {
  return {
    version: '2.1.0',
    runs: [{
      tool: { driver: { name: 'mcp-permission-matrix', informationUri: 'https://github.com/aolingge/mcp-permission-matrix', rules: report.results.map((item) => ({ id: item.id, shortDescription: { text: item.message } })) } },
      results: report.results.filter((item) => !item.passed).map((item) => ({ ruleId: item.id, level: 'warning', message: { text: item.message }, locations: [{ physicalLocation: { artifactLocation: { uri: report.target } } }] }))
    }]
  };
}
