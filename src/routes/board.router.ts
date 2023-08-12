import { Router } from 'express';
import BoardController from '../controllers/board.controller';
import ColumnController from '../controllers/column.controller';
import { auth } from '../middleware/auth';
const boardRoute = Router();
import multer from 'multer';
const upload = multer();

boardRoute.post('/board', upload.none(), BoardController.createBoard);
boardRoute.put(
  '/board/add/:idBoard-:nameMember',
  auth,
  BoardController.addMember
);
boardRoute.get('/b/:id', auth, BoardController.getBoardDetail);
boardRoute.post(
  '/b/addColumn',
  upload.none(),
  auth,
  ColumnController.addColumnToBoard
);

export default boardRoute;
