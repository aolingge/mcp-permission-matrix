<p align="center">
  <img src="assets/readme-banner.svg" alt="MCP Permission Matrix banner" width="100%">
</p>

<h1 align="center">MCP Permission Matrix</h1>

<p align="center">检查 MCP server 文档是否把工具、权限、数据范围和风险写成矩阵。</p>

<p align="center"><a href="README.md">English</a> · <a href="#quick-start">快速开始</a> · <a href="#checks">检查项</a> · <a href="#ci-usage">CI</a></p>

<p align="center">
  <img alt="Node.js" src="https://img.shields.io/badge/node-%3E%3D18-2563EB">
  <img alt="dependencies" src="https://img.shields.io/badge/dependencies-0-111827">
  <img alt="license" src="https://img.shields.io/badge/license-MIT-16A34A">
</p>

<p align="center">
  <img src="assets/cli-preview.svg" alt="MCP Permission Matrix CLI preview" width="88%">
</p>

## 为什么做这个

AI Agent 工具越来越多，但很多仓库缺少能在本地和 CI 里重复执行的小检查。这个工具保持零依赖、可镜像、可复制，适合学生、独立开发者和开源维护者使用。

## Quick Start

```bash
npx github:aolingge/mcp-permission-matrix --path README.md
```

```bash
npx github:aolingge/mcp-permission-matrix --path README.md --markdown > report.md
npx github:aolingge/mcp-permission-matrix --path README.md --sarif > results.sarif
npx github:aolingge/mcp-permission-matrix --path README.md --annotations
```

## Checks

| Check | What it looks for |
| --- | --- |
| tool | Lists tools or commands. |
| permission | Lists permissions. |
| data | Documents data access. |
| risk | Explains risks. |

## CI Usage

See [docs/github-actions.md](docs/github-actions.md) and [docs/quality-gates.md](docs/quality-gates.md).

## Mirrors

- GitHub: https://github.com/aolingge/mcp-permission-matrix
- Gitee: https://gitee.com/aolingge/mcp-permission-matrix

## Contributing

Good first PRs: add checks, add fixtures, improve docs, or add GitHub Actions examples.

## License

MIT
