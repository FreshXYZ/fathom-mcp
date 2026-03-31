import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_BASE = "https://api.fathom.ai/external/v1";

function getApiKey() {
  const key = process.env.FATHOM_API_KEY;
  if (!key) {
    throw new Error("FATHOM_API_KEY environment variable is required");
  }
  return key;
}

async function fathomFetch(path, params = {}) {
  const url = new URL(`${API_BASE}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        for (const v of value) {
          url.searchParams.append(`${key}[]`, v);
        }
      } else {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const response = await fetch(url.toString(), {
    headers: { "X-Api-Key": getApiKey() },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Fathom API ${response.status}: ${body}`);
  }

  return response.json();
}

const server = new McpServer({
  name: "fathom-mcp",
  version: "1.0.0",
});

// Tool: List/search meetings
server.tool(
  "list_meetings",
  "List and filter Fathom meetings. Supports filtering by date range, recorder email, team, and invitee domains. Returns meeting metadata including title, URL, participants, and timestamps.",
  {
    cursor: z
      .string()
      .optional()
      .describe("Pagination cursor from previous response"),
    created_after: z
      .string()
      .optional()
      .describe("ISO 8601 datetime - only meetings created after this time"),
    created_before: z
      .string()
      .optional()
      .describe("ISO 8601 datetime - only meetings created before this time"),
    recorded_by: z
      .array(z.string())
      .optional()
      .describe("Filter by recorder email(s)"),
    teams: z
      .array(z.string())
      .optional()
      .describe("Filter by team name(s)"),
    include_summary: z
      .boolean()
      .optional()
      .describe("Include meeting summary in response"),
    include_action_items: z
      .boolean()
      .optional()
      .describe("Include action items in response"),
  },
  async (args) => {
    const data = await fathomFetch("/meetings", {
      cursor: args.cursor,
      created_after: args.created_after,
      created_before: args.created_before,
      recorded_by: args.recorded_by,
      teams: args.teams,
      include_summary: args.include_summary,
      include_action_items: args.include_action_items,
    });

    const meetings = data.items.map((m) => ({
      recording_id: m.recording_id,
      title: m.title,
      meeting_title: m.meeting_title,
      url: m.url,
      share_url: m.share_url,
      created_at: m.created_at,
      scheduled_start_time: m.scheduled_start_time,
      scheduled_end_time: m.scheduled_end_time,
      recording_start_time: m.recording_start_time,
      recording_end_time: m.recording_end_time,
      recorded_by: m.recorded_by,
      calendar_invitees: m.calendar_invitees,
      ...(m.default_summary && { summary: m.default_summary }),
      ...(m.action_items && { action_items: m.action_items }),
    }));

    const result = {
      meetings,
      next_cursor: data.next_cursor,
      total_in_page: meetings.length,
    };

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// Tool: Get transcript for a recording
server.tool(
  "get_transcript",
  "Get the full transcript of a Fathom meeting/recording. Returns speaker-attributed text with timestamps.",
  {
    recording_id: z
      .string()
      .describe("The recording ID (from list_meetings results)"),
  },
  async (args) => {
    const data = await fathomFetch(
      `/recordings/${args.recording_id}/transcript`
    );

    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  }
);

// Tool: Get summary for a recording
server.tool(
  "get_summary",
  "Get the AI-generated summary of a Fathom meeting/recording. Returns markdown-formatted summary.",
  {
    recording_id: z
      .string()
      .describe("The recording ID (from list_meetings results)"),
  },
  async (args) => {
    const data = await fathomFetch(
      `/recordings/${args.recording_id}/summary`
    );

    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
