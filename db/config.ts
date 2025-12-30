import fs from 'fs/promises';
import path from 'path';

const connectDB = async () => {
  try {
    const dbFolderPath = path.resolve('database');
    await fs.mkdir(dbFolderPath, { recursive: true });
    
    console.log("📂 Database folder initialized");
  } catch (err) {
    console.error("❌ Database initialization failed:", err);
    process.exit(1);
  }
};

export default connectDB;
