export default class WorkSpaceController {
  static async listWorkspaces(req: any, res: any) {}

  static async createWorkspace(req: any, res: any) {
    console.log(req.body);
    res.json({ message: 'ok' });
  }
}
