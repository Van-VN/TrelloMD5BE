import User from '../models/schemas/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export default class UserController {
  static currentUser: { //! lưu trữ một vài thuộc tính của current User để sử dụng lại
    userId: string,
    userName: string,
  } = {
      userId: "",
      userName: "",
    };
  static setCurrentUser(userId: string, userName: string) {
    UserController.currentUser.userId = userId;
    UserController.currentUser.userName = userName;
    console.log(UserController.currentUser);
  }

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
          email: req.body.email,
          securityQuestion: {
            answer: await bcrypt.hash(req.body.answer, 10)
          }
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
          UserController.setCurrentUser(user._id.toString(), user.userName)

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

  static async getUserInfo(req: any, res: any) {
    try {
      const user = await User.findById({ _id: UserController.currentUser.userId });
        res.json({ 
          message: 'User info',
          user: user 
        });
      
    } catch (err) {
      return res.json({ message: 'Bạn cần đăng nhập trước đã' });
    }
  }

  static async updateUser(req: any, res: any) {
    try {
    await User.updateOne(
      { _id: UserController.currentUser.userId },
      {
        $set: {
          ...(req.body.bio && { bio: req.body.bio }),
          ...(req.body.avatarUrl && { avatarUrl: req.body.avatarUrl }),
          ...(req.body.jobTitle && { jobTitle: req.body.jobTitle }),
          ...(req.body.email && { email: req.body.email }),
          ...(req.body.fullName && { fullName: req.body.fullName })
        }
      }
    );
    return res.json({ message: 'Update thành công' });

    } catch (err) {
      return res.json({ message: 'Bạn cần đăng nhập trước đã' });
    }
  }


  static async resetPassword(req: any, res: any) {
    try {
      const user = await User.findOne({ _id: UserController.currentUser.userId });
      if (req.body.password) {
        const comparePassword = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (comparePassword) {
          console.log("Đúng pass");
          const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
          await User.updateOne(
            { _id: UserController.currentUser.userId },
            {
              $set: {
                ...(req.body.password && { password: hashedPassword })
              }
            }
          );
          return res.json({ message: 'Mật khẩu đã được cập nhật' });


        } else {
          return res.json({ message: 'Mật khẩu cũ không đúng' });
        }

      } else if (req.body.securityAnswer) {
        console.log(user.securityQuestion);
        const compareAnswer = await bcrypt.compare(
          req.body.securityAnswer,
          user.securityQuestion.answer
        );
        
        
        if(compareAnswer) {
          const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
          await User.updateOne(
            { _id: UserController.currentUser.userId },
            {
              $set: { password: hashedPassword }
            }
          );
          return res.json({ message: 'Mật khẩu đã được cập nhật' });
        } else {
          return res.json({ message: 'Câu trả lời không đúng' });
        }
      }
    } catch (error) {
      return res.json({ message: 'Bạn cần đăng nhập trước đã' });
    }

  }
}
