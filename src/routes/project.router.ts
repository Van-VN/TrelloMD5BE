
import { Router } from 'express';
import ProjectController from '../controllers/project.controller';
const projectRoute = Router();

projectRoute.get('/project/create', ProjectController.CreateColection);

export default projectRoute;
