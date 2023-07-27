import mongoose from "mongoose";
import "dotenv/config";

export default class ConnectDB {
  async connect() {
    return await mongoose.connect(
      "mongodb+srv://vanvn:q8jqeRjWkg9hcSOl@module4instagram.wjqzker.mongodb.net/"
    );
  }
}
