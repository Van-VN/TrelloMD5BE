
import { Router } from 'express';
import ColumnOrderController from '../controllers/columnOrder.controller';
const columnOrderRoute = Router();

columnOrderRoute.get('/columnOrder/create', ColumnOrderController.CreateColection);

export default columnOrderRoute;
