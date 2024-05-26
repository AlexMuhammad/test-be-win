import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

module.exports = {
    users: prisma.users,
    products: prisma.products
}