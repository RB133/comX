import crypto from "crypto";
import fs from "fs";
import multer from "multer";
import os from "os";
import path from "path";

// Uploads land in a temp dir, get pushed to Cloudinary, then are deleted.
const uploadDir = path.join(os.tmpdir(), "comx-uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    // A random prefix prevents two users uploading "avatar.png" from colliding.
    const suffix = crypto.randomBytes(8).toString("hex");
    cb(null, `${suffix}-${file.originalname}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});
