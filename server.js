const express = require("express");
const WebSocket = require("ws");
const http = require("http");

const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

let clients = [];

wss.on("connection", (ws) => {
  clients.push(ws);
  console.log("A new client connected, total clients:", clients.length);

  ws.on("message", (message) => {
    console.log("Received message:", message);

    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    clients = clients.filter((client) => client !== ws);
    console.log("A client disconnected, total clients:", clients.length);
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

server.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
