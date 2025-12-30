import dotenv from "dotenv";
import express, { Application, Request, Response, NextFunction } from "express";
import cors, { CorsOptions } from "cors";
import userRoutes from './routes/user';

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions: CorsOptions = {
  origin: [process.env.ORIGIN_OPTIONS || "http://localhost:3418"],
  credentials: true,
  optionsSuccessStatus: 200, 
};

app.use(cors(corsOptions));

app.use('/api/users', userRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).send("404 - API not found");
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

export default app;