import { Request, Response } from "express";
const {
  encryptedPassword,
  checkPassword,
  createToken,
} = require("../utils/index");
require("dotenv").config();
const { users } = require("../models/index");

module.exports = {
  async register(req: Request, res: Response) {
    try {
      const { name, email, gender, password } = req.body;
      //Encrypt Password
      const hashedPassword = await encryptedPassword(password);
      //Validation Email Regex
      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      //Check email already exist
      const isEmailExist = await users.findFirst({
        where: {
          email,
        },
      });

      if (!email && !password && !gender && !name) {
        return res.status(400).json({
          success: false,
          message: "everything is required",
        });
      }
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "email is not valid",
        });
      }
      if (isEmailExist) {
        return res.status(400).json({
          success: false,
          message: "email already exist",
        });
      }

      const responseData = {
        name,
        email,
        password: hashedPassword,
        gender,
      };
      const createUser = await users.create({
        data: responseData,
      });

      res.status(201).json({
        success: true,
        message: "Successfully created account",
        data: {
          id: createUser.id,
          name: createUser.name,
          email: createUser.email,
          gender: createUser.gender,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      //check email
      const findUser = await users.findUnique({
        where: {
          email,
        },
      });

      if (!findUser) {
        return res.status(404).json({
          success: false,
          message: "Email not found",
        });
      }

      const isPasswordCorrect = await checkPassword(
        findUser.password,
        password
      );

      if (!isPasswordCorrect) {
        return res.status(400).json({
          success: false,
          message: "Password wrong",
        });
      }

      const token = createToken({
        id: findUser.id,
        email: findUser.email,
      });

      res.status(201).json({
        success: true,
        message: "Successfully login",
        data: {
          name: findUser.name,
        },
        token,
      });
    } catch (error: any) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },
};
