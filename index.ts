import express from "express";

const app = express();
const PORT = 5000;

//READ
app.get("/products", (req, res) => {
  res.json({
    message: "Product List",
  });
});

app.listen(PORT, () => {
  console.log(`Server running at PORT ${PORT}`);
});
