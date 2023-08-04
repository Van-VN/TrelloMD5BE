import WorkSpace from '../models/schemas/workspace.model';
// import { Schema } from 'mongoose';

export default class WorkSpaceController {
  static async listWorkspaces(req: any, res: any) {
    try {
      return res.json({ workspaces: await WorkSpace.find({'users.idUser': req.params.userId}) })
    } catch (err) {
      console.log(err);
    }
  }
  static async getWorkspace(req: any, res: any) {
    try {
      return res.json({ workSpace: await WorkSpace.findOne({ _id: req.params.id }).populate('users.idUser') });
    } catch (e){
      console.log(e);
    }
  }
  static async createWorkspace(req: any, res: any) {
    try {
      const workSpace = new WorkSpace({
        name: req.body.name,
        bio: req.body.bio,
        users: [{
          role: "admin",
          idUser: req.body.userId
        }],
      });
      await workSpace.save();
      return res.json({ message: 'Tạo workspace thành công' });
    } catch (err) {
      console.log(err);
      return res.json({ error: 'Có lỗi xảy ra, vui lòng thử lại...' });
    }
  }

}
