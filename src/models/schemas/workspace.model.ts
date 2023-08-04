import { Schema, model } from "mongoose";

const workspaceSchema = new Schema({
  name: { type: String, default: ""},
  boards: [{
    board: {
      type: Schema.Types.ObjectId,
      ref: 'board'
    }
  }],
})

const WorkSpace = model("workspace", workspaceSchema);
export default WorkSpace;