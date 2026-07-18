import http from "http";
import { app } from "./app";
import { env } from "./config/env";
import { prisma } from "./lib/prisma";
import { attachSocketServer } from "./socket";

const server = http.createServer(app);
attachSocketServer(server);

server.listen(env.PORT, () => {
  console.log(`Server + WebSocket listening on port ${env.PORT}`);
});

async function shutdown(signal: string) {
  console.log(`\n${signal} received, shutting down...`);
  server.close();
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
