import { NextFunction, Request, Response } from "express";
import { AuthorizationRequest } from "../types";

require("dotenv").config();
const { users } = require("../models/index");

module.exports = {
  async getProfile(req: AuthorizationRequest, res: Response, next: NextFunction) {
    try {
      const user = await users.findUnique({
        where: {
          id: req.userData!.id,
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          gender: user.gender,
        },
        message: 'Success to get profile data'
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
};
