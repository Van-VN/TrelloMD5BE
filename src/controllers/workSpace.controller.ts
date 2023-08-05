import User from '../models/schemas/user.model';
import WorkSpace from '../models/schemas/workspace.model';
// import { Schema } from 'mongoose';

export default class WorkSpaceController {
  static async listWorkspaces(req: any, res: any) {
    try {
      return res.json({
        workspaces: await WorkSpace.find({ 'users.idUser': req.params.userId })
      });
    } catch (err) {
      console.log(err);
    }
  }
  static async getWorkspace(req: any, res: any) {
    try {
      return res.json({
        workSpace: await WorkSpace.findOne({ _id: req.params.id }).populate(
          'users.idUser'
        )
      });
    } catch (e) {
      console.log(e);
    }
  }
  static async createWorkspace(req: any, res: any) {
    try {
      const workSpace = new WorkSpace({
        name: req.body.name,
        bio: req.body.bio,
        users: [
          {
            role: 'admin',
            idUser: req.body.userId
          }
        ]
      });
      await workSpace.save();
      return res.json({ message: 'Tạo workspace thành công' });
    } catch (err) {
      console.log(err);
      return res.json({ error: 'Có lỗi xảy ra, vui lòng thử lại...' });
    }
  }

  static async addUserToWorkspace(req: any, res: any) {
    try {
      const userId = req.body.userId;
      const wsId = req.body.wsId;
      const user = await User.findOne({ _id: userId });
      const workspace = await WorkSpace.findOne({ _id: wsId });
      if (workspace && user) {
        const userDupplicateCheck = workspace.users.some((user) =>
          user.idUser.equals(userId)
        );
        if (!userDupplicateCheck) {
          await WorkSpace.updateOne(
            { _id: wsId },
            { $push: { users: { idUser: userId, role: 'member' } } }
          );
          return res.json({
            message: `Thêm người dùng ${user.userName} vào workspace thành công!`
          });
        } else {
          return res.json({
            error: `Đã tồn tại người dùng ${user.userName} trong workspace`
          });
        }
      } else {
        return res.json({ error: 'Người dùng hoặc workspace không tồn tại' });
      }
    } catch (err) {
      console.log(err);
      return res.json({ error: 'Có lỗi xảy ra, vui lòng thử lại sau!' });
    }
  }
}
