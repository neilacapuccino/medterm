// STEP 1 - server
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./authRoutes";          
import microserviceRoutes from "./microserviceRoutes";    

dotenv.config();

const app = express();

app.use(cors());           // lets the React app (another port) call this server
app.use(express.json());

app.use("/api/auth", authRoutes);              // STEP 3
app.use("/api/microservices", microserviceRoutes);     // STEP 6

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}/`);
});

app.get("/", (_req, res) => {
  res.send("hello from server");
});
