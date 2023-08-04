import Task from "../models/schemas/task.model";

export default class TaskController {
    static async CreateColection(req: any, res: any) {
        
          await Task.find({ userName: req.body.userName });
          return res.json({
            message: `test`
          });
      }

}