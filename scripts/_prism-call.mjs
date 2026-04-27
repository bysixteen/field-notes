#!/usr/bin/env node
// _prism-call.mjs — internal helper for figma-push.sh / figma-pull.sh.
//
// Connects to Prism's WebSocket bridge on ws://localhost:7890 (override with
// PRISM_WS_URL), sends one MCP tools/call JSON-RPC frame, prints the tool's
// result JSON to stdout, and exits non-zero on transport or tool errors.
//
// Input  (stdin, JSON): { "tool": "<name>", "arguments": { ... } }
// Output (stdout, JSON): the MCP tool result payload
//
// Requires Node ≥ 22 (for the global WebSocket).

const WS_URL = process.env.PRISM_WS_URL || "ws://localhost:7890";
const TIMEOUT_MS = Number(process.env.PRISM_WS_TIMEOUT_MS || 30_000);

function die(message, detail) {
  process.stderr.write(`[prism-call] ${message}\n`);
  if (detail !== undefined) {
    process.stderr.write(
      typeof detail === "string" ? `${detail}\n` : `${JSON.stringify(detail, null, 2)}\n`,
    );
  }
  process.exit(1);
}

if (typeof WebSocket !== "function") {
  die("global WebSocket missing — Node ≥ 22 is required");
}

const stdin = await new Promise((resolve, reject) => {
  let buf = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => {
    buf += chunk;
  });
  process.stdin.on("end", () => resolve(buf));
  process.stdin.on("error", reject);
});

let request;
try {
  request = JSON.parse(stdin);
} catch (err) {
  die("stdin is not valid JSON", err.message);
}

const { tool, arguments: args } = request;
if (typeof tool !== "string" || tool.length === 0) {
  die('input must include a non-empty "tool" string');
}

const id =
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `req-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const frame = {
  jsonrpc: "2.0",
  id,
  method: "tools/call",
  params: { name: tool, arguments: args ?? {} },
};

const ws = new WebSocket(WS_URL);

const timer = setTimeout(() => {
  try {
    ws.close();
  } catch {}
  die(`timed out after ${TIMEOUT_MS}ms waiting for Prism on ${WS_URL}`);
}, TIMEOUT_MS);

ws.addEventListener("open", () => {
  ws.send(JSON.stringify(frame));
});

ws.addEventListener("message", (event) => {
  const raw = typeof event.data === "string" ? event.data : event.data.toString("utf8");
  let msg;
  try {
    msg = JSON.parse(raw);
  } catch {
    return;
  }
  if (msg.id !== id) return;
  clearTimeout(timer);
  ws.close();
  if (msg.error) {
    die(`Prism returned an error for ${tool}`, msg.error);
  }
  process.stdout.write(`${JSON.stringify(msg.result ?? null)}\n`);
  process.exit(0);
});

ws.addEventListener("error", (event) => {
  clearTimeout(timer);
  die(`WebSocket error connecting to ${WS_URL}`, event?.message || String(event));
});

ws.addEventListener("close", (event) => {
  if (event.code !== 1000) {
    clearTimeout(timer);
    die(`WebSocket closed before reply (code ${event.code}, reason: ${event.reason || "<none>"})`);
  }
});
