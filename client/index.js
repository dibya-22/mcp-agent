import { config } from 'dotenv';
import readline from 'readline/promises';
import { GoogleGenAI } from "@google/genai";
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'


config();

const ai = new GoogleGenAI({});
const mcpClient = new Client({
    name: 'example-client',
    version: '1.0.0',
})

const chatHistory = [];
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let tools = [];

mcpClient.connect(new StreamableHTTPClientTransport( new URL('http://localhost:3001/mcp')))
    .then(async () => {
        console.log("Connected to MCP server");

        tools = (await mcpClient.listTools()).tools.map(tool => {
            return {
                name: tool.name,
                description: tool.description,
                parameters: {
                    type: tool.inputSchema.type,
                    properties: tool.inputSchema.properties,
                    required: tool.inputSchema.required
                }
            }
        })
        chatLoop();

    })

async function chatLoop(toolCall){
    if(toolCall){
        console.log("Calling Tool: ", toolCall.name);

        chatHistory.push({
            role: "model",
            parts: [{
                text: `Calling tool ${toolCall.name}`, 
                type: "text"
            }],
        });

        const toolResult = await mcpClient.callTool({
            name: toolCall.name,
            arguments: toolCall.args
        });

        chatHistory.push({
            role: "user",
            parts: [{
                text: "Tool result: " + toolResult.content[0].text, 
                type: "text"
            }],
        });

        console.log(`Tool Result: ${toolResult.content[0].text}`);
    }

    const question = await rl.question("You: ");
    chatHistory.push({
        role: "user",
        parts: [{
            text: question, 
            type: "text"
        }],
    });

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: chatHistory,
        config: {
            tools: [
                {
                    functionDeclarations: tools,
                }
            ]
        }
    });

    console.log();
    const functionCall = response.candidates[0].content.parts[0].functionCall
    const result = response.candidates[0].content.parts[0].text;

    if(functionCall){
        return chatLoop(functionCall)
    }

    if(result){
        chatHistory.push({
            role: "model",
            parts: [{
                text: result, 
                type: "text"
            }],
        })
        console.log(result, "\n");
    }

    chatLoop();
}
