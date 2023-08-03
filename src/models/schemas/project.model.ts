import { Schema, model } from "mongoose";

const projectSchema = new Schema({
  title: { type: String, default: "" },
  users: [{
    type: Schema.Types.ObjectId,
    ref: "user",
  }]
});
const Project = model("project", projectSchema);

export default Project;
