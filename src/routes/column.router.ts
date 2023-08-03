
import { Router } from 'express';
import ColumnController from '../controllers/column.controller';
const columnRoute = Router();

columnRoute.get('/column/create', ColumnController.CreateColection);

export default columnRoute;
