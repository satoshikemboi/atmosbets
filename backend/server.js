import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import footballRoutes from "./routes/footballRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/football", footballRoutes);

app.get("/", (req, res) => {
  res.send("Football API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});