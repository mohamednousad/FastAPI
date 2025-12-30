import app from "./app.ts";
import dotenv from 'dotenv';
import connectDB from "./db/config.ts";

dotenv.config();

const HOST: string = process.env.HOST || 'localhost';
const PORT: string | number = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
    console.log(`✅ server running on: http://${HOST}:${PORT}`);
});