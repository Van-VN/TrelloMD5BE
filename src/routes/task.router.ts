import TaskController from '../controllers/task.controller';
import { Router } from 'express';
const taskRoute = Router();

taskRoute.get('/task/create', TaskController.CreateColection);

export default taskRoute;
