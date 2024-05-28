import { Request } from "express";
import { FileFilterCallback } from "multer";

const multer = require("multer");
const storage = multer.memoryStorage();
const maxSize = 1024 * 1024 * 20;

module.exports = multer({
  storage: storage,
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  limits: { fileSize: maxSize },
}).single("image");
