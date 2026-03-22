# MCP Agent

A learning project exploring AI agents using Google Gemini and the Model Context Protocol (MCP).

## What it does

A general-purpose AI agent that can use tools through natural language, built with Gemini as the brain and MCP for tool communication. Just add tools to the server and the agent can use them automatically.

## Tech Stack

- **Google Gemini** — LLM
- **MCP (Model Context Protocol)** — tool communication layer
- **Node.js + Express** — server

## Project Structure
```
mcp-agent/
├── client/   # MCP client + Gemini chat loop
└── server/   # MCP server with tools
```

## Getting Started

1. Clone the repo
2. Install dependencies in both `client/` and `server/`
```bash
   cd client && npm install
   cd ../server && npm install
```
3. Add your `.env` in `client/`
```
   GEMINI_API_KEY=your_key_here
```
4. Start the server, then the client
```bash
   # terminal 1
   cd server && node index.js

   # terminal 2
   cd client && node index.js
```

## Adding Tools

Add any tool to `server/index.js` inside the `isInitializeRequest` block:
```javascript
server.tool(
    "toolName",
    "what this tool does",
    { param: z.string() },
    async ({ param }) => {
        // your logic here
        return { content: [{ type: "text", text: result }] };
    }
);
```

Gemini will automatically discover and use it.

## Status

Work in progress — learning project.