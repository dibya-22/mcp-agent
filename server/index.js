import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod"

const server = new McpServer({
    name: "example-server",
    version: "1.0.0"
});

// ... set up server resources, tools, and prompts ...

const app = express();
app.use(express.json())

server.tool(
    "addTwoNumbers", //* tool name
    "add two numbers", //* decription
    {
        //? schema
        a: z.number(),
        b: z.number()
    },
    async (arg) => {
        const { a, b } = arg;
        return[{
            type: "text",
            text: `The sum of ${a} and ${b} is ${a + b}`,
        }]
    }

)

// to support multiple simultaneous connections we have a lookup object from
// sessionId to transport
const transports = {};

app.all("/mcp", async (req, res) => {
    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => crypto.randomUUID(),
    });

    transports[transport.sessionId] = transport;

    res.on("close", () => {
        delete transports[transport.sessionId];
    });

    await server.connect(transport);
    await transport.handleRequest(req, res);
});


app.listen(3001, () => {
    console.log("Server is running on http://localhost:3001");
});