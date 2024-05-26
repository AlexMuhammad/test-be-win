import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserData, ValidationRequest } from "../types";

const accessValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validationReq = req as ValidationRequest;
  const { authorization } = validationReq.headers;
  if (!authorization) {
    res.status(401).json({
      success: false,
      message: "Token is required",
    });
  }

  const token = authorization?.split(" ")[1];
  const secret = process.env.JWT_SIGNATURE_KEY! || "cie kepo hmm";
  try {
    const jwtCode = jwt.verify(token!, secret);
    if (typeof jwtCode !== "string") {
      validationReq.userData = jwtCode as UserData;
    }
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  next();
};

module.exports = accessValidation;