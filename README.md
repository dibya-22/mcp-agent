# X Agent

A learning project exploring AI agents using Google Gemini and the Model Context Protocol (MCP).

## What it does

An AI-powered agent that can interact with X (Twitter) through natural language, built with Gemini as the brain and MCP for tool communication.

## Tech Stack

- **Google Gemini** — LLM
- **MCP (Model Context Protocol)** — tool communication layer
- **Node.js + Express** — server

## Project Structure
```
x-agent/
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

## Status

Work in progress — learning project.