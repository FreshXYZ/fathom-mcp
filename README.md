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

### 1. Clone and install

Open Terminal and run:

```bash
git clone https://github.com/FreshXYZ/fathom-mcp.git
cd fathom-mcp
npm install
```

### 2. Find your Node.js path

Run this in Terminal and copy the output:

```bash
which node
```

It will print something like `/usr/local/bin/node` or `/opt/homebrew/bin/node`.

### 3. Find your fathom-mcp path

Run this in Terminal from inside the cloned folder:

```bash
pwd
```

It will print something like `/Users/yourname/fathom-mcp`.

### 4. Add to Claude Desktop

1. Open Claude Desktop
2. Go to **Settings** → **Developer** → **Edit Config**
3. This opens `claude_desktop_config.json`. Add the `mcpServers` block:

```json
{
  "mcpServers": {
    "fathom": {
      "command": "/YOUR/NODE/PATH/node",
      "args": ["/YOUR/FATHOM-MCP/PATH/src/index.js"],
      "env": {
        "FATHOM_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

Replace:
- `/YOUR/NODE/PATH/node` with the output from step 2
- `/YOUR/FATHOM-MCP/PATH` with the output from step 3
- `your-api-key-here` with your Fathom API key from above

> **Note:** If the file already has content, merge the `mcpServers` block into the existing JSON (don't replace the whole file).

### 5. Restart Claude Desktop

Quit and reopen Claude Desktop. You should see the Fathom tools available.

---

## Setup for Claude Code (CLI)

```bash
claude mcp add fathom -e FATHOM_API_KEY=your-api-key-here -- npx @c20020207/fathom-mcp
```

No cloning needed — `npx` handles it automatically.

---

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
