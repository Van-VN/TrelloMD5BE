import Column from "../models/schemas/column.model";


export default class ColumnController {
    static async CreateColection(req: any, res: any) {
          await Column.find({ userName: req.body.userName });
          return res.json({
            message: `test`
          });
      }

}