import multer from "multer"
import fs from "fs";
import path from "path"

const uploadsDir = path.resolve(__dirname, "./../uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir); 
}

const storage = multer.diskStorage({
    destination: function(req, res, cb){
        cb(null, uploadsDir)
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})

export const upload = multer({ storage })