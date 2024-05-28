import { NextFunction, Request, Response } from "express";
import { AuthorizationRequest } from "../types";
import { Prisma } from "@prisma/client";
const { products } = require("../models/index");
const cloudinary = require("../middlewares/cloudinary");
const fs = require("fs");

module.exports = {
  async getListProduct(
    req: AuthorizationRequest,
    res: Response,
    next: NextFunction
  ) {
    const { name } = req.query;
    try {
      const conditions: any = {};
      if (name) {
        conditions.name = {
          contains: name,
          mode: "insensitive",
        };
      }

      const product = await products.findMany({
        where: {
          userId: req.userData!.id,
          ...conditions,
        },
      });
      res.status(200).json({
        success: true,
        message: "Successfully to get list products",
        data: product,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async getProductDetail(req: Request, res: Response, next: NextFunction) {
    const productId = Number(req.params.id);
    try {
      const product = await products.findUnique({
        where: {
          id: productId,
        },
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Successfully to get detail product",
        data: product,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async createProduct(
    req: AuthorizationRequest,
    res: Response,
    next: NextFunction
  ) {
    const { name, price, description } = req.body;
    if (!name && !price && !description) {
      return res.status(400).json({
        success: false,
        message: "everything is required",
      });
    }
    // if (!req.file) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Image is required",
    //   });
    // }
    try {
      if (req.file) {
        const fileBase64 = req.file.buffer.toString("base64");
        const file = `data:${req.file.mimetype};base64,${fileBase64}`;

        const result = await cloudinary.uploader.upload(file, {
          folder: "products-test",
        });

        const product = await products.create({
          data: {
            name,
            price,
            description,
            image: result.url,
            userId: req.userData!.id,
          },
        });
        res.status(201).json({
          success: true,
          message: "Successfully to create product",
          data: product,
        });
      }
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    const { name, description, price, image } = req.body;
    const productId = Number(req.params.id);
    try {
      //check product exist or not
      const isProductExist = await products.findUnique({
        where: {
          id: productId,
        },
      });

      let newImageUrl = isProductExist.image;
      if (req.file) {
        const fileBase64 = req.file.buffer.toString("base64");
        const file = `data:${req.file.mimetype};base64,${fileBase64}`;
        // Upload new image to Cloudinary
        if (file) {
          const result = await cloudinary.uploader.upload(file, {
            folder: "products-test",
            overwrite: true,
          });
          newImageUrl = result.secure_url;
        } else {
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "products-test",
            overwrite: true,
          });
          newImageUrl = result.secure_url;
          fs.unlinkSync(req.file.path);
        }

        // Delete the old image from Cloudinary
        const oldImagePublicId = isProductExist.image
          .split("/")
          .pop()
          .split(".")[0];
        await cloudinary.uploader.destroy(`products-test/${oldImagePublicId}`);
      }

      const updatedProduct = await products.update({
        where: { id: productId },
        data: {
          name,
          description,
          price,
          image: newImageUrl,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Successfully updated product",
        data: updatedProduct,
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    const productId = Number(req.params.id);
    try {
      const product = await products.delete({
        where: {
          id: productId,
        },
      });

      res.status(200).json({
        success: true,
        message: "Successfully to delete product",
        data: product,
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
      res.status(400).json({ success: false, message: error.message });
    }
  },
};
