import { Schema, model } from "mongoose";

const postSchema = new Schema({
  description: { type: String, default: "" },
  createAt: { type: Date, default: new Date().toDateString() },
  imgUrl: String,
  comments: [
    {
      comment: String,
      created: { type: Date, default: new Date().toDateString() },
      postedBy: { type: Schema.Types.ObjectId, ref: "user" },
    },
  ],
  likes: [
    {
      user: { type: Schema.Types.ObjectId, ref: "user" },
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  saved: [
    {
      user: { type: Schema.Types.ObjectId, ref: "user" },
    },
  ],
});

const Post = model("post", postSchema);

export default Post;
