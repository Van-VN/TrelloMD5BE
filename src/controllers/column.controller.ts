import Board from '../models/schemas/board.model';
import Column from '../models/schemas/column.model';

export default class ColumnController {
  static async CreateColection(req: any, res: any) {
    await Column.find({ userName: req.body.userName });
    return res.json({
      message: `test`
    });
  }

  static async addColumnToBoard(req: any, res: any) {
    try {
      const board = await Board.findOne({ _id: req.body.board });
      if (board) {
        const newColumn = await Column.create({ title: req.body.column });
        await Board.updateOne(
          { _id: req.body.board },
          { $push: { columns: newColumn._id } }
        );
        const boardSendToFE = await Board.findOne({ _id: req.body.board });
        return res.json({ data: boardSendToFE });
      } else {
        return res.json({ error: 'Bảng không tồn tại!' });
      }
    } catch (err) {
      console.log(err);
      return res.json({ error: 'Có lỗi xảy ra, vui lòng thử lại sau!' });
    }
  }
}
