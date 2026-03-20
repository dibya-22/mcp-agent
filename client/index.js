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

mcpClient.connect(new StreamableHTTPClientTransport( new URL('http://localhost:3001/mcp')))
    .then(async () => {
        console.log("Connected to MCP server");

        const tools = (await mcpClient.listTools()).tools
        console.log("Available tools: ", tools);
    })

async function chatLoop(){
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
    });
    const result = response.candidates[0].content.parts[0].text;
    chatHistory.push({
        role: "model",
        parts: [{
            text: result, 
            type: "text"
        }],
    })
    console.log(result, "\n");

    chatLoop();
}

chatLoop();