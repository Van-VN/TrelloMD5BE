import ColumnOrder from "../models/schemas/columnOrder.model";

export default class ColumnOrderController {
    static async CreateColection(req: any, res: any) {
          await ColumnOrder.find({ userName: req.body.userName });
          return res.json({
            message: `test`
          });
      }

}