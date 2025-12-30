import app from "./app.js";
import dotenv from 'dotenv';
dotenv.config();

import connectDB from "./db/config.js";

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 5000;

connectDB();
app.listen(PORT, () => {
    console.log(`✅ Amuryx server running on: http://${HOST}:${PORT}`);
});