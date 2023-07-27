import User from '../models/schemas/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Post from '../models/schemas/post.model';

export default class UserController {
  static async createUser(req: any, res: any) {
    try {
      const userCheck = await User.find({ userName: req.body.userName });
      if (userCheck.length !== 0) {
        return res.json({
          message: `Đã tồn tại người dùng với tên đăng nhập ${req.body.userName} !`
        });
      } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
          userName: req.body.userName,
          fullName: req.body.fullName,
          gender: req.body.gender,
          password: hashedPassword
        });
        res.json({
          status: 'ok'
        });
        return await user.save();
      }
    } catch (err) {
      console.log(err);
      return res.json({ err: 'Error' });
    }
  }

  static async getUser(req: any, res: any) {
    try {
      const user: any = await User.findOne({ userName: req.body.userName });
      if (!user) {
        return res.json({
          message: `Không tồn tại người dùng ${req.body.userName} !`
        });
      } else {
        const checkPassword = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (checkPassword) {
          const payload = {
            userName: req.body.userName
          };
          const accessToken = jwt.sign(payload, 'ninjacat1');
          const userData = {
            _id: user._id,
            userName: user.userName,
            fullName: user.fullName,
            avatarUrl: user.avatarUrl,
            bio: user.bio,
            gender: user.gender
          };

          return res.json({ accessToken, userData });
        } else {
          return res.json({
            message: 'Mật khẩu nhập vào không chính xác !'
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  static async getUserInfo(req: any, res: any) {
    try {
      const user = await User.findById({ _id: req.body._id });
      if (!user) {
        res.json({ message: 'Người dùng không tồn tại!' });
      } else {
        res.json({ user: user });
      }
    } catch (err) {
      console.log(err);
    }
  }

  static async updateUser(req: any, res: any) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.findOne({ _id: req.body.userId });
    if (!user) {
      res.json({ message: 'User không tồn tại!' });
    }
    return await User.updateOne(
      { _id: req.body.userId },
      {
        $set: {
          ...(req.body.bio && { bio: req.body.bio }),
          ...(req.body.avatarUrl && { avatarUrl: req.body.avatarUrl }),
          ...(req.body.gender && { gender: req.body.gender }),
          ...(req.body.password && { password: hashedPassword })
        }
      }
    );
  }

  static async getPostsFromUser(req: any, res: any) {
    try {
      const user = await User.findOne({ userName: req.params.id }).populate(
        'posts.post'
      );

      if (user) {
        const data = user.posts.reverse();
        res.json({ posts: data, user: user });
      } else {
        res.json({ message: 'User không tồn tại!' });
      }
    } catch (err) {
      console.log(err);
    }
  }
  static async getPostsSaved(req: any, res: any) {
    try {
      const user: any = await User.findOne({ userName: req.params.id });
      const savedPosts = await Post.find({ 'saved.user': user._id })
        .populate('user')
        .populate('comments.postedBy')
        .populate('likes.user')
        .populate('saved.user')
        .exec();
      if (user) {
        res.json({ posts: savedPosts, user: user });
      } else {
        res.json({ message: 'User không tồn tại!' });
      }
    } catch (err) {
      console.log(err);
    }
  }
}
