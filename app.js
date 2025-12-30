import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import userRoutes from './routes/user.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: [process.env.ORIGIN_OPTIONS || "http://localhost:3418"],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use('/api/users', userRoutes);

app.use((req, res) => {
  res.status(404).send("404 - API not found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

export default app;