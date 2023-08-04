
import { Router } from 'express';
import BoardController from '../controllers/board.controller';
import { auth } from '../middleware/auth';
const boardRoute = Router();

boardRoute.post('/board',auth, BoardController.createBoard);
boardRoute.put('/board/add/:idBoard-:nameMember',auth, BoardController.addMember);


export default boardRoute;
