import User from '../models/schemas/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export default class UserController {
  static async createUser(req: any, res: any) {
    try {
      const userCheck = await User.find({ userName: req.body.userName });
      if (userCheck.length !== 0) {
        return res.json({
          message: `Đã tồn tại người dùng với username: ${req.body.userName}`
        });
      } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
          userName: req.body.userName,
          fullName: req.body.fullName,
          password: hashedPassword,
          email: req.body.email
        });
        // return await user.save();
        if (await user.save()) {
          return res.json({ success: 'Tạo thành công người dùng' });
        } else {
          return res.json({ message: 'Có lỗi xảy ra, vui lòng thử lại!' });
        }
      }
    } catch (err) {
      console.log(err);
      return res.json({ message: 'Có lỗi xảy ra, vui lòng thử lại!' });
    }
  }

  static async userLogin(req: any, res: any) {
    try {
      const user = await User.findOne({ userName: req.body.userName });
      if (!user) {
        return res.json({
          message: `Không tồn tại người dùng với username: ${req.body.userName}`
        });
      } else {
        const hashedPassword = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (hashedPassword) {
          const payload = { userName: req.body.userName };
          const accessToken = jwt.sign(payload, process.env.VITE_JWT_SECRET);
          const userData = {
            _id: user._id,
            userName: user.userName,
            fullName: user.fullName,
            avatarUrl: user.avatarUrl,
            bio: user.bio,
            jobTitle: user.jobTitle,
            email: user.email
          };
          return res.json({
            accessToken,
            userData,
            success: 'Đăng nhập thành công!'
          });
        } else {
          return res.json({
            message: 'Nhập khẩu vừa nhập vào không chính xác'
          });
        }
      }
    } catch (err) {
      console.log(err);
      return res.json({ message: 'Có lỗi xảy ra, vui lòng thử lại!' });
    }
  }

  static async updateUser(req: any, res: any) {
    try {
      const user = User.findOne({ _id: req.body.id });
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      if (user) {
        await User.updateOne(
          { _id: req.body.userId },
          {
            $set: {
              ...(req.body.bio && { bio: req.body.bio }),
              ...(req.body.avatarUrl && { avatarUrl: req.body.avatarUrl }),
              ...(req.body.jobTitle && { gender: req.body.jobTitle }),
              ...(req.body.password && { password: hashedPassword })
            }
          }
        );

        return res.json({
          message: `Cập nhật thành công người dùng ${req.body.userName}!`
        });
      } else {
        return res.json({
          message: 'Không tồn tại người dùng đang muốn thay đổi!'
        });
      }
    } catch (err) {
      console.log(err);
      return res.json({ message: 'Có lỗi xảy ra, vui lòng thử lại!' });
    }
  }

  static async searchUsers(req: any, res: any) {
    try {
      const searchValue = req.query.u;
      const users = await User.find({
        userName: { $regex: searchValue, $options: 'i' }
      });
      return res.json({ data: users });
    } catch (err) {
      console.log(err);
      return res.json({ error: 'Có lỗi xảy ra, vui lòng thử lại sau...' });
    }
  }
}
