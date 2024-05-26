import { NextFunction, Request, Response } from "express";

const multer = require("multer");
const multerUpload = require("./multer");

const errorHandleValidations = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  multerUpload(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: "Failed to upload image",
        error: err.message,
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: "Bad Request",
        errors: err.message,
      });
    }
    next();
  });
};

module.exports =  errorHandleValidations;
