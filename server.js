const WebSocket = require("ws");
const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("WebSocket Server Running");
  }
});

const wss = new WebSocket.Server({ server });
const clients = new Set();

wss.on("connection", (ws) => {
  console.log("新客户端连接");
  clients.add(ws);
  // 设置更长的超时时间
  ws.isAlive = true;
  ws.on("ping", () => {
    ws.isAlive = true;
  });
  

  ws.on("message", (message) => {
    console.log("收到消息:", message.toString());

    // 广播给所有其他客户端
    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on("close", () => {
    console.log("客户端断开连接");
    clients.delete(ws);
  });

  ws.on("error", (error) => {
    console.error("WebSocket错误:", error);
  });
});

// 启动服务器
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`WebSocket 服务器运行在 http://localhost:${PORT}`);
});
