import cookie from "cookie";
import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { corsOrigins } from "./config/env";
import { prisma } from "./lib/prisma";
import { verifyToken } from "./middleware/auth";

const PAGE_SIZE = 40;

async function isUserInProject(userId: number, projectId: number): Promise<boolean> {
  const membership = await prisma.projectMembers.findFirst({ where: { userId, projectId } });
  return membership !== null;
}

/**
 * Attaches the realtime chat gateway to the HTTP server.
 *
 * Each socket is authenticated once from its JWT cookie during the handshake,
 * so the client can no longer claim to be an arbitrary userId in each event.
 */
export function attachSocketServer(server: HttpServer) {
  const io = new SocketIOServer(server, {
    cors: { origin: corsOrigins, credentials: true },
  });

  io.use((socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers.cookie ?? "");
    const userId = verifyToken(cookies.token);
    if (userId === null) {
      return next(new Error("Unauthorized"));
    }
    socket.data.userId = userId;
    next();
  });

  io.on("connection", (socket) => {
    const userId: number = socket.data.userId;

    socket.on("joinRoom", async (room: string) => {
      const projectId = Number(room);
      if (await isUserInProject(userId, projectId)) {
        socket.join(room);
        socket.emit("joinSuccess", `Joined room ${room}`);
      } else {
        socket.emit("error", { message: "Unauthorized: You are not a member of this project." });
      }
    });

    socket.on("fetchMessages", async (room: string, offset: number) => {
      const projectId = Number(room);
      if (!(await isUserInProject(userId, projectId))) {
        socket.emit("error", { message: "Unauthorized: You are not a member of this project." });
        return;
      }
      try {
        const messages = await prisma.message.findMany({
          where: { projectId },
          orderBy: { createdAt: "desc" },
          skip: offset * PAGE_SIZE,
          take: PAGE_SIZE,
        });
        socket.emit("receiveMessages", messages.reverse());
      } catch (error) {
        console.error("Error fetching messages:", error);
        socket.emit("error", { message: "Could not retrieve messages" });
      }
    });

    socket.on("message", async (data: { room: string; content: string }) => {
      const projectId = Number(data.room);
      if (!(await isUserInProject(userId, projectId))) {
        socket.emit("error", { message: "Unauthorized: You are not a member of this project." });
        return;
      }
      try {
        const message = await prisma.message.create({
          data: { content: data.content, senderId: userId, projectId },
        });
        io.to(data.room).emit("message", message);
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });
  });

  return io;
}
