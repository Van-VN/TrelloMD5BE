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
boardRoute.patch(
  '/b/updateBoardTitle',
  upload.none(),
  auth,
  BoardController.updateBoardTitle
);
boardRoute.get('/b/:id', auth, BoardController.getBoardDetail);
boardRoute.post(
  '/b/addColumn',
  upload.none(),
  auth,
  ColumnController.addColumnToBoard
);
boardRoute.patch(
  '/b/update',
  upload.none(),
  auth,
  BoardController.updateDragDrop
);
boardRoute.post(
  '/b/addTask',
  upload.none(),
  auth,
  ColumnController.addTaskToCol
);
boardRoute.patch(
  '/b/updateDragTask',
  upload.none(),
  auth,
  ColumnController.updateDragDropTask
);
boardRoute.post(
  '/b/add-user',
  upload.none(),
  auth,
  ColumnController.addUserToBoard
);
boardRoute.post(
  '/b/change-role',
  upload.none(),
  auth,
  ColumnController.changeRole
);
boardRoute.patch(
  '/b/updateTaskTitle',
  upload.none(),
  auth,
  ColumnController.updateTaskTitle
);
boardRoute.post(
  '/b/getTaskInfo',
  upload.none(),
  auth,
  BoardController.getTaskInfo
);
boardRoute.post(
  '/b/updateTaskDescription',
  upload.none(),
  auth,
  BoardController.updateTaskDescription
);
boardRoute.post(
  '/b/deleteUserFromBoard',
  upload.none(),
  auth,
  BoardController.deleteUserFromBoard
);
boardRoute.post(
  '/b/addFileToTask',
  upload.none(),
  auth,
  BoardController.addFileToTask
);
boardRoute.patch(
  '/b/deleteFileOnTask',
  upload.none(),
  auth,
  BoardController.deleteFileOnTask
);
boardRoute.patch(
  '/b/deleteCol',
  upload.none(),
  auth,
  BoardController.deleteCol
);
boardRoute.patch(
  '/b/deleteTask',
  upload.none(),
  auth,
  BoardController.deleteTask
);
boardRoute.patch(
  '/b/changeColName',
  upload.none(),
  auth,
  BoardController.changeColName
);
boardRoute.delete('/b/delete/', auth, BoardController.deleteBoard);

export default boardRoute;
