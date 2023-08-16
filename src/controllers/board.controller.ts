import Board from '../models/schemas/board.model';
import Task from '../models/schemas/task.model';
import User from '../models/schemas/user.model';
import WorkSpace from '../models/schemas/workspace.model';

export default class BoardController {
  static async createBoard(req: any, res: any) {
    try {
      const workspace = await WorkSpace.findOne({
        _id: req.body.workspace
      }).populate('boards.board');

      // @ts-ignore
      const titleCheck = workspace.boards.some(
        // @ts-ignore
        (boardObj) => boardObj.board.title === req.body.title
      );
      if (titleCheck) {
        return res.json({
          errorMessage: 'Board already exists'
        });
      } else {
        const user = await User.findOne({ _id: req.body.userID });
        const board = new Board({
          title: req.body.title,
          backgroundImage: req.body.backgroundImage,
          users: [
            {
              role: 'admin',
              idUser: user
            }
          ]
        });
        if (await board.save()) {
          workspace.boards.push({
            board: board._id
          });
          workspace.save();
          return res.json({
            message: `create board successfully`,
            board: board,
            workspaceId: workspace._id
          });
        }
      }
    } catch (error) {
      console.log(error);
      return res.json({
        errorMessage: `Something went wrong`
      });
    }
  }
  static async addMember(req: any, res: any) {
    const boardCheck = await Board.findOne({ _id: req.params.idBoard });
    const userCheck = await User.findOne({ userName: req.params.nameMember });

    if (!userCheck) {
      return res.json({
        message: `User ${req.params.nameMember} does not exist`
      });
    } else {
      const isIdUser = boardCheck.users.some(
        (user) => user.idUser.toString() === userCheck._id.toString()
      );
      if (isIdUser) {
        return res.json({
          message: `User ${req.params.nameMember} already on board`
        });
      } else {
        boardCheck.users.push({
          idUser: userCheck._id,
          role: ''
        });
        await Board.updateOne(
          { _id: req.params.idBoard },
          { $set: { users: boardCheck.users } }
        );

        return res.json({
          message: `Add member ${req.params.nameMember} successfully`
        });
      }
    }
  }

  static async getBoardDetail(req: any, res: any) {
    try {
      const board = await Board.findOne({ _id: req.params.id }).populate({
        path: 'columns',
        populate: { path: 'tasks', model: 'task' }
      });
      return res.json({ board: board });
    } catch (err) {
      console.log(err);
    }
  }

  static async updateBoardTitle(req: any, res: any) {
    try {
      const board = await Board.findOne({ _id: req.body.boardId });
      if (board) {
        await Board.updateOne(
          { _id: req.body.boardId },
          { title: req.body.title }
        );
        const board = await Board.findOne({ _id: req.body.boardId }).populate({
          path: 'columns',
          populate: { path: 'tasks', model: 'task' }
        });
        return res.json({ board: board });
      } else {
        return res.json({ error: 'Bảng không tồn tại!' });
      }
    } catch (err) {
      console.log(err);
      return res.json({ error: 'Có lỗi xảy ra, vui lòng thử lại!' });
    }
  }

  static async updateDragDrop(req: any, res: any) {
    try {
      const board = await Board.findOne({ _id: req.body.board });
      if (board) {
        const updatedCol = req.body.array;
        await Board.updateOne(
          { _id: req.body.board },
          { $set: { columns: updatedCol } }
        );
        const dataToFe = await Board.findOne({ _id: req.body.board }).populate({
          path: 'columns',
          populate: { path: 'tasks', model: 'task' }
        });
        return res.json({
          board: dataToFe
        });
      } else {
        return res.json({ error: 'Bảng không tồn tại!' });
      }
    } catch (err) {
      console.log(err);
      return res.json({ error: 'Có lỗi xảy ra, vui lòng thử lại sau!' });
    }
  }

  static async getTaskInfo(req: any, res: any) {
    try {
      const task = await Task.findOne({ _id: req.body.taskId });
      if (task) {
        return res.json({ task: task });
      } else {
        return res.json({ error: 'Task không tồn tại !' });
      }
    } catch (err) {
      console.log(err);
      return res.json({ error: 'Có lỗi xảy ra, vui lòng thử lại sau!' });
    }
  }

  static async updateTaskDescription(req: any, res: any) {
    console.log(req.body);
    try {
      const task = await Task.findOne({ _id: req.body.taskId });
      const board = await Board.findOne({ _id: req.body.boardId });
      if (task && board) {
        await Task.updateOne(
          { _id: req.body.taskId },
          { description: req.body.description }
        );
        const board = await Board.findOne({ _id: req.body.boardId }).populate({
          path: 'columns',
          populate: { path: 'tasks', model: 'task' }
        });
        return res.json({ board: board });
      } else {
        return res.json({ error: 'Task hoặc bảng không tồn tại !' });
      }
    } catch (err) {
      console.log(err);
      return res.json({ error: 'Có lỗi xảy ra, vui lòng thử lại sau!' });
    }
  }

  static async addFileToTask(req: any, res: any) {
    try {
      const task = await Task.findOne({ _id: req.body.taskId });
      const board = await Board.findOne({ _id: req.body.boardId });
      if (task && board) {
        const filesUpload = {
          name: req.body.name,
          url: req.body.url,
          type: req.body.type
        };
        Task.updateOne(
          { _id: req.body.taskId },
          {
            $push: {
              files: filesUpload
            }
          }
        ).exec();
        const boardToFE = await Board.findOne({
          _id: req.body.boardId
        }).populate({
          path: 'columns',
          populate: { path: 'tasks', model: 'task' }
        });
        return res.json({ board: boardToFE });
      } else {
        return res.json({ error: 'Bảng hoặc task không tồn tại!' });
      }
    } catch (err) {
      console.log(err);
      return res.json({ error: 'Có lỗi xảy ra, vui lòng thử lại sau!' });
    }
  }
}
