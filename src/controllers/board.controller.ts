import Board from "../models/schemas/board.model";
import User from "../models/schemas/user.model";
import WorkSpace from '../models/schemas/workspace.model';

export default class BoardController {
  static async createBoard(req: any, res: any) {
    try {
      const workspace = await WorkSpace.findOne({_id: req.body.workspace}).populate('boards.board')

      // @ts-ignore
      const titleCheck = workspace.boards.some(boardObj => boardObj.board.title === req.body.title);
      if (titleCheck) {
        return res.json({
          errorMessage: 'Board already exists'
        })
      } else {
        const user = await User.findOne({_id: req.body.userID})
        const board = new Board({
          title: req.body.title,
          backgroundImage: req.body.backgroundImage,
          users: [{
            role: "admin",
            idUser: user
          }]
        });
        if (await board.save()) {
          workspace.boards.push({
            board: board._id,
          })
          workspace.save()
          return res.json({
            message: `create board successfully`,
            board: board,
            workspaceId: workspace._id
          })
        }

      }
    } catch (error) {
      console.log(error);
      return res.json({
        errorMessage: `Something went wrong`
      })
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
      const isIdUser = boardCheck.users.some(user => user.idUser.toString() === userCheck._id.toString());
      if (isIdUser) {
        return res.json({
          message: `User ${req.params.nameMember} already on board`
        });
      } else {
        boardCheck.users.push({
          idUser: userCheck._id,
          role: ""
        })
        await Board.updateOne(
          { _id: req.params.idBoard },
          { $set: { users: boardCheck.users } }
        )

        return res.json({
          message: `Add member ${req.params.nameMember} successfully`
        });
      }

    }
  }
}