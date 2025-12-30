import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';
import app from "./app.js";

dotenv.config();

const connectDB = async () => {
  try {
    const dbFolderPath = path.resolve('database');
    await fs.mkdir(dbFolderPath, { recursive: true });
    console.log('Database folder initialized');
  } catch (err) {
    console.error('❌ Database initialization failed:', err);
    process.exit(1);
  }
};

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 5000;

connectDB();
app.listen(PORT, () => {
  console.log(`server running on: http://${HOST}:${PORT}`);
});
