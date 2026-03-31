# Fathom MCP

MCP server for [Fathom AI](https://fathom.video) — search meetings, get transcripts and summaries from Claude.

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- A Fathom API key (see below)

### Get your Fathom API key

1. Open [Fathom](https://fathom.video) and sign in
2. Go to **Settings** → **API Access**
3. Click **Generate API Key**
4. Copy the key — you'll need it below

## Setup for Claude Desktop / Cowork

1. Open Claude Desktop
2. Go to **Settings** → **Developer** → **Edit Config**
3. This opens `claude_desktop_config.json`. Add the `mcpServers` block:

```json
{
  "mcpServers": {
    "fathom": {
      "command": "npx",
      "args": ["@c20020207/fathom-mcp"],
      "env": {
        "FATHOM_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

Replace `your-api-key-here` with your Fathom API key.

> **Note:** If the file already has content, merge the `mcpServers` block into the existing JSON (don't replace the whole file).

4. Restart Claude Desktop. You should see the Fathom tools available.

## Setup for Claude Code (CLI)

```bash
claude mcp add fathom -e FATHOM_API_KEY=your-api-key-here -- npx @c20020207/fathom-mcp
```

## Tools

| Tool | Description |
|------|-------------|
| `list_meetings` | List and filter meetings by date range, recorder, team. Optionally includes summaries and action items. |
| `get_transcript` | Get the full speaker-attributed transcript with timestamps for a recording. |
| `get_summary` | Get the AI-generated markdown summary for a recording. |

### Example prompts

> "Show me my meetings from last week"

> "Get the transcript from my meeting with Acme Corp"

> "Summarize my last 3 meetings"

## API reference

Built on the [Fathom API](https://developers.fathom.ai/). Uses `X-Api-Key` header auth and cursor-based pagination.
