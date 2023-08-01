import mongoose from 'mongoose';
import 'dotenv/config';

export default class ConnectDB {
  async connect() {
    return await mongoose.connect(process.env.VITE_DB_URL);
  }
}
