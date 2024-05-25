import { PrismaClient } from "@prisma/client";
import express from "express";

const app = express();
const PORT = 5000;
const prisma = new PrismaClient();

app.use(express.json());

//POST
app.post("/users", async (req, res, next) => {
  const {name, gender, email, password} = req.body;
  const result = await prisma.users.create({
    data: {
      name,
      gender,
      email,
      password,
    },
  });
  res.json({
    data: result,
    message: "Success to create user",
  });
});

app.listen(PORT, () => {
  console.log(`Server running at PORT ${PORT}`);
});
