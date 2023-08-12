import { Schema, model } from 'mongoose';

const boardSchema = new Schema({
  title: { type: String, default: '' },
  users: [
    {
      role: { type: String, default: 'member' },
      idUser: {
        type: Schema.Types.ObjectId,
        ref: 'user' // Tham chiếu đến collection 'user'
      }
    }
  ],
  columns: [
    {
      type: Schema.Types.ObjectId,
      ref: 'column'
    }
  ],
  visibility: { type: String, default: 'public' },
  backgroundImage: { type: String, default: '2.avif' }
});

const Board = model('board', boardSchema);

export default Board;
