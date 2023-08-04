import { Schema, model } from "mongoose";

const columnOrderSchema = new Schema({
  columns: [{
    type: Schema.Types.ObjectId,
    ref: "column",
  }]
});
const ColumnOrder = model("columnOrder", columnOrderSchema);

export default ColumnOrder;
