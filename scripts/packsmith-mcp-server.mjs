import readline from "node:readline";
import { handlePacksmithMcpRequest } from "../src/mcp/packsmithMcpPrototype.js";

const input = readline.createInterface({
  input: process.stdin,
  crlfDelay: Infinity,
});

function writeResponse(response) {
  process.stdout.write(`${JSON.stringify(response)}\n`);
}

input.on("line", (line) => {
  if (!line.trim()) return;

  try {
    const request = JSON.parse(line);
    writeResponse(handlePacksmithMcpRequest(request));
  } catch (error) {
    writeResponse({
      jsonrpc: "2.0",
      id: null,
      error: {
        code: -32700,
        message: "Invalid JSON sent to Packsmith MCP prototype.",
      },
    });
  }
});
