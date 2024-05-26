import express from "express";

const router = require("./routes");
require("dotenv").config();
const app = express();
const PORT = 5000;

app.use(express.json());
app.use("/api/v1", router);
app.get("*", (req, res) => {
  return res.status(404).json({
    error: "Hello👋, This Endpoint is not registered brow!",
  });
});

app.listen(PORT, () => {
  console.log(`Server running at PORT ${PORT}`);
});
