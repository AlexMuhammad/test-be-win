import { NextFunction, Request, Response } from "express";
const { products } = require("../models/index");
const cloudinary = require("../middlewares/cloudinary");

module.exports = {
  async getListProduct(req: Request, res: Response, next: NextFunction) {
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
        where: conditions,
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

  async createProduct(req: Request, res: Response, next: NextFunction) {
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

      if (!isProductExist) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
      let newImageUrl = isProductExist.image;
      if (req.file) {
        const fileBase64 = req.file.buffer.toString("base64");
        const file = `data:${req.file.mimetype};base64,${fileBase64}`;
        const result = cloudinary.uploader.upload(file, {
          folder: "products-test",
        });

        //Delete the old image to cloudinary
        const oldImagePublicId = isProductExist.image
          .split("/")
          .pop()
          .split(".")[0];
        console.log("oldImagePublicId", oldImagePublicId);
        await cloudinary.uploader.destroy(`products-test/${oldImagePublicId}`);

        const product = await products.update({
          where: {
            id: productId,
          },
          data: {
            name,
            description,
            price,
            image: result.secure_url,
          },
        });
        res.status(200).json({
          success: true,
          message: "Successfully to update product",
          data: product,
        });
      }
    } catch (error: any) {
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