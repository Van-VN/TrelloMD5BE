import { Schema, model } from "mongoose";

const boardSchema = new Schema({
    title: { type: String, default: ""},
    users: [{
        role: { type: String, default: "member"},
        idUser: {
            type: Schema.Types.ObjectId,
            ref: 'user' // Tham chiếu đến collection 'user'
        }
    }],
    Visibility: { type: String, default: "WorkSpace"}
})

const Board = model("board", boardSchema);

export default Board;