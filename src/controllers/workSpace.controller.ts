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
        ).populate('boards.board')
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
      return res.json({ message: 'Tạo workspace thành công', workSpace: workSpace });
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
          const data = await WorkSpace.findOne({ _id: wsId }).populate(
            'users.idUser'
          );
          return res.json({
            message: `Thêm người dùng ${user.userName} vào workspace thành công!`,
            workspace: data
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

  static async deleteWorkSpace(req: any, res: any) {
    try {
      const ws = await WorkSpace.findOne({ _id: req.params.id });
      if (ws) {
        await WorkSpace.findByIdAndDelete({ _id: req.params.id });
        return res.json({ message: 'Xóa Workspace thành công!' });
      } else {
        return res.json({ error: 'Workspace không tồn tại' });
      }
    } catch (err) {
      console.log(err);
      return res.json({ error: 'Có lỗi xảy ra, vui lòng thử lại!' });
    }
  }

  static async removeUserFromWorkspace(req: any, res: any) {
    try {
      const workSpaceId = req.query.w;
      const userId = req.query.u;
      const workSpaceCheck = await WorkSpace.findOne({ _id: workSpaceId });

      if (workSpaceCheck) {
        const userInWSCheck = await WorkSpace.findOne({
          _id: workSpaceId,
          users: { $elemMatch: { idUser: userId } }
        });
        if (userInWSCheck) {
          await WorkSpace.updateOne(
            { _id: workSpaceId },
            { $pull: { users: { idUser: userId } } }
          );

          const data = await WorkSpace.findOne({ _id: workSpaceId }).populate(
            'users.idUser'
          );
          return res.json({
            message: 'Xóa thành công người dùng khỏi workspace',
            workspace: data
          });
        } else {
          return res.json({
            error: 'Không tồn tại người dùng trong workspace!'
          });
        }
      } else {
        return res.json({ error: 'Có lỗi xảy ra, workspace không tồn tại!' });
      }
    } catch (err) {
      console.log(err);
      return res.json({ message: 'Có lỗi xảy ra, vui lòng thử lại!' });
    }
  }

  static  async updateWorkSpace(req: any, res: any) {
    try {
      const ws = await WorkSpace.findOne({ _id: req.params.id }).populate('users.idUser')
      let message = ''
      if (ws) {
        ws.name = req.body.name;
        ws.bio = req.body.bio;
        if (await ws.save()){
          message = 'Cập nhật thành công  workspace'
        } else {
          message = 'Cập nhật workspace thất bại'
        }
        return res.json({
          message: message,
          workspace: ws
        });
      }
    } catch (err) {
      console.log(err);
      return res.json({ message: 'Có lỗi xảy ra, vui lòng thử lại!' });
    }
  }
}
