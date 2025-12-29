import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

const { connect, connection } = mongoose;

const env = process.env.NODE_ENV === 'production' ? '.env.uat' : '.env.local';
dotenv.config({ path: path.resolve(process.cwd(), env) });

const connectDB = async () => {
  try {
    const DB = process.env.DATABASE.replace(
      "<db_password>",
      process.env.DATABASE_PASSWORD
    );

    await connect(DB);
    console.log(`✅ Mongodb Connected at : ${connection.host}`);
    
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDB;