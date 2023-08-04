
import { Router } from 'express';
import { auth } from '../middleware/auth';
import WorkSpaceController from '../controllers/workSpace.controller';
const workSpaceRoute = Router();

workSpaceRoute.get('/workspaces',auth, WorkSpaceController.listWorkspaces);

export default workSpaceRoute;
