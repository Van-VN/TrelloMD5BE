import Board from "../models/schemas/board.model";
import User from "../models/schemas/user.model";

export default class BoardController {
  static async createBoard(req: any, res: any) {
    try {
      const titleCheck = await Board.findOne({ title: req.body.title });
      if (titleCheck) {
        return res.json({
          message: 'Board already exists'
        })
      } else {
        const board = new Board({
          title: req.body.title,
          users: []
        });
        if (await board.save()) {
          return res.json({
            message: `create board successfully`
          })
        }

      }
    } catch (error) {
      console.log(error);
      return res.json({
        message: `Something went wrong`
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