import Project from "../models/schemas/project.model";

export default class ProjectController {
    static async CreateColection(req: any, res: any) {
          await Project.find({ userName: req.body.userName });
          return res.json({
            message: `test`
          });
      }

}