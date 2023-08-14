import User from '../models/schemas/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import nodemailer from 'nodemailer'
import { OAuth2Client } from 'google-auth-library'
const crypto = require("crypto");

const GOOGLE_MAILER_CLIENT_ID = '991351297491-nvc4frjhcq7873thseuk7b2lpr0fnh79.apps.googleusercontent.com'
const GOOGLE_MAILER_CLIENT_SECRET = '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'
const GOOGLE_MAILER_REFRESH_TOKEN = '1//04kRzpx_HeBwVCgYIARAAGAQSNwF-L9IrD6yNjVmizmkWQuzmtgVWDaACCmb1q5s2Bc94bzwOD7Aq74uzB-3TOYcA2FKYHC4fkI4'
const ADMIN_EMAIL_ADDRESS = 'mach0jc0d0n14@gmail.com'

// Khởi tạo OAuth2Client với Client ID và Client Secret 
const myOAuth2Client = new OAuth2Client(
  GOOGLE_MAILER_CLIENT_ID,
  GOOGLE_MAILER_CLIENT_SECRET
)
// Set Refresh Token vào OAuth2Client Credentials
myOAuth2Client.setCredentials({
  refresh_token: GOOGLE_MAILER_REFRESH_TOKEN
})

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
      const emailCheck = await User.findOne({ email: req.body.email });
      if (userCheck.length !== 0) {
        return res.json({
          message: `Đã tồn tại người dùng với username: ${req.body.userName}`
        });
      } else if (emailCheck) {
        return res.json({
          message: `Email ${req.body.email} đã được đăng ký`
        });
      } else {
        const generateRandomToken = () => {
          return crypto.randomBytes(20).toString("hex");
        };
        const token = generateRandomToken();
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
          userName: req.body.userName,
          fullName: req.body.fullName,
          password: hashedPassword,
          email: req.body.email,
          tokenAuthEmail: token
        });
        if (await user.save()) {
          const content = `Hello http://localhost:8686/api/user/confirmEmail/${token}`;
          //! gửi email xác thực người dùng
          UserController.sentEmail(req.body.email, "Xác nhận tài khoản", content).then(() => {
            console.log("sent successful");
          }).catch(err => console.log(err))
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

      const comparePassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (comparePassword) {
        console.log("Đúng pass");
        if (req.body.newPassword !== req.body.checkNewPassword) {
          return res.json({ message: 'Mật khẩu mới không trùng nhau' });

        } else {
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
        }
      } else {
        return res.json({ message: 'Mật khẩu cũ không đúng' });
      }

    } catch (error) {
      return res.json({ message: 'Bạn cần đăng nhập trước đã' });
    }

  }

  static async sentNewPassword(req: any, res: any) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.json({ success: 'Email không tồn tại trong hệ thống' });
      } else {
        const generateRandomToken = () => {
          return crypto.randomBytes(10).toString("hex");
        };
        const token = generateRandomToken();
        const hashedPassword = await bcrypt.hash(token, 10);
        user.password = hashedPassword;
        user.save().then(savedUser => {
          console.log("User saved:", savedUser);
        })
          .catch(error => {
            console.error("Error saving user:", error);
          });
        const content = `Password mới của tài khoản ${user.userName} là: ${token}
        Vui lòng đổi mật khẩu tại đây....`;
        //! gửi email xác thực người dùng
        UserController.sentEmail(req.body.email, "Xác nhận tài khoản", content).then(() => {
          console.log("sent successful");
        }).catch(err => console.log(err))
        return res.json({ success: 'Đã gửi email reset mật khẩu thành công' });
      }
    } catch (error) {
      return res.json({ success: 'Có lỗi xảy ra' });
    }
  }
  static async sentEmail(email, subject, content) {
    try {
      if (!email || !subject || !content) throw new Error('Please provide email, subject and content!')
      /**
       * Lấy AccessToken từ RefreshToken (bởi vì Access Token cứ một khoảng thời gian ngắn sẽ bị hết hạn)
       * Vì vậy mỗi lần sử dụng Access Token, chúng ta sẽ generate ra một thằng mới là chắc chắn nhất.
       */
      const myAccessTokenObject = await myOAuth2Client.getAccessToken()
      // Access Token sẽ nằm trong property 'token' trong Object mà chúng ta vừa get được ở trên
      const myAccessToken = myAccessTokenObject?.token

      // Tạo một biến Transport từ Nodemailer với đầy đủ cấu hình, dùng để gọi hành động gửi mail
      const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: ADMIN_EMAIL_ADDRESS,
          clientId: GOOGLE_MAILER_CLIENT_ID,
          clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
          refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
          accessToken: myAccessToken
        }
      })

      // mailOption là những thông tin gửi từ phía client lên thông qua API
      const mailOptions = {
        to: email, // Gửi đến ai?
        subject: subject, // Tiêu đề email
        html: `<h3>${content}</h3>` // Nội dung email
      }

      // Gọi hành động gửi email
      await transport.sendMail(mailOptions)
      console.log("Sent Mail Successfully");

    } catch (error) {
      console.log(error)
    }

  }
  static async authEmail(req: any, res: any) {
    try {
      console.log(req.params.token);
      const user = await User.findOne({ tokenAuthEmail: req.params.token });
      user.authEmail = true;
      user.save().then(savedUser => {
        console.log("User saved:", savedUser);
      })
        .catch(error => {
          console.error("Error saving user:", error);
        });
      console.log(user);
      const htmlResponse = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Xác nhận tài khoản</title>
          </head>
          <body>
            <h1>Xác nhận tài khoản</h1>
            <p>Bạn đã xác nhận email ${user.email} liên kết với tài khoản ${user.userName} thành công. Cảm ơn bạn và chúc bạn một ngày tốt lành!</p>
          </body>
        </html>
   `;
      return res.send(htmlResponse)
    } catch (error) {
      console.log(error);
      return res.json({ message: 'Có lỗi xảy ra' });
    }
  }
}
