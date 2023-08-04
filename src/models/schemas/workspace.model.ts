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
  bio: String
});

const WorkSpace = model('workspace', workspaceSchema);
export default WorkSpace;
