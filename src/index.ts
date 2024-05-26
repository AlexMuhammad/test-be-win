import express from "express";
require("dotenv").config();

const swaggerUi = require('swagger-ui-express');
const documentation = require('./docs/api.json')
const bodyParser = require("body-parser");
const router = require("./routes");
const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(documentation));
app.use("/api/v1", router);
app.get("*", (req, res) => {
  return res.status(404).json({
    error: "Hello👋, This Endpoint is not registered brow!",
  });
});

app.listen(PORT, () => {
  console.log(`Server running at PORT ${PORT}`);
});
