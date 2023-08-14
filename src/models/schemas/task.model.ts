import { Schema, model } from 'mongoose';

const taskSchema = new Schema({
  content: { type: String, default: '' },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user'
    }
  ],
  description: String
});
const Task = model('task', taskSchema);

export default Task;
