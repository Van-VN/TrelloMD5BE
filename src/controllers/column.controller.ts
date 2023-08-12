import Board from '../models/schemas/board.model';
import Column from '../models/schemas/column.model';
import Task from '../models/schemas/task.model';

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
        const boardSendToFE = await Board.findOne({
          _id: req.body.board
        }).populate({
          path: 'columns',
          populate: { path: 'tasks', model: 'task' }
        });
        return res.json({ data: boardSendToFE });
      } else {
        return res.json({ error: 'Bảng không tồn tại!' });
      }
    } catch (err) {
      console.log(err);
      return res.json({ error: 'Có lỗi xảy ra, vui lòng thử lại sau!' });
    }
  }

  static async addTaskToCol(req: any, res: any) {
    try {
      const column = await Column.findOne({ _id: req.body.columnId });
      if (column) {
        const newTask = await Task.create({ content: req.body.taskTitle });
        await Column.updateOne(
          { _id: req.body.columnId },
          { $push: { tasks: newTask._id } }
        );
        // const columnToFe = await Column.findOne({ _id: req.body.columnId });
        return res.json({ data: newTask });
      } else {
        return res.json({ error: 'Column không tồn tại!' });
      }
    } catch (err) {
      console.log(err);
      return res.json({ error: 'Có lỗi xảy ra, vui lòng thử lại sau!' });
    }
  }

  static async updateDragDropTask(req: any, res: any) {
    try {
      const startingCol = await Column.findOne({ _id: req.body.startingColId });
      const endingCol = await Column.findOne({ _id: req.body.endingColId });
      const endedIndex = +req.body.endedIndex;

      if (startingCol && endingCol) {
        await Column.updateOne(
          { _id: req.body.startingColId },
          { $pull: { tasks: req.body.removedItemId } }
        );

        await Column.updateOne(
          { _id: req.body.endingColId },
          {
            $push: {
              tasks: { $each: [req.body.removedItemId], $position: endedIndex }
            }
          }
        );
        const boardToFe = await Board.findOne({
          _id: req.body.boardId
        }).populate({
          path: 'columns',
          populate: { path: 'tasks', model: 'task' }
        });
        return res.json({ board: boardToFe });
      } else {
        return res.json({ error: 'Cột không tồn tại!' });
      }
    } catch (err) {
      console.log(err);
    }
  }
}
