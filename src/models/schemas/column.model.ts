import { Schema, model } from "mongoose";

const columnSchema = new Schema({
  title: { type: String, default: "" },
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: "task",
  }]
});
const Column = model("column", columnSchema);

export default Column;
