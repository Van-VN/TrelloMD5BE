import { Schema, model } from 'mongoose';

const workspaceSchema = new Schema({
  name: String,
  boards: [
    {
      board: {
        type: Schema.Types.ObjectId,
        ref: 'board'
      }
    }
  ],
  users: [{
    role: { type: String, default: "member"},
    idUser: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    }
  }],
  bio: String
});

const WorkSpace = model('workspace', workspaceSchema);
export default WorkSpace;
