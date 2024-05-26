import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

module.exports = {
    users: prisma.user,
    products: prisma.product
}