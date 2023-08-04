import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  userName: String,
  fullName: String,
  password: String,
  avatarUrl: {
    type: String,
    default:
      'https://firebasestorage.googleapis.com/v0/b/module5instagram-b1f91.appspot.com/o/BaseFiles%2Fdefaultuser.jpg?alt=media&token=b4932bc6-f626-4605-a2f5-99f0e79bcfda'
  },
  bio: { type: String, default: '' },
  jobTitle: { type: String, default: 'Employee' },
  email: String,
  securityQuestion: { 
    question: {type: String, default: 'Con vật bạn thích nhất là gì'},
    answer: String
  }
});
const User = model('user', userSchema);

export default User;
