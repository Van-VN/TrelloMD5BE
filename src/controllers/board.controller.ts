import Board from '../models/schemas/board.model';
import Task from '../models/schemas/task.model';
import User from '../models/schemas/user.model';
import WorkSpace from '../models/schemas/workspace.model';
import Column from '../models/schemas/column.model';

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
        const user = await User.findOne({ _id: req.body.userId });
        const board = new Board({
          title: req.body.title,
          backgroundImage: req.body.backgroundImage,
          visibility: req.body.visibility,
          users: [
            {
              role: 'admin',
              idUser: user._id
            }
          ]
        });
        if (await board.save()) {
          workspace.boards.push({
            board: board._id
          });

          workspace.save();

          return res.json({
            message: `Board created successfully`,
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
      const board = await Board.findOne({ _id: req.params.id })
        .populate({
          path: 'columns',
          populate: {
            path: 'tasks',
            model: 'task',
            populate: {
              path: 'comments.postedBy'
            }
          }
        })
        .populate('users.idUser');
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
          {
            title: req.body.title
          }
        );
        const board = await Board.findOne({ _id: req.body.boardId })
          .populate({
            path: 'columns',
            populate: {
              path: 'tasks',
              model: 'task',
              populate: {
                path: 'comments.postedBy'
              }
            }
          })
          .populate('users.idUser');

        // push notifications to user

        const notification = {
          message: req.body.notification.message,
          time: req.body.notification.time,
          board: req.body.notification.board,
          status: req.body.notification.status
        };

        const notificationBoard = await Board.findById(req.body.boardId)
          .populate({
            path: 'columns',
            populate: {
              path: 'tasks',
              model: 'task',
              populate: {
                path: 'comments.postedBy'
              }
            }
          })
          .populate('users.idUser');

        for (let user of notificationBoard.users) {
          await User.updateMany(
            { _id: user.idUser._id },
            { $push: { notification: notification } }
          );
        }

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
        const dataToFe = await Board.findOne({ _id: req.body.board })
          .populate({
            path: 'columns',
            populate: {
              path: 'tasks',
              model: 'task',
              populate: {
                path: 'comments.postedBy'
              }
            }
          })
          .populate('users.idUser');

        // push notifications to user

        const notification = {
          message: req.body.notification.message,
          time: req.body.notification.time,
          board: req.body.notification.board,
          status: req.body.notification.status
        };

        const notificationBoard = await Board.findById(req.body.board)
          .populate({
            path: 'columns',
            populate: {
              path: 'tasks',
              model: 'task',
              populate: {
                path: 'comments.postedBy'
              }
            }
          })
          .populate('users.idUser');

        for (let user of notificationBoard.users) {
          await User.updateMany(
            { _id: user.idUser._id },
            { $push: { notification: notification } }
          );
        }

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
    try {
      const task = await Task.findOne({ _id: req.body.taskId });
      const board = await Board.findOne({ _id: req.body.boardId });
      if (task && board) {
        await Task.updateOne(
          { _id: req.body.taskId },
          { description: req.body.description }
        );
        const board = await Board.findOne({ _id: req.body.boardId })
          .populate({
            path: 'columns',
            populate: {
              path: 'tasks',
              model: 'task',
              populate: {
                path: 'comments.postedBy'
              }
            }
          })
          .populate('users.idUser');
        return res.json({ board: board });
      } else {
        return res.json({ error: 'Task hoặc bảng không tồn tại !' });
      }
    } catch (err) {
      console.log(err);
      return res.json({ error: 'Có lỗi xảy ra, vui lòng thử lại sau!' });
    }
  }

  static async deleteUserFromBoard(req: any, res: any) {
    try {
      const boardId = req.body.boardId;
      const userId = req.body.userId;
      const board = await Board.findOne({ _id: boardId });

      if (board) {
        const userInBoardCheck = await Board.findOne({
          _id: boardId,
          users: { $elemMatch: { idUser: userId } }
        });
        if (userInBoardCheck) {
          await Board.updateOne(
            { _id: boardId },
            { $pull: { users: { idUser: userId } } }
          );
          const data = await Board.findOne({ _id: boardId })
            .populate({
              path: 'columns',
              populate: {
                path: 'tasks',
                model: 'task',
                populate: {
                  path: 'comments.postedBy'
                }
              }
            })
            .populate('users.idUser');
          return res.json({
            message: 'Xóa thành công người dùng khỏi board',
            board: data
          });
        } else {
          return res.json({
            error: 'Không tồn tại người dùng trong board!'
          });
        }
      } else {
        return res.json({ error: 'Có lỗi xảy ra, board không tồn tại!' });
      }
    } catch (err) {
      console.log(err);
      return res.json({ message: 'Có lỗi xảy ra, vui lòng thử lại!' });
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
        })
          .populate({
            path: 'columns',
            populate: {
              path: 'tasks',
              model: 'task',
              populate: {
                path: 'comments.postedBy'
              }
            }
          })
          .populate('users.idUser');
        return res.json({ board: boardToFE });
      } else {
        return res.json({ error: 'Bảng hoặc task không tồn tại!' });
      }
    } catch (err) {
      console.log(err);
      return res.json({ error: 'Có lỗi xảy ra, vui lòng thử lại sau!' });
    }
  }

  static async deleteFileOnTask(req: any, res: any) {
    try {
      const task = await Task.findOne({ _id: req.body.taskId });
      const board = await Board.findOne({ _id: req.body.boardId });
      if (task && board) {
        Task.updateOne(
          { _id: req.body.taskId },
          {
            $pull: {
              files: { url: req.body.url }
            }
          }
        ).exec();
        const boardToFE = await Board.findOne({
          _id: req.body.boardId
        })
          .populate({
            path: 'columns',
            populate: {
              path: 'tasks',
              model: 'task',
              populate: {
                path: 'comments.postedBy'
              }
            }
          })
          .populate('users.idUser');
        return res.json({ board: boardToFE });
      } else {
        return res.json({ error: 'Bảng hoặc task không tồn tại!' });
      }
    } catch (err) {
      console.log(err);
      return res.json({ error: 'Có lỗi xảy ra, vui lòng thử lại sau!' });
    }
  }

  static async deleteCol(req: any, res: any) {
    try {
      const board = await Board.findById(req.body.boardId);
      const column = await Column.findById(req.body.colId);

      if (board && column) {
        const roleCheck = board.users.find(
          (item) => item.idUser.toString() === req.body.localUser._id
        );
        if (roleCheck.role === 'admin') {
          await Column.findByIdAndDelete(req.body.colId);
          const dataToFe = await Board.findById(req.body.boardId)
            .populate({
              path: 'columns',
              populate: {
                path: 'tasks',
                model: 'task',
                populate: {
                  path: 'comments.postedBy'
                }
              }
            })
            .populate('users.idUser');
          return res.json({ board: dataToFe });
        } else {
          return res.json({
            message: 'Chỉ admin mới có thể xóa được bảng này'
          });
        }
      } else {
        return res.json({ error: 'Bảng hoặc cột không tồn tại' });
      }
    } catch (err) {
      console.log(err);
      return res.json({ error: 'Có lỗi xảy ra, vui lòng thử lại sau!' });
    }
  }

  static async deleteTask(req: any, res: any) {
    try {
      const task = await Task.findById(req.body.taskId);
      const board = await Board.findById(req.body.boardId);
      if (task && board) {
        await Task.findByIdAndDelete(req.body.taskId);
        const dataToFe = await Board.findById(req.body.boardId)
          .populate({
            path: 'columns',
            populate: {
              path: 'tasks',
              model: 'task',
              populate: {
                path: 'comments.postedBy'
              }
            }
          })
          .populate('users.idUser');
        return res.json({ board: dataToFe });
      } else {
        return res.json({
          error: 'Có lỗi xảy ra, bảng hoặc task không tồn tại!'
        });
      }
    } catch (err) {
      console.log(err);
      return res.json({ error: 'Có lỗi xảy ra, vui lòng thử lại sau!' });
    }
  }

  static async deleteBoard(req: any, res: any) {
    try {
      const board = await Board.findById(req.query.id);
      if (board) {
        const ws = await WorkSpace.findOne({ 'boards.board': req.query.id });
        const user = board.users.find(
          (item) => item.idUser.toString() === req.query.u
        );
        if (user && user.role === 'admin') {
          await WorkSpace.updateOne(
            { 'boards.board': req.query.id },
            { $pull: { boards: { board: req.query.id } } }
          );
          await Board.findByIdAndDelete(req.query.id);
          const dataToFe = await WorkSpace.findOne({ _id: ws._id });
          return res.json({ workspace: dataToFe });
        } else {
          return res.json({
            error: 'Bạn không có thẩm quyền thực hiện thao tác này!'
          });
        }
      } else {
        return res.json({ error: 'Bảng không tồn tại!' });
      }
    } catch (err) {
      console.log(err);
      return res.json({ error: 'Có lỗi xảy ra, vui lòng thử lại sau!' });
    }
  }

  static async changeColName(req: any, res: any) {
    try {
      const board = await Board.findById(req.body.boardId);
      const column = await Column.findById(req.body.columnId);
      if (board && column) {
        await Column.updateOne(
          { _id: req.body.columnId },
          { title: req.body.title }
        );
        const dataToFe = await Board.findById(req.body.boardId)
          .populate({
            path: 'columns',
            populate: {
              path: 'tasks',
              model: 'task',
              populate: {
                path: 'comments.postedBy'
              }
            }
          })
          .populate('users.idUser');
        return res.json({ board: dataToFe });
      } else {
        return res.json({ error: 'Bảng hoặc cột không tồn tại!' });
      }
    } catch (err) {
      console.log(err);
      return res.json({ error: 'Có lỗi xảy ra, vui lòng thử lại sau!' });
    }
  }

  static async updateNotificationStatus(req: any, res: any) {
    try {
      const user = await User.findById(req.body.userId);
      if (user) {
        await User.updateOne(
          {
            _id: req.body.userId,
            'notification.message': req.body.message,
            'notification.time': req.body.time
          },
          {
            $set: {
              'notification.$.status': 'true'
            }
          }
        );

        const dataToFe = await User.findById(req.body.userId);
        return res.json({ data: dataToFe });
      } else {
        return res.json({ error: 'User not found!' });
      }
    } catch (err) {
      console.log(err);
      return res.json({ error: 'Có lỗi xảy ra, vui lòng thử lại sau!' });
    }
  }

  static async taskComment(req: any, res: any) {
    try {
      const board = await Board.findById(req.body.boardId);
      const task = await Task.findById(req.body.task._id);
      if (task && board) {
        const user = await User.findById(req.body.user._id);
        if (user) {
          const comment = {
            comment: req.body.comment,
            postedBy: req.body.user._id
          };
          await Task.updateOne(
            { _id: req.body.task._id },
            { $push: { comments: comment } }
          );
          const dataToFe = await Board.findById(req.body.boardId)
            .populate({
              path: 'columns',
              populate: {
                path: 'tasks',
                model: 'task',
                populate: {
                  path: 'comments.postedBy'
                }
              }
            })
            .populate('users.idUser');
          return res.json({ board: dataToFe });
        } else {
          return res.json({ error: 'User not found!' });
        }
      } else {
        return res.json({ error: 'Task not found!' });
      }
    } catch (err) {
      console.log(err);
      return res.json({ error: 'Có lỗi xảy ra, vui lòng thử lại sau!' });
    }
  }
}
