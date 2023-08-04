import WorkSpace from '../models/schemas/workspace.model';

export default class WorkSpaceController {
  static async listWorkspaces(req: any, res: any) {}

  static async createWorkspace(req: any, res: any) {
    try {
      const workSpace = new WorkSpace({
        name: req.body.name,
        bio: req.body.bio
      });
      await workSpace.save();
      return res.json({ message: 'Tạo workspace thành công' });
    } catch (err) {
      console.log(err);
      return res.json({ error: 'Có lỗi xảy ra, vui lòng thử lại...' });
    }
  }
}
