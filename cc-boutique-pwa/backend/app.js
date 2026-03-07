import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Backend de C&C Boutique funcionando");
});
app.get("/api/health", (req, res) => {
  res.json({ status: "API running" });
});

export default app;