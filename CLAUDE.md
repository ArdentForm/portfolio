# Portfolio Project

## Adding a new skill from .agents/skills/

Skills in `.agents/skills/` must be registered as plugins to appear in Claude Code. When a new skill directory is added, run:

```bash
.agents/add-skill.sh <skill-name>
```

Then restart Claude Code. The script creates the `.claude-plugin/plugin.json`, updates `.agents/.claude-plugin/marketplace.json`, and runs `claude plugins install`.

**Never** manually edit `marketplace.json` or `installed_plugins.json` to add skills — use the script.

## Working style

Always work directly on the `main` branch. Never use `isolation: "worktree"` in Agent tool calls — this project does not use worktrees.
