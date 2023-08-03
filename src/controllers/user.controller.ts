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
        if (await user.save()) {
          return res.json({
            message: `Tạo tài khoản thành công`
          });

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
            userData
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
}
