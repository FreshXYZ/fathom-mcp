# Fathom MCP

MCP server for [Fathom AI](https://fathom.video) — search meetings, get transcripts and summaries from Claude Code (or any MCP client).

## Setup

### 1. Get your Fathom API key

Go to [Fathom settings](https://fathom.video/settings) → API Access → generate a key.

### 2. Add to Claude Code

```bash
claude mcp add fathom -e FATHOM_API_KEY=your-key-here -- npx @c20020207/fathom-mcp
```

That's it. Restart Claude Code and the tools are available.

## Tools

| Tool | Description |
|------|-------------|
| `list_meetings` | List and filter meetings by date range, recorder, team. Optionally includes summaries and action items. |
| `get_transcript` | Get the full speaker-attributed transcript with timestamps for a recording. |
| `get_summary` | Get the AI-generated markdown summary for a recording. |

### Example usage in Claude Code

> "Show me my meetings from last week"

> "Get the transcript from my meeting with Acme Corp"

> "Summarize my last 3 meetings"

## API reference

Built on the [Fathom API](https://developers.fathom.ai/). Uses `X-Api-Key` header auth and cursor-based pagination.
