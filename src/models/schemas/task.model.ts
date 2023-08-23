import { Schema, model } from 'mongoose';

const taskSchema = new Schema({
  content: { type: String, default: '' },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user'
    }
  ],
  description: String,
  files: [],
  comments: [
    {
      comment: String,
      postedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user' // Tham chiếu đến collection 'user'
      }
    }
  ]
});
const Task = model('task', taskSchema);

export default Task;
