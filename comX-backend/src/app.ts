import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { corsOrigins } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/error";
import authRoutes from "./routes/auth.routes";
import calendarRoutes from "./routes/calendar.routes";
import communityRoutes from "./routes/community.routes";
import memberRoutes from "./routes/member.routes";
import projectRoutes from "./routes/project.routes";
import taskRoutes from "./routes/task.routes";
import userRoutes from "./routes/user.routes";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: corsOrigins,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
  })
);

// Health check used by hosting providers.
app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "server is running" });
});

app.use("/auth", authRoutes);
app.use("/community", communityRoutes);
app.use("/member", memberRoutes);
app.use("/calendar", calendarRoutes);
app.use("/project", projectRoutes);
app.use("/task", taskRoutes);
app.use("/user", userRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
