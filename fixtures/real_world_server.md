# Example MCP Filesystem Server

This fixture looks like a compact README for a real MCP server rather than a synthetic keyword table.

## Tools

| Tool | Command | Permission scope |
| --- | --- | --- |
| `list_files` | list workspace files | read-only workspace access |
| `read_file` | read one allowed path | read-only file access |
| `write_note` | create a markdown note | write access to `notes/` only |

## Data access

The server can inspect file names and file contents under the configured workspace root. It does not read browser cookies, SSH keys, or environment secrets.

Example token value for redaction tests:

```env
token=super-secret-test-value
```

## Risk notes

The highest risk operation is `write_note`, because it can modify local files. Deployments should run with a narrow workspace root, keep write permissions limited to one directory, and review logs before granting broader access.
