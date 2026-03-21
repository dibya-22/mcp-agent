import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod"



// ... set up server resources, tools, and prompts ...

const app = express();
app.use(express.json())



// to support multiple simultaneous connections we have a lookup object from
// sessionId to transport
const transports = {};

app.get("/mcp", async (_, res) => {
    res.writeHead(405).end(JSON.stringify({ error: "Method not allowed"}));
});

app.post("/mcp", async (req, res) => {
    const sessionId = req.headers['mcp-session-id'];

    console.log("--- Incoming request ---");
    console.log("Session ID header:", sessionId);
    console.log("Body:", JSON.stringify(req.body));
    console.log("Stored sessions:", Object.keys(transports));

    let transport;

    if (sessionId && transports[sessionId]){
        transport = transports[sessionId]; //* reuse existing transport for this session
        await transport.handleRequest(req, res, req.body);
    }
    else if(!sessionId && isInitializeRequest(req.body)){
        const server = new McpServer({
            name: "example-server",
            version: "1.0.0"
        });
    
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
                return {
                    content: [{
                        type: "text",
                        text: `The sum of ${a} and ${b} is ${a + b}`
                    }]
                }
            }
        )


        const newSessionId = crypto.randomUUID();
        transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: () => newSessionId,
        });
        transports[newSessionId] = transport;
    
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
    }
    else {
        console.log("HIT 400 — sessionId:", sessionId, "| isInit:", isInitializeRequest(req.body));
        res.status(400).json({ error: "Bad request" });
    }

});


app.listen(3001, () => {
    console.log("Server is running on http://localhost:3001");
});